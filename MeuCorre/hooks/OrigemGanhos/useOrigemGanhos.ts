import { useState } from 'react';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useOrigemGanhos() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<
    number[]
  >([1]);

  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoIcone, setNovoIcone] = useState('Briefcase');
  const [novaCor, setNovaCor] = useState('#00C853');

  // Array de origens ajustado para usar 'icone' (mapeando para o banco)
  const [origens, setOrigens] = useState([
    {
      id: 1,
      nome: 'iFood',
      categoria: 'Delivery',
      cor: '#EA1D2C',
      icone: 'ShoppingBag',
    },
    {
      id: 2,
      nome: 'Uber',
      categoria: 'Transporte',
      cor: '#000000',
      icone: 'Navigation',
    },
    {
      id: 3,
      nome: '99',
      categoria: 'Transporte',
      cor: '#FFCC00',
      icone: 'Smartphone',
    },
    {
      id: 4,
      nome: 'Loggi',
      categoria: 'Logística',
      cor: '#00B5E2',
      icone: 'Package',
    },
    {
      id: 5,
      nome: 'Lalamove',
      categoria: 'Logística',
      cor: '#EA5B0C',
      icone: 'Truck',
    },
    {
      id: 6,
      nome: 'Rappi',
      categoria: 'Delivery',
      cor: '#FF441F',
      icone: 'ShoppingBag',
    },
    {
      id: 7,
      nome: 'Zé Delivery',
      categoria: 'Bebidas',
      cor: '#FFD700',
      icone: 'Zap',
    },
    {
      id: 8,
      nome: 'Particulares',
      categoria: 'Fixo / Extra',
      cor: '#00C853',
      icone: 'Briefcase',
    },
  ]);

  const toggleOrigem = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const adicionarOrigem = () => {
    if (!novoNome.trim()) return;

    const novaOrigemItem = {
      id: Date.now(),
      nome: novoNome,
      categoria: 'Personalizado',
      cor: novaCor,
      icone: novoIcone, // Ajustado de iconId para icone
    };

    setOrigens((prev) => [...prev, novaOrigemItem]);
    setSelecionados((prev) => [...prev, novaOrigemItem.id]);

    setNovoNome('');
    setModalAberto(false);
  };

  const concluirConfiguracao = async () => {
    try {
      const usuario: any = await db.getFirstAsync(
        'SELECT id, nome FROM perfil_usuario LIMIT 1',
      );
      const usuarioLog = usuario
        ? `Usuário ID: ${usuario.id} (${usuario.nome})`
        : 'Usuário desconhecido';

      const origensEscolhidas = origens.filter((origem) =>
        selecionados.includes(origem.id),
      );

      for (const origem of origensEscolhidas) {
        // CORREÇÃO CRÍTICA: Alterado de icon_id para icone
        await db.runAsync(
          'INSERT OR IGNORE INTO categorias_financeiras (nome, tipo, icone, cor) VALUES (?, ?, ?, ?);',
          [origem.nome, 'ganho', origem.icone, origem.cor],
        );

        console.log(
          `[CADASTRO] Item ID: ${origem.id} - Nome: '${origem.nome}' vinculado a ${usuarioLog}`,
        );
      }

      router.replace('/(tabs)/dashboard' as any);
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

  const voltarTela = () => {
    router.back();
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
