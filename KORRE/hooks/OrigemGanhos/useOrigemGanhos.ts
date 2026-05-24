import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  OrigemGanhosRepository,
  type OrigemGanho,
} from '../../database/repositories/OrigemGanhosRepository';
import { showCustomAlert } from '../alert/useCustomAlert';
import { safeBack } from '../../utils/navigation/safeBack';
import { AppRoutes } from '../../constants/routes';

/**
 * Executa a função de use origem ganhos.
 */
export function useOrigemGanhos() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoIcone, setNovoIcone] = useState('Briefcase');
  const [novaCor, setNovaCor] = useState('#00C853');
  const [origens, setOrigens] = useState<OrigemGanho[]>([]);

  const carregarOrigens = useCallback(async () => {
    const lista = await OrigemGanhosRepository.listarOrigens();
    setOrigens(lista);
    setSelecionados(
      lista.filter((origem) => origem.ativo === 1).map((origem) => origem.id),
    );
  }, []);

  useEffect(() => {
    carregarOrigens().catch((error) => {
      console.error('Erro ao carregar origens de ganho:', error);
    });
  }, [carregarOrigens]);

  /**
   * Executa a função de toggle origem.
   */
  const toggleOrigem = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  /**
   * Executa a função de adicionar origem.
   */
  const adicionarOrigem = async () => {
    const nome = novoNome.trim();
    if (!nome) return;

    try {
      await OrigemGanhosRepository.salvarOrigemCustomizada({
        nome,
        categoria: 'Personalizado',
        cor: novaCor,
        icone: novoIcone,
      });

      setNovoNome('');
      setModalAberto(false);
      await carregarOrigens();
    } catch (error) {
      console.error('Erro ao adicionar origem:', error);
      showCustomAlert(
        'Erro',
        'Nao foi possivel registrar esta origem de ganho.',
      );
    }
  };

  /**
   * Executa a função de concluir configuracao.
   */
  const concluirConfiguracao = async () => {
    try {
      await OrigemGanhosRepository.salvarSelecionadas(selecionados);
      router.replace(AppRoutes.dashboard);
    } catch (error) {
      console.error(
        'Erro ao salvar as categorias financeiras: ',
        error,
      );
      showCustomAlert(
        'Erro',
        'Ops! Ocorreu um erro ao salvar suas origens. Tente novamente.',
      );
    }
  };

  /**
   * Executa a função de voltar tela.
   */
  const voltarTela = () => {
    safeBack(router);
  };

  const origensFiltradas = origens.filter((origem) =>
    origem.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return {
    busca,
    setBusca,
    selecionados,
    toggleOrigem,
    modalAberto,
    setModalAberto,
    novoNome,
    setNovoNome,
    novoIcone,
    setNovoIcone,
    novaCor,
    setNovaCor,
    origens: origensFiltradas,
    setOrigens,
    adicionarOrigem,
    concluirConfiguracao,
    voltarTela,
  };
}
