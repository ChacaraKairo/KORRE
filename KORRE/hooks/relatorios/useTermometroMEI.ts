import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';
import { logger } from '../../utils/logger';

const LIMITE_MENSAL_MEI = 6750;
const LIMITE_ANUAL_MEI = 81000;
const DIA_VENCIMENTO_DAS = 20;

type DadosTermometroMEI = {
  mensal: {
    total: number;
    limite: number;
    porcentagem: number;
  };
  anual: {
    total: number;
    limite: number;
    porcentagem: number;
  };
  mediaMensal: number;
  restanteMes: number;
  restanteAno: number;
  projecaoAnual: number;
  das: {
    chave: string;
    pago: boolean;
    vencimentoDia: number;
    vencido: boolean;
  };
  proporcional: {
    limite: number;
    mesesAtivos: number;
  };
  alerta: boolean;
  projecaoEstouro: boolean;
};

const dadosIniciais: DadosTermometroMEI = {
  mensal: {
    total: 0,
    limite: LIMITE_MENSAL_MEI,
    porcentagem: 0,
  },
  anual: {
    total: 0,
    limite: LIMITE_ANUAL_MEI,
    porcentagem: 0,
  },
  mediaMensal: 0,
  restanteMes: LIMITE_MENSAL_MEI,
  restanteAno: LIMITE_ANUAL_MEI,
  projecaoAnual: 0,
  das: {
    chave: '',
    pago: false,
    vencimentoDia: DIA_VENCIMENTO_DAS,
    vencido: false,
  },
  proporcional: {
    limite: LIMITE_ANUAL_MEI,
    mesesAtivos: 12,
  },
  alerta: false,
  projecaoEstouro: false,
};

/**
 * Executa a função de use termometro mei.
 */
export function useTermometroMEI() {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] =
    useState<DadosTermometroMEI>(dadosIniciais);

  const carregarTermometro = useCallback(async () => {
    setLoading(true);
    try {
      const agora = new Date();
      const anoAtual = agora.getFullYear();
      const mesAtualNum = agora.getMonth() + 1;
      const mesAtualStr = String(mesAtualNum).padStart(2, '0');
      const chaveDas = `mei_das_pago_${anoAtual}-${mesAtualStr}`;

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS configuracoes_app (
          chave TEXT PRIMARY KEY,
          valor TEXT
        );
      `);

      const usuario = await db.getFirstAsync<{
        data_cadastro?: string | null;
      }>('SELECT data_cadastro FROM perfil_usuario LIMIT 1');

      if (!usuario) {
        setDados(dadosIniciais);
        return;
      }

      const dataCadastro = usuario.data_cadastro
        ? new Date(usuario.data_cadastro)
        : new Date(anoAtual, 0, 1);

      let mesesAtivosNoAno = 12;
      if (dataCadastro.getFullYear() === anoAtual) {
        mesesAtivosNoAno = 12 - dataCadastro.getMonth();
      }

      const limiteAnualProporcional =
        mesesAtivosNoAno * LIMITE_MENSAL_MEI;

      const dataInicioAno = `${anoAtual}-01-01 00:00:00`;
      const dataInicioMes = `${anoAtual}-${mesAtualStr}-01 00:00:00`;

      const [resultAno, resultMes, dasConfig] =
        await Promise.all([
          db.getFirstAsync<{ total: number | null }>(
            "SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao >= ?",
            [dataInicioAno],
          ),
          db.getFirstAsync<{ total: number | null }>(
            "SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao >= ?",
            [dataInicioMes],
          ),
          db.getFirstAsync<{ valor: string }>(
            'SELECT valor FROM configuracoes_app WHERE chave = ?',
            [chaveDas],
          ),
        ]);

      const totalAno = resultAno?.total || 0;
      const totalMes = resultMes?.total || 0;
      const percMensal = (totalMes / LIMITE_MENSAL_MEI) * 100;
      const percAnual =
        (totalAno / limiteAnualProporcional) * 100;

      const mesesPassadosNoAno =
        dataCadastro.getFullYear() === anoAtual
          ? Math.max(1, mesAtualNum - dataCadastro.getMonth())
          : mesAtualNum;
      const mediaMensal = totalAno / mesesPassadosNoAno;
      const projecaoAnual = mediaMensal * mesesAtivosNoAno;
      const dasPago = dasConfig?.valor === 'true';

      setDados({
        mensal: {
          total: totalMes,
          limite: LIMITE_MENSAL_MEI,
          porcentagem: Math.min(percMensal, 100),
        },
        anual: {
          total: totalAno,
          limite: limiteAnualProporcional,
          porcentagem: Math.min(percAnual, 100),
        },
        mediaMensal,
        restanteMes: Math.max(0, LIMITE_MENSAL_MEI - totalMes),
        restanteAno: Math.max(
          0,
          limiteAnualProporcional - totalAno,
        ),
        projecaoAnual,
        das: {
          chave: chaveDas,
          pago: dasPago,
          vencimentoDia: DIA_VENCIMENTO_DAS,
          vencido: agora.getDate() > DIA_VENCIMENTO_DAS && !dasPago,
        },
        proporcional: {
          limite: limiteAnualProporcional,
          mesesAtivos: mesesAtivosNoAno,
        },
        alerta: percMensal >= 80 || percAnual >= 80,
        projecaoEstouro:
          projecaoAnual > limiteAnualProporcional,
      });
    } catch (error) {
      logger.error('Erro no Termometro MEI:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const alternarDasPago = useCallback(async () => {
    if (!dados.das.chave) return;

    await db.runAsync(
      'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
      [dados.das.chave, dados.das.pago ? 'false' : 'true'],
    );
    await carregarTermometro();
  }, [carregarTermometro, dados.das.chave, dados.das.pago]);

  useFocusEffect(
    useCallback(() => {
      carregarTermometro();
    }, [carregarTermometro]),
  );

  return {
    dados,
    loading,
    atualizar: carregarTermometro,
    alternarDasPago,
  };
}
