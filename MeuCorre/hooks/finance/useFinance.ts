import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { TextInput, Alert } from 'react-native';
import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
} from 'expo-router';
import * as Icons from 'lucide-react-native';
import db from '../../database/DatabaseInit';

export const useFinance = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Estados Principais
  const [tipo, setTipo] = useState<'ganho' | 'despesa'>(
    (params.initialType as any) || 'ganho',
  );
  const [valor, setValor] = useState('0,00');
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados de Dados
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<number | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(
    null,
  );

  // Estados do Modal de Nova Categoria
  const [modalCategoriaAberto, setModalCategoriaAberto] =
    useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] =
    useState('');
  const [novaCategoriaIcone, setNovaCategoriaIcone] =
    useState('Briefcase');

  // Refs e Variáveis Auxiliares
  const inputRef = useRef<TextInput>(null);
  const mainColor =
    tipo === 'ganho' ? '#00C853' : '#F44336';
  // Remove os pontos de milhar e troca a vírgula decimal por ponto para gravar no SQLite corretamente
  const valorNumerico = parseFloat(
    valor.replace(/\./g, '').replace(',', '.'),
  );

  // Limpa o formulário toda vez que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      setValor('0,00');
      setCategoriaSelecionada('');
      setShowSuccess(false);
    }, []),
  );

  // Atualiza o tipo se vier via parâmetros de navegação
  useEffect(() => {
    if (params.initialType) {
      console.log(
        `[FINANCE LOG] Tipo alterado via parâmetro: ${params.initialType}`,
      );
      setTipo(params.initialType as 'ganho' | 'despesa');
    }
  }, [params.initialType]);

  // Carrega dados iniciais (Usuário, Veículos, Categorias)
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          // Garante a tabela e insere despesas básicas caso a base de dados não tenha sido recriada
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS categorias_financeiras (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT UNIQUE,
              tipo TEXT,
              icone_id TEXT,
              cor TEXT
            );
            INSERT OR IGNORE INTO categorias_financeiras (nome, tipo, icone_id, cor) VALUES 
            ('Combustível', 'despesa', 'Fuel', '#F44336'),
            ('Alimentação', 'despesa', 'Coffee', '#FF9800'),
            ('Manutenção', 'despesa', 'Wrench', '#795548'),
            ('Celular', 'despesa', 'Smartphone', '#9C27B0'),
            ('Lavagem', 'despesa', 'Zap', '#03A9F4');
          `);

          // 1. Busca Usuário Logado (para vincular o ganho/gasto)
          const usuario: any = await db.getFirstAsync(
            'SELECT id FROM perfil_usuario LIMIT 1',
          );
          if (usuario) {
            setUsuarioId(usuario.id);
          }

          // 2. Busca Veículos
          const veiculos = await db.getAllAsync(
            'SELECT * FROM veiculos ORDER BY ativo DESC, id ASC',
          );
          setAllVehicles(veiculos);

          // Seleciona o veículo ativo por padrão
          if (veiculos.length > 0) {
            const veiculoAtivo: any =
              veiculos.find((v: any) => v.ativo === 1) ||
              veiculos[0];
            setSelectedVehicleId(veiculoAtivo.id);
          }

          // 3. Busca Categorias baseadas no tipo (ganho/despesa)
          const catList = await db.getAllAsync(
            'SELECT * FROM categorias_financeiras WHERE tipo = ?',
            [tipo],
          );

          const formatadas = catList.map((cat: any) => ({
            id: cat.id.toString(),
            nome: cat.nome,
            icon:
              (Icons as any)[cat.icone_id || 'Briefcase'] ||
              Icons.Briefcase,
            cor: cat.cor,
          }));

          setCategorias(formatadas);
          setCategoriaSelecionada('');

          console.log(
            `[FINANCE LOG] Dados carregados (Tipo: ${tipo}): ${formatadas.length} categorias, ${veiculos.length} veículos encontrados.`,
          );
        } catch (error) {
          console.error(
            'Erro ao carregar dados financeiros:',
            error,
          );
        }
      }
      loadData();
    }, [tipo]),
  );

  // Formatação de Moeda
  const handleValueChange = (text: string) => {
    // Remove tudo que não for número (inclusive vírgulas e pontos que já estavam na string)
    const cleanText = text.replace(/\D/g, '');

    if (!cleanText) {
      setValor('0,00');
      return;
    }

    // Converte para número e divide por 100 para criar a lógica de preenchimento dos centavos para reais
    let formattedValue = (
      parseInt(cleanText, 10) / 100
    ).toFixed(2);

    // Troca o ponto da casa decimal por vírgula e adiciona os pontos de milhar (ex: 1.000,00)
    formattedValue = formattedValue.replace('.', ',');
    formattedValue = formattedValue.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.',
    );

    setValor(formattedValue);
  };

  // Salvar Transação
  const handleSave = async () => {
    if (
      valorNumerico <= 0 ||
      !categoriaSelecionada ||
      !usuarioId
    )
      return;

    try {
      console.log(
        `[FINANCE LOG] A guardar transação -> Tipo: ${tipo}, Valor: R$${valorNumerico}, CategoriaID: ${categoriaSelecionada}, VeiculoID: ${selectedVehicleId}, UsuarioID: ${usuarioId}`,
      );

      await db.runAsync(
        `INSERT INTO transacoes_financeiras 
        (veiculo_id, categoria_id, valor, tipo, data_transacao) 
        VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
        [
          selectedVehicleId,
          parseInt(categoriaSelecionada),
          valorNumerico,
          tipo,
        ],
      );

      setShowSuccess(true);
      console.log(
        '[FINANCE LOG] Transação guardada com sucesso!',
      );

      setTimeout(() => {
        setShowSuccess(false);
        setValor('0,00'); // Limpa o valor digitado
        setCategoriaSelecionada(''); // Limpa a categoria escolhida
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar. Verifique se a tabela de transações possui a coluna usuario_id.',
      );
    }
  };

  // Adicionar Nova Categoria
  const handleAddCategoria = async () => {
    if (!novaCategoriaNome.trim()) return;

    try {
      const corPadrao =
        tipo === 'ganho' ? '#00C853' : '#F44336';

      await db.runAsync(
        'INSERT INTO categorias_financeiras (nome, tipo, icone_id, cor) VALUES (?, ?, ?, ?)',
        [
          novaCategoriaNome.trim(),
          tipo,
          novaCategoriaIcone,
          corPadrao,
        ],
      );

      setNovaCategoriaNome('');
      setNovaCategoriaIcone('Briefcase'); // Reseta o ícone
      setModalCategoriaAberto(false);

      // Recarregar categorias instantaneamente
      const catList = await db.getAllAsync(
        'SELECT * FROM categorias_financeiras WHERE tipo = ?',
        [tipo],
      );

      const formatadas = catList.map((cat: any) => ({
        id: cat.id.toString(),
        nome: cat.nome,
        icon:
          (Icons as any)[cat.icone_id || 'Briefcase'] ||
          Icons.Briefcase,
        cor: cat.cor,
      }));

      setCategorias(formatadas);
      console.log(
        `[FINANCE LOG] Nova categoria '${novaCategoriaNome}' adicionada.`,
      );
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      Alert.alert(
        'Erro',
        'Não foi possível adicionar a categoria. Verifique se o nome já existe.',
      );
    }
  };

  return {
    tipo,
    setTipo,
    valor,
    valorNumerico,
    handleValueChange,
    categoriaSelecionada,
    setCategoriaSelecionada,
    showSuccess,
    allVehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    categorias,
    mainColor,
    inputRef,
    handleSave,
    router,
    modalCategoriaAberto,
    setModalCategoriaAberto,
    novaCategoriaNome,
    setNovaCategoriaNome,
    novaCategoriaIcone,
    setNovaCategoriaIcone,
    handleAddCategoria,
  };
};
