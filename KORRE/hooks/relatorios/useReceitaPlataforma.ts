import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';

export function useReceitaPlataforma() {
  const [loading, setLoading] = useState(true);

  const periodos = [
    { id: 'hoje', nome: 'Hoje' },
    { id: 'semana', nome: 'Esta Semana' },
    { id: 'mes', nome: 'Este Mês' },
    { id: 'ano', nome: 'Este Ano' },
    { id: 'tudo', nome: 'Todo o Período' },
  ];

  const [periodoObj, setPeriodoObj] = useState(periodos[2]); // Default: Este Mês
  const [veiculoObj, setVeiculoObj] = useState<{
    id: number | 'todos';
    nome: string;
  }>({
    id: 'todos',
    nome: 'Todos os Veículos',
  });
  const [veiculosLista, setVeiculosLista] = useState<any[]>(
    [],
  );

  const [plataformas, setPlataformas] = useState<any[]>([]);
  const [totalReceita, setTotalReceita] = useState(0);

  // Modais
  const [modalPeriodo, setModalPeriodo] = useState(false);
  const [modalVeiculo, setModalVeiculo] = useState(false);

  // Cores das marcas para o gráfico de barras
  const CORES_APPS: Record<string, string> = {
    uber: '#000000', // A interface trocará para branco se for tema escuro
    '99': '#F6D142',
    ifood: '#EA1D2C',
    lalamove: '#F26624',
    indrive: '#00ED6D',
    particular: '#00C853',
  };

  const carregarDados = useCallback(
    async (pId: string, vId: number | 'todos') => {
      setLoading(true);
      try {
        // Carrega os veículos disponíveis
        const frota: any[] = await db.getAllAsync(
          'SELECT * FROM veiculos',
        );
        setVeiculosLista(frota);

        let query = `
        SELECT t.valor, c.nome as categoria_nome 
        FROM transacoes_financeiras t
        LEFT JOIN categorias_financeiras c ON t.categoria_id = c.id
        WHERE t.tipo = 'ganho'
      `;
        const params: any[] = [];

        if (vId !== 'todos') {
          query += ` AND t.veiculo_id = ?`;
          params.push(vId);
        }

        const hoje = new Date();
        let dataInicioStr = '';

        if (pId === 'hoje') {
          dataInicioStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')} 00:00:00`;
        } else if (pId === 'semana') {
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(
            hoje.getDate() - hoje.getDay(),
          ); // Volta para o último Domingo
          dataInicioStr = `${inicioSemana.getFullYear()}-${String(inicioSemana.getMonth() + 1).padStart(2, '0')}-${String(inicioSemana.getDate()).padStart(2, '0')} 00:00:00`;
        } else if (pId === 'mes') {
          dataInicioStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01 00:00:00`;
        } else if (pId === 'ano') {
          dataInicioStr = `${hoje.getFullYear()}-01-01 00:00:00`;
        }

        if (dataInicioStr) {
          query += ` AND t.data_transacao >= ?`;
          params.push(dataInicioStr);
        }

        const transacoes: any[] = await db.getAllAsync(
          query,
          params,
        );

        let total = 0;
        const mapa = new Map<
          string,
          { valor: number; qtd: number }
        >();

        transacoes.forEach((t) => {
          const val = t.valor || 0;
          const nome =
            t.categoria_nome || 'Outros Rendimentos';
          total += val;
          const atual = mapa.get(nome) || {
            valor: 0,
            qtd: 0,
          };
          mapa.set(nome, {
            valor: atual.valor + val,
            qtd: atual.qtd + 1,
          });
        });

        const arrayPlataformas = Array.from(
          mapa.entries(),
        ).map(([nome, dados], index) => {
          const nomeLower = nome.toLowerCase();
          let cor = '#888888'; // Cor genérica caso não seja de uma app conhecida
          for (const key in CORES_APPS) {
            if (nomeLower.includes(key)) {
              cor = CORES_APPS[key];
              break;
            }
          }
          return {
            id: index.toString(),
            nome,
            valor: dados.valor,
            qtd: dados.qtd,
            corBarra: cor,
            percentual:
              total > 0
                ? Math.round((dados.valor / total) * 100)
                : 0,
          };
        });

        // Ordena do maior para o menor
        arrayPlataformas.sort((a, b) => b.valor - a.valor);

        setTotalReceita(total);
        setPlataformas(arrayPlataformas);
      } catch (error) {
        console.error(
          'Erro ao carregar receitas por plataforma:',
          error,
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados(periodoObj.id, veiculoObj.id);
    }, [carregarDados, periodoObj, veiculoObj]),
  );

  const trocarPeriodo = (p: any) => {
    setPeriodoObj(p);
    setModalPeriodo(false);
  };

  const trocarVeiculo = (v: any) => {
    setVeiculoObj(v);
    setModalVeiculo(false);
  };

  return {
    loading,
    periodos,
    periodoObj,
    veiculosLista,
    veiculoObj,
    plataformas,
    totalReceita,
    modalPeriodo,
    setModalPeriodo,
    modalVeiculo,
    setModalVeiculo,
    trocarPeriodo,
    trocarVeiculo,
  };
}
