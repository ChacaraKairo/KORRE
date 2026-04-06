import { useState } from 'react';
import { useRouter } from 'expo-router';
// Importação do banco de dados ativada!
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useOrigemGanhos() {
  const router = useRouter();

  // Estados da Tela
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState<
    number[]
  >([1]);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoIcone, setNovoIcone] = useState('Briefcase');
  const [novaCor, setNovaCor] = useState('#00C853');

  // Array de origens (Nomes simplificados)
  const [origens, setOrigens] = useState([
    {
      id: 1,
      nome: 'iFood',
      categoria: 'Delivery',
      cor: '#EA1D2C',
      iconId: 'ShoppingBag',
    },
    {
      id: 2,
      nome: 'Uber',
      categoria: 'Transporte',
      cor: '#000000',
      iconId: 'Navigation',
    },
    {
      id: 3,
      nome: '99',
      categoria: 'Transporte',
      cor: '#FFCC00',
      iconId: 'Smartphone',
    },
    {
      id: 4,
      nome: 'Loggi',
      categoria: 'Logística',
      cor: '#00B5E2',
      iconId: 'Package',
    },
    {
      id: 5,
      nome: 'Lalamove',
      categoria: 'Logística',
      cor: '#EA5B0C',
      iconId: 'Truck',
    },
    {
      id: 6,
      nome: 'Rappi',
      categoria: 'Delivery',
      cor: '#FF441F',
      iconId: 'ShoppingBag',
    },
    {
      id: 7,
      nome: 'Zé Delivery',
      categoria: 'Bebidas',
      cor: '#FFD700',
      iconId: 'Zap',
    },
    {
      id: 8,
      nome: 'Particulares',
      categoria: 'Fixo / Extra',
      cor: '#00C853',
      iconId: 'Briefcase',
    },
  ]);

  // Função para selecionar/deselecionar origem
  const toggleOrigem = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // Função para adicionar nova origem manualmente
  const adicionarOrigem = () => {
    if (!novoNome.trim()) return;

    const novaOrigemItem = {
      id: Date.now(), // Gera um ID único baseado no tempo
      nome: novoNome,
      categoria: 'Personalizado',
      cor: novaCor,
      iconId: novoIcone,
    };

    setOrigens((prev) => [...prev, novaOrigemItem]);
    setSelecionados((prev) => [...prev, novaOrigemItem.id]); // Já deixa selecionado

    setNovoNome(''); // Limpa o campo
    setModalAberto(false); // Fecha o modal
  };

  // Função ASSÍNCRONA para salvar no banco e redirecionar
  const concluirConfiguracao = async () => {
    try {
      // Busca o usuário logado para vincular no log (assumindo single-user ou primeiro encontrado)
      const usuario: any = await db.getFirstAsync(
        'SELECT id, nome FROM perfil_usuario LIMIT 1',
      );
      const usuarioLog = usuario
        ? `Usuário ID: ${usuario.id} (${usuario.nome})`
        : 'Usuário desconhecido';

      // 1. Filtramos apenas as origens que o usuário selecionou
      const origensEscolhidas = origens.filter((origem) =>
        selecionados.includes(origem.id),
      );

      // 2. Salvamos cada uma na tabela correta: categorias_financeiras
      for (const origem of origensEscolhidas) {
        // Usamos INSERT OR IGNORE para não travar se a categoria já existir (pois o nome é UNIQUE no SQLite)
        await db.runAsync(
          'INSERT OR IGNORE INTO categorias_financeiras (nome, tipo, icone_id, cor) VALUES (?, ?, ?, ?);',
          [origem.nome, 'ganho', origem.iconId, origem.cor],
        );

        // Log solicitado com IDs e vínculo do usuário
        console.log(
          `[CADASTRO] Item ID: ${origem.id} - Nome: '${origem.nome}' vinculado a ${usuarioLog}`,
        );
      }

      // 3. Redireciona para o Dashboard (abas principais)
      router.replace('/dashboard' as any);
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

  // Filtra as origens com base no texto digitado na busca (case insensitive)
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
    origens: origensFiltradas, // Agora a tela recebe apenas os itens filtrados
    setOrigens,
    adicionarOrigem,
    concluirConfiguracao,
    voltarTela,
  };
}
