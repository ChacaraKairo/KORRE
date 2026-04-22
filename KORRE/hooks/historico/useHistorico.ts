import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';

export function useHistorico() {
  const [loading, setLoading] = useState(true);

  const FILTROS_INICIAIS = {
    periodo: 'dia' as
      | 'dia'
      | 'semana'
      | 'mes'
      | 'personalizado',
    dataRef: new Date(),
    dataInicioCustom: null as Date | null,
    dataFimCustom: null as Date | null,
    tipo: 'todos' as 'todos' | 'ganho' | 'despesa',
    veiculoId: 'todos' as 'todos' | number,
    categoriasSelecionadas: [] as number[],
  };

  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  // ESTADOS DE DADOS
  const [movimentacoes, setMovimentacoes] = useState<any[]>(
    [],
  );
  const [categoriasDisponiveis, setCategoriasDisponiveis] =
    useState<any[]>([]);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [dadosResumo, setDadosResumo] = useState({
    ganhos: 0,
    gastos: 0,
    saldo: 0,
  });

  // ESTADOS DE UI
  const [registroSelecionado, setRegistroSelecionado] =
    useState<any>(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [modalFiltro, setModalFiltro] = useState(false);

  // Formatação baseada na data local para evitar problemas de fuso horário (Timezone UTC)
  const formatSQL = (d: Date) => {
    const pad = (n: number) =>
      n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const resetarFiltros = useCallback(() => {
    setFiltros((prev) => {
      const hoje = new Date().toDateString();
      if (
        prev.periodo === 'dia' &&
        prev.dataRef.toDateString() === hoje &&
        prev.categoriasSelecionadas.length === 0 &&
        prev.tipo === 'todos'
      ) {
        return prev;
      }
      return { ...FILTROS_INICIAIS, dataRef: new Date() };
    });
  }, []);

  const calcularIntervalo = useCallback(() => {
    const {
      periodo,
      dataRef,
      dataInicioCustom,
      dataFimCustom,
    } = filtros;
    let inicio = '';
    let fim = '';

    if (periodo === 'dia') {
      const d = formatSQL(dataRef);
      inicio = `${d} 00:00:00`;
      fim = `${d} 23:59:59`;
    } else if (periodo === 'semana') {
      const start = new Date(dataRef);
      start.setDate(dataRef.getDate() - dataRef.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      inicio = `${formatSQL(start)} 00:00:00`;
      fim = `${formatSQL(end)} 23:59:59`;
    } else if (periodo === 'mes') {
      const ano = dataRef.getFullYear();
      const mes = dataRef.getMonth();
      inicio = `${formatSQL(new Date(ano, mes, 1))} 00:00:00`;
      fim = `${formatSQL(new Date(ano, mes + 1, 0))} 23:59:59`;
    } else if (
      periodo === 'personalizado' &&
      dataInicioCustom &&
      dataFimCustom
    ) {
      inicio = `${formatSQL(dataInicioCustom)} 00:00:00`;
      fim = `${formatSQL(dataFimCustom)} 23:59:59`;
    }
    return { inicio, fim };
  }, [filtros]);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const { inicio, fim } = calcularIntervalo();
      if (!inicio || !fim) {
        setLoading(false);
        return;
      }

      // CORREÇÃO: Usando a coluna 'icone' em vez de 'icone_id'
      const cats = await db.getAllAsync(`
        SELECT DISTINCT c.id, c.nome, c.cor, c.icone as icon_id, t.tipo
        FROM categorias_financeiras c
        JOIN transacoes_financeiras t ON t.categoria_id = c.id
      `);
      setCategoriasDisponiveis(cats);

      let query = `
        SELECT t.*, c.nome as categoria_nome, c.cor as categoria_cor, c.icone as categoria_icon
        FROM transacoes_financeiras t
        LEFT JOIN categorias_financeiras c ON t.categoria_id = c.id
        WHERE t.data_transacao >= ? AND t.data_transacao <= ?
      `;
      const params: any[] = [inicio, fim];

      if (filtros.veiculoId !== 'todos') {
        query += ' AND t.veiculo_id = ?';
        params.push(filtros.veiculoId);
      }
      if (filtros.tipo !== 'todos') {
        query += ' AND t.tipo = ?';
        params.push(filtros.tipo);
      }
      if (filtros.categoriasSelecionadas.length > 0) {
        const placeholders = filtros.categoriasSelecionadas
          .map(() => '?')
          .join(',');
        query += ` AND t.categoria_id IN (${placeholders})`;
        params.push(...filtros.categoriasSelecionadas);
      }

      const rows = await db.getAllAsync(
        query + ' ORDER BY t.data_transacao DESC',
        params,
      );

      let sumGanhos = 0;
      let sumGastos = 0;
      const formatadas = rows.map((t: any) => {
        const val = t.valor || 0;
        t.tipo === 'ganho'
          ? (sumGanhos += val)
          : (sumGastos += val);
        return {
          ...t,
          categoria: t.categoria_nome || 'Outros',
          cor: t.categoria_cor || '#888',
          iconId: t.categoria_icon || 'Briefcase',
          dataExibicao: t.data_transacao
            .split(' ')[0]
            .split('-')
            .reverse()
            .slice(0, 2)
            .join('/'),
          dataOriginal: t.data_transacao,
        };
      });

      setDadosResumo({
        ganhos: sumGanhos,
        gastos: sumGastos,
        saldo: sumGanhos - sumGastos,
      });
      setMovimentacoes(formatadas);

      const frotas = await db.getAllAsync(
        'SELECT * FROM veiculos',
      );
      setVeiculos(frotas);
    } catch (e) {
      console.error('Erro ao carregar histórico:', e);
    } finally {
      setLoading(false);
    }
  }, [filtros, calcularIntervalo]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useFocusEffect(
    useCallback(() => {
      resetarFiltros();
    }, [resetarFiltros]),
  );

  const atualizarFiltros = (
    novosFiltros: Partial<typeof filtros>,
  ) => {
    setFiltros((prev) => ({ ...prev, ...novosFiltros }));
  };

  const navegarData = (dir: number) => {
    const d = new Date(filtros.dataRef);
    if (filtros.periodo === 'dia')
      d.setDate(d.getDate() + dir);
    else if (filtros.periodo === 'semana')
      d.setDate(d.getDate() + dir * 7);
    else if (filtros.periodo === 'mes')
      d.setMonth(d.getMonth() + dir);
    atualizarFiltros({ dataRef: d });
  };

  const deletarRegistro = useCallback(() => {
    if (!registroSelecionado) return;
    Alert.alert('Apagar', 'Deseja excluir este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await db.runAsync(
              'DELETE FROM transacoes_financeiras WHERE id = ?',
              [registroSelecionado.id],
            );
            await carregarDados();
            setRegistroSelecionado(null);
          } catch (e) {
            Alert.alert(
              'Erro',
              'Não foi possível apagar o registro.',
            );
          }
        },
      },
    ]);
  }, [registroSelecionado, carregarDados]);

  const getLabelData = useCallback(() => {
    const {
      periodo,
      dataRef,
      dataInicioCustom,
      dataFimCustom,
    } = filtros;
    if (periodo === 'dia') {
      return dataRef.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } else if (periodo === 'semana') {
      const start = new Date(dataRef);
      start.setDate(dataRef.getDate() - dataRef.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
    } else if (periodo === 'mes') {
      return dataRef.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });
    } else if (
      periodo === 'personalizado' &&
      dataInicioCustom &&
      dataFimCustom
    ) {
      return `${dataInicioCustom.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${dataFimCustom.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
    }
    return 'Selecionar Data';
  }, [filtros]);

  const salvarEdicao = async (
    id: number,
    valor: number,
    data: Date,
  ) => {
    try {
      const pad = (n: number) =>
        n.toString().padStart(2, '0');
      const sqlData = `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())} ${pad(data.getHours())}:${pad(data.getMinutes())}:${pad(data.getSeconds())}`;

      await db.runAsync(
        'UPDATE transacoes_financeiras SET valor = ?, data_transacao = ? WHERE id = ?',
        [valor, sqlData, id],
      );
      carregarDados();
      setModalEdicao(false);
      setRegistroSelecionado(null);
    } catch (e) {
      Alert.alert('Erro ao salvar');
    }
  };

  return {
    loading,
    filtros,
    atualizarFiltros,
    veiculos,
    movimentacoes,
    categoriasDisponiveis,
    dadosResumo,
    registroSelecionado,
    setRegistroSelecionado,
    modalEdicao,
    setModalEdicao,
    modalFiltro,
    setModalFiltro,
    navegarData,
    salvarEdicao,
    deletarRegistro,
    getLabelData,
    carregarDados,
  };
}
