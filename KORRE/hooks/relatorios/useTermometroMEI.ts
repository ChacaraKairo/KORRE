import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';

// Regras Oficiais MEI 2026
const LIMITE_MENSAL_MEI = 6750;
const LIMITE_ANUAL_MEI = 81000;

export function useTermometroMEI() {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState({
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
    proporcional: {
      limite: LIMITE_ANUAL_MEI,
      mesesAtivos: 12,
    },
    alerta: false,
    projecaoEstouro: false,
  });

  const carregarTermometro = useCallback(async () => {
    setLoading(true);
    try {
      const agora = new Date();
      const anoAtual = agora.getFullYear();
      const mesAtualNum = agora.getMonth() + 1;
      const mesAtualStr = mesAtualNum
        .toString()
        .padStart(2, '0');

      // 1. Busca perfil para calcular proporcionalidade
      const usuario: any = await db.getFirstAsync(
        'SELECT data_cadastro FROM perfil_usuario LIMIT 1',
      );

      if (!usuario) {
        setLoading(false);
        return;
      }

      const dataCadastro = new Date(usuario.data_cadastro);
      let mesesAtivosNoAno = 12;

      // Se o MEI foi aberto este ano, o limite é proporcional
      if (dataCadastro.getFullYear() === anoAtual) {
        // Ex: Cadastro em Abril (mês 3 index), ativos = 12 - 3 = 9 meses
        mesesAtivosNoAno = 12 - dataCadastro.getMonth();
      }

      const limiteAnualProporcional =
        mesesAtivosNoAno * LIMITE_MENSAL_MEI;

      // 2. Soma ganhos do ANO atual (Local Time)
      const dataInicioAno = `${anoAtual}-01-01 00:00:00`;
      const resultAno: any = await db.getFirstAsync(
        "SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao >= ?",
        [dataInicioAno],
      );
      const totalAno = resultAno?.total || 0;

      // 3. Soma ganhos do MÊS atual (Local Time)
      const dataInicioMes = `${anoAtual}-${mesAtualStr}-01 00:00:00`;
      const resultMes: any = await db.getFirstAsync(
        "SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao >= ?",
        [dataInicioMes],
      );
      const totalMes = resultMes?.total || 0;

      // 4. Cálculos de Porcentagem
      const percMensal =
        (totalMes / LIMITE_MENSAL_MEI) * 100;
      const percAnual =
        (totalAno / limiteAnualProporcional) * 100;

      // 5. Projeção de Estouro
      // Calculamos há quantos meses o usuário está trabalhando no ano atual
      const mesesPassadosNoAno =
        dataCadastro.getFullYear() === anoAtual
          ? Math.max(
              1,
              mesAtualNum - dataCadastro.getMonth(),
            )
          : mesAtualNum;

      const mediaMensalReal = totalAno / mesesPassadosNoAno;
      const projecaoFinalAno =
        mediaMensalReal * mesesAtivosNoAno;

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
        proporcional: {
          limite: limiteAnualProporcional,
          mesesAtivos: mesesAtivosNoAno,
        },
        // Alerta liga se atingir 80% de qualquer um dos limites
        alerta: percMensal >= 80 || percAnual >= 80,
        projecaoEstouro:
          projecaoFinalAno > limiteAnualProporcional,
      });
    } catch (e) {
      console.error('Erro no Termômetro MEI:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarTermometro();
    }, [carregarTermometro]),
  );

  return { dados, loading, atualizar: carregarTermometro };
}
