import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';

export function useCarneLeao() {
  const [mesRef, setMesRef] = useState(new Date());
  const [pago, setPago] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dadosFiscais, setDadosFiscais] = useState({
    faturamentoBruto: 0,
    despesasDedutiveis: 0,
    baseCalculo: 0,
    aliquota: 0,
    impostoDevido: 0,
  });

  const carregarDados = useCallback(async (data: Date) => {
    setLoading(true);
    try {
      const mes = String(data.getMonth() + 1).padStart(
        2,
        '0',
      );
      const ano = data.getFullYear();
      const periodoLike = `${ano}-${mes}-%`;

      // 1. Rendimentos Brutos (Ganhos do mês)
      const receita: any = await db.getFirstAsync(
        `SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao LIKE ?`,
        [periodoLike],
      );
      const faturamentoBruto = receita?.total || 0;

      // 2. Despesas Dedutíveis (Gastos com combustível, oficina, etc.)
      const despesas: any = await db.getFirstAsync(
        `SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'despesa' AND data_transacao LIKE ?`,
        [periodoLike],
      );
      const despesasDedutiveis = despesas?.total || 0;

      // Base de Cálculo (O que sobrou após abater os gastos do trabalho)
      let baseCalculo =
        faturamentoBruto - despesasDedutiveis;
      if (baseCalculo < 0) baseCalculo = 0;

      // Tabela de IRPF em vigor (Valores mensais aproximados)
      let aliquota = 0;
      let impostoDevido = 0;

      if (baseCalculo > 4664.68) {
        aliquota = 27.5;
        impostoDevido = baseCalculo * 0.275 - 896.0;
      } else if (baseCalculo > 3751.05) {
        aliquota = 22.5;
        impostoDevido = baseCalculo * 0.225 - 662.77;
      } else if (baseCalculo > 2826.65) {
        aliquota = 15;
        impostoDevido = baseCalculo * 0.15 - 381.44;
      } else if (baseCalculo > 2259.2) {
        aliquota = 7.5;
        impostoDevido = baseCalculo * 0.075 - 169.44;
      }

      if (impostoDevido < 0) impostoDevido = 0;

      setDadosFiscais({
        faturamentoBruto,
        despesasDedutiveis,
        baseCalculo,
        aliquota,
        impostoDevido,
      });
    } catch (error) {
      console.error(
        'Erro ao carregar dados do Carnê-Leão:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Dispara a busca toda vez que a tela entra em foco ou o mês muda
  useFocusEffect(
    useCallback(() => {
      carregarDados(mesRef);
    }, [mesRef, carregarDados]),
  );

  const mudarMes = useCallback(
    (direcao: number) => {
      const novoMes = new Date(mesRef);
      novoMes.setMonth(mesRef.getMonth() + direcao);
      setMesRef(novoMes);
      setPago(false);
    },
    [mesRef],
  );

  const marcarComoPago = useCallback(() => {
    setPago(true);
    Alert.alert(
      'Sucesso',
      'Pagamento registado no MeuCorre!',
    );
  }, []);

  const mesLabel = mesRef.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return {
    loading,
    mesLabel,
    mudarMes,
    pago,
    marcarComoPago,
    dadosFiscais,
  };
}
