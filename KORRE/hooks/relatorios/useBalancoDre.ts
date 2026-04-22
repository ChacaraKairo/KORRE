import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';

export function useBalancoDre() {
  const [loading, setLoading] = useState(true);
  const [dataRef, setDataRef] = useState(new Date());

  const [dadosDre, setDadosDre] = useState({
    receitaBruta: 0,
    custosVariaveis: 0,
    custosFixos: 0,
    lucroLiquido: 0,
    margemLucro: 0,
  });

  const carregarDre = useCallback(async (data: Date) => {
    setLoading(true);
    try {
      const mes = String(data.getMonth() + 1).padStart(
        2,
        '0',
      );
      const ano = data.getFullYear();
      const periodoLike = `${ano}-${mes}-%`;

      // 1. Receita Bruta (Ganhos)
      const receita: any = await db.getFirstAsync(
        `SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao LIKE ?`,
        [periodoLike],
      );
      const receitaBruta = receita?.total || 0;

      // 2. Buscar despesas detalhadas para separar Fixo de Variável
      const despesas: any[] = await db.getAllAsync(
        `SELECT t.valor, c.nome as categoria_nome 
         FROM transacoes_financeiras t
         LEFT JOIN categorias_financeiras c ON t.categoria_id = c.id
         WHERE t.tipo = 'despesa' AND t.data_transacao LIKE ?`,
        [periodoLike],
      );

      let custosFixos = 0;
      let custosVariaveis = 0;

      // Palavras-chave que indicam que um custo é Burocrático/Fixo
      const keywordsFixos = [
        'seguro',
        'mei',
        'imposto',
        'internet',
        'plano',
        'aluguel',
        'rastreador',
        'ipva',
        'licenciamento',
        'taxa',
      ];

      despesas.forEach((d) => {
        const catNome = (
          d.categoria_nome || ''
        ).toLowerCase();
        const isFixo = keywordsFixos.some((k) =>
          catNome.includes(k),
        );

        if (isFixo) {
          custosFixos += d.valor;
        } else {
          custosVariaveis += d.valor;
        }
      });

      const lucroLiquido =
        receitaBruta - custosVariaveis - custosFixos;
      const margemLucro =
        receitaBruta > 0
          ? (lucroLiquido / receitaBruta) * 100
          : 0;

      setDadosDre({
        receitaBruta,
        custosVariaveis,
        custosFixos,
        lucroLiquido,
        margemLucro,
      });
    } catch (error) {
      console.error('Erro ao carregar DRE:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza os dados sempre que a tela abrir ou o mês mudar
  useFocusEffect(
    useCallback(() => {
      carregarDre(dataRef);
    }, [dataRef, carregarDre]),
  );

  const alterarPeriodo = (
    direcao: 'anterior' | 'proximo',
  ) => {
    const novaData = new Date(dataRef);
    if (direcao === 'anterior') {
      novaData.setMonth(novaData.getMonth() - 1);
    } else {
      novaData.setMonth(novaData.getMonth() + 1);
    }
    setDataRef(novaData);
  };

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const periodoFormatado = `${meses[dataRef.getMonth()]} de ${dataRef.getFullYear()}`;

  return {
    loading,
    periodo: periodoFormatado,
    dadosDre,
    alterarPeriodo,
  };
}
