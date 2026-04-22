import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { TextInput } from 'react-native';
import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
} from 'expo-router';
import * as Icons from 'lucide-react-native';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

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

  const inputRef = useRef<TextInput>(null);
  const mainColor =
    tipo === 'ganho' ? '#00C853' : '#F44336';

  const valorNumerico = parseFloat(
    valor.replace(/\./g, '').replace(',', '.'),
  );

  useFocusEffect(
    useCallback(() => {
      setValor('0,00');
      setCategoriaSelecionada('');
      setShowSuccess(false);
    }, []),
  );

  useEffect(() => {
    if (params.initialType) {
      setTipo(params.initialType as 'ganho' | 'despesa');
    }
  }, [params.initialType]);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          // 1. Garante a estrutura correta (Ajustado de icon_id para icone)
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS categorias_financeiras (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT UNIQUE,
              tipo TEXT,
              icone TEXT, 
              cor TEXT
            );
            INSERT OR IGNORE INTO categorias_financeiras (nome, tipo, icone, cor) VALUES 
            ('Combustível', 'despesa', 'Fuel', '#F44336'),
            ('Alimentação', 'despesa', 'Coffee', '#FF9800'),
            ('Manutenção', 'despesa', 'Wrench', '#795548'),
            ('Celular', 'despesa', 'Smartphone', '#9C27B0'),
            ('Lavagem', 'despesa', 'Zap', '#03A9F4');
          `);

          const usuario: any = await db.getFirstAsync(
            'SELECT id FROM perfil_usuario LIMIT 1',
          );
          if (usuario) setUsuarioId(usuario.id);

          const veiculos = await db.getAllAsync(
            'SELECT * FROM veiculos ORDER BY ativo DESC, id ASC',
          );
          setAllVehicles(veiculos);

          if (veiculos.length > 0) {
            const veiculoAtivo: any =
              veiculos.find((v: any) => v.ativo === 1) ||
              veiculos[0];
            setSelectedVehicleId(veiculoAtivo.id);
          }

          // 2. Busca Categorias (Ajustado para ler 'icone')
          const catList = await db.getAllAsync(
            'SELECT * FROM categorias_financeiras WHERE tipo = ?',
            [tipo],
          );

          const formatadas = catList.map((cat: any) => ({
            id: cat.id.toString(),
            nome: cat.nome,
            icon:
              (Icons as any)[cat.icone || 'Briefcase'] ||
              Icons.Briefcase,
            cor: cat.cor,
          }));

          setCategorias(formatadas);
          setCategoriaSelecionada('');
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

  const handleValueChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    if (!cleanText) {
      setValor('0,00');
      return;
    }
    let formattedValue = (
      parseInt(cleanText, 10) / 100
    ).toFixed(2);
    formattedValue = formattedValue.replace('.', ',');
    formattedValue = formattedValue.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.',
    );
    setValor(formattedValue);
  };

  const handleSave = async () => {
    if (valorNumerico <= 0 || !categoriaSelecionada) return;

    try {
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
      setTimeout(() => {
        setShowSuccess(false);
        setValor('0,00');
        setCategoriaSelecionada('');
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível salvar a transação.',
      );
    }
  };

  const handleAddCategoria = async () => {
    if (!novaCategoriaNome.trim()) return;

    try {
      const corPadrao =
        tipo === 'ganho' ? '#00C853' : '#F44336';

      // 3. Ajustado para inserir na coluna 'icone'
      await db.runAsync(
        'INSERT INTO categorias_financeiras (nome, tipo, icone, cor) VALUES (?, ?, ?, ?)',
        [
          novaCategoriaNome.trim(),
          tipo,
          novaCategoriaIcone,
          corPadrao,
        ],
      );

      setNovaCategoriaNome('');
      setNovaCategoriaIcone('Briefcase');
      setModalCategoriaAberto(false);

      const catList = await db.getAllAsync(
        'SELECT * FROM categorias_financeiras WHERE tipo = ?',
        [tipo],
      );

      const formatadas = catList.map((cat: any) => ({
        id: cat.id.toString(),
        nome: cat.nome,
        icon:
          (Icons as any)[cat.icone || 'Briefcase'] ||
          Icons.Briefcase,
        cor: cat.cor,
      }));

      setCategorias(formatadas);
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      showCustomAlert(
        'Erro',
        'Nome de categoria já existe ou erro no banco.',
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
