import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import db from '../../database/DatabaseInit';
import { getFraseDoMomento } from './frasesService';

export const useDashboard = () => {
  const { userId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [frase, setFrase] = useState('');
  const [veiculo, setVeiculo] = useState<any>(null);
  const [movimentacoes, setMovimentacoes] = useState<any[]>(
    [],
  );

  // Estados Reais Financeiros (Mockados por enquanto)
  const [ganhos, setGanhos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [meta, setMeta] = useState(0);
  const [tipoMeta, setTipoMeta] = useState<
    'diaria' | 'semanal'
  >('diaria');
  const [ganhosMensal, setGanhosMensal] = useState(0);
  const [gastosMensal, setGastosMensal] = useState(0);
  const [qtdGanhos, setQtdGanhos] = useState(0);
  const [qtdGastos, setQtdGastos] = useState(0);
  const [modalKmAberto, setModalKmAberto] = useState(false);
  const [novoKm, setNovoKm] = useState('');

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          // Define a frase motivacional
          setFrase(getFraseDoMomento());

          let usuarioSalvo: any;

          // Busca usuário (Específico ou o primeiro encontrado)
          if (userId) {
            const idParam = Array.isArray(userId)
              ? userId[0]
              : userId;
            usuarioSalvo = await db.getFirstAsync(
              'SELECT * FROM perfil_usuario WHERE id = ?',
              [idParam],
            );
          } else {
            usuarioSalvo = await db.getFirstAsync(
              'SELECT * FROM perfil_usuario LIMIT 1',
            );
          }
          console.log(
            'LOG: Usuário carregado no Dashboard:',
            usuarioSalvo,
          );

          if (usuarioSalvo) {
            setUsuario(usuarioSalvo);
          }

          // Configura Meta e Tipo baseados no perfil
          const tipoMetaUser =
            usuarioSalvo?.tipo_meta || 'diaria';
          setTipoMeta(tipoMetaUser);

          const valorMeta =
            tipoMetaUser === 'diaria'
              ? usuarioSalvo?.meta_diaria || 0
              : usuarioSalvo?.meta_semanal || 0;
          setMeta(valorMeta);

          // Busca veículo ativo
          const veiculoSalvo: any = await db.getFirstAsync(
            'SELECT * FROM veiculos WHERE ativo = 1 LIMIT 1',
          );
          if (veiculoSalvo) {
            setVeiculo(veiculoSalvo);

            // --- BUSCA DE GANHOS (Lógica Financeira) ---
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(
              hoje.getMonth() + 1,
            ).padStart(2, '0');
            const dia = String(hoje.getDate()).padStart(
              2,
              '0',
            );
            const dataHojeStrLocal = `${ano}-${mes}-${dia}`;
            const dataInicioMesStr = `${ano}-${mes}-01`;

            let queryGanhos = '';
            let paramsGanhos: any[] = [];

            if (tipoMetaUser === 'diaria') {
              // Filtra ganhos do veículo HOJE
              queryGanhos = `
              SELECT SUM(valor) as total, COUNT(*) as qtd 
              FROM transacoes_financeiras 
              WHERE tipo = 'ganho' 
              AND veiculo_id = ? 
              AND data_transacao LIKE ?
            `;
              paramsGanhos = [
                veiculoSalvo.id,
                `${dataHojeStrLocal}%`,
              ];
            } else {
              // Filtra ganhos NA SEMANA (Zera ao Domingo, ou seja, Domingo é o dia 0)
              const diaSemana = hoje.getDay(); // 0 (Dom) a 6 (Sab)
              const inicioSemana = new Date(hoje);
              inicioSemana.setDate(
                hoje.getDate() - diaSemana,
              );

              const anoSem = inicioSemana.getFullYear();
              const mesSem = String(
                inicioSemana.getMonth() + 1,
              ).padStart(2, '0');
              const diaSemStr = String(
                inicioSemana.getDate(),
              ).padStart(2, '0');
              const dataInicioSemanaStr = `${anoSem}-${mesSem}-${diaSemStr}`;

              queryGanhos = `
              SELECT SUM(valor) as total, COUNT(*) as qtd 
              FROM transacoes_financeiras 
              WHERE tipo = 'ganho' 
              AND veiculo_id = ? 
              AND data_transacao >= ?
            `;
              paramsGanhos = [
                veiculoSalvo.id,
                dataInicioSemanaStr,
              ];
            }

            const resultadoGanhos: any =
              await db.getFirstAsync(
                queryGanhos,
                paramsGanhos,
              );
            setGanhos(resultadoGanhos?.total || 0);
            setQtdGanhos(resultadoGanhos?.qtd || 0);

            // --- BUSCA DE GASTOS (Gastos do dia) ---
            const queryGastos = `
          SELECT SUM(valor) as total, COUNT(*) as qtd 
          FROM transacoes_financeiras 
          WHERE tipo = 'despesa' 
          AND veiculo_id = ? 
          AND data_transacao LIKE ?
        `;
            const resultadoGastos: any =
              await db.getFirstAsync(queryGastos, [
                veiculoSalvo.id,
                `${dataHojeStrLocal}%`,
              ]);
            setGastos(resultadoGastos?.total || 0);
            setQtdGastos(resultadoGastos?.qtd || 0);

            // --- BUSCA MENSAL ---
            const queryGanhosMensal = `SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND veiculo_id = ? AND data_transacao >= ?`;
            const resultGanhosMensal: any =
              await db.getFirstAsync(queryGanhosMensal, [
                veiculoSalvo.id,
                dataInicioMesStr,
              ]);
            setGanhosMensal(resultGanhosMensal?.total || 0);

            const queryGastosMensal = `SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'despesa' AND veiculo_id = ? AND data_transacao >= ?`;
            const resultGastosMensal: any =
              await db.getFirstAsync(queryGastosMensal, [
                veiculoSalvo.id,
                dataInicioMesStr,
              ]);
            setGastosMensal(resultGastosMensal?.total || 0);

            // --- BUSCA DE MOVIMENTAÇÕES (Últimos 5 registros) ---
            const ultimosRegistros: any[] =
              await db.getAllAsync(
                `SELECT t.id, t.tipo, t.valor, c.nome as categoria, strftime('%H:%M', t.data_transacao) as hora 
             FROM transacoes_financeiras t
             LEFT JOIN categorias_financeiras c ON t.categoria_id = c.id
             WHERE t.veiculo_id = ? 
             ORDER BY t.data_transacao DESC, t.id DESC 
             LIMIT 5`,
                [veiculoSalvo.id],
              );
            setMovimentacoes(ultimosRegistros);
          }
        } catch (error) {
          console.error(
            'Erro ao carregar dados do dashboard:',
            error,
          );
        } finally {
          setLoading(false);
        }
      };

      carregarDados();
    }, [userId]),
  );

  // Handlers de Ação (Funções de clique)
  const onPressConfig = () =>
    Alert.alert('Definições', 'Abrir definições');
  const onTrocarVeiculo = () =>
    Alert.alert('Navegação', 'Ir para Garagem');
  const onIrParaOficina = () => router.push('/oficina');
  const router = useRouter();

  const onUpdateKm = () => {
    if (veiculo) {
      setNovoKm(veiculo.km_atual?.toString() || '');
      setModalKmAberto(true);
    }
  };

  const salvarKm = async () => {
    if (!novoKm || isNaN(Number(novoKm)) || !veiculo)
      return;

    const kmNumerico = Number(novoKm);

    // Validação: Impede quilometragem menor que a atual
    if (kmNumerico < (veiculo.km_atual || 0)) {
      Alert.alert(
        'Atenção',
        'A nova quilometragem não pode ser menor que a atual.',
      );
      return;
    }

    try {
      await db.runAsync(
        'UPDATE veiculos SET km_atual = ? WHERE id = ?',
        [kmNumerico, veiculo.id],
      );
      setVeiculo({ ...veiculo, km_atual: kmNumerico });
      setModalKmAberto(false);
    } catch (error) {
      console.error('Erro ao atualizar KM:', error);
      Alert.alert(
        'Erro',
        'Não foi possível atualizar a quilometragem.',
      );
    }
  };

  const abrirCalculadora = () =>
    router.push('/calculadora');

  return {
    loading,
    usuario,
    frase,
    veiculo,
    movimentacoes,
    ganhos,
    gastos,
    meta,
    tipoMeta,
    ganhosMensal,
    gastosMensal,
    qtdGanhos,
    qtdGastos,
    onPressConfig,
    onTrocarVeiculo,
    onIrParaOficina,
    onUpdateKm,
    modalKmAberto,
    setModalKmAberto,
    novoKm,
    setNovoKm,
    salvarKm,
    abrirCalculadora,
  };
};
