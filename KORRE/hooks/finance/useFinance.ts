import {
  useState,
  useRef,
  useCallback,
  type ComponentType,
} from 'react';
import { TextInput } from 'react-native';
import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
} from 'expo-router';
import * as Icons from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import db from '../../database/DatabaseInit';
import { FinanceiroRepository } from '../../database/repositories/FinanceiroRepository';
import { showCustomAlert } from '../alert/useCustomAlert';
import { verificarMetaDiaria } from '../../notifications/LocalNotificationScheduler';
import { criarNotificacao } from '../../notifications/NotificationService';
import { AppRoutes } from '../../constants/routes';
import type {
  TipoTransacao,
  UsuarioLocal,
  Veiculo,
} from '../../types/database';
import { logger } from '../../utils/logger';
import {
  hideAppLoading,
  showAppLoadingAsync,
} from '../ui/useAppLoading';

export const useFinance = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const getTipoInicial = useCallback(() => {
    return params.initialType === 'despesa'
      ? 'despesa'
      : 'ganho';
  }, [params.initialType]);

  const [tipo, setTipo] = useState<TipoTransacao>(
    getTipoInicial(),
  );
  const [valor, setValor] = useState('0,00');
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [allVehicles, setAllVehicles] = useState<Veiculo[]>(
    [],
  );
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<number | null>(null);
  const [categorias, setCategorias] = useState<
    Array<{
      id: string;
      nome: string;
      icon: ComponentType<{ size?: number; color?: string }>;
      cor?: string | null;
    }>
  >([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(
    null,
  );

  const [modalCategoriaAberto, setModalCategoriaAberto] =
    useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] =
    useState('');
  const [novaCategoriaIcone, setNovaCategoriaIcone] =
    useState('Briefcase');

  const inputRef = useRef<TextInput>(null);
  const tipoAtualRef = useRef<TipoTransacao>(getTipoInicial());
  const categoriasRequestRef = useRef(0);
  const mainColor =
    tipo === 'ganho' ? '#00C853' : '#F44336';

  const valorNumerico = parseFloat(
    valor.replace(/\./g, '').replace(',', '.'),
  );

  const carregarCategorias = useCallback(async (tipoConsulta: TipoTransacao) => {
    const requestId = categoriasRequestRef.current + 1;
    categoriasRequestRef.current = requestId;
    setCategoriaSelecionada('');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categorias_financeiras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE,
        tipo TEXT,
        icone TEXT,
        cor TEXT
      );
    `);

    const catList =
      await FinanceiroRepository.listarCategoriasFinanceirasPorTipo(
        tipoConsulta,
      );

    const formatadas = catList.map((cat) => ({
      id: cat.id.toString(),
      nome: cat.nome,
      icon:
        (Icons as any)[cat.icone || 'Briefcase'] ||
        Icons.Briefcase,
      cor: cat.cor,
    }));

    if (
      requestId === categoriasRequestRef.current &&
      tipoAtualRef.current === tipoConsulta
    ) {
      setCategorias(formatadas);
      setCategoriaSelecionada(formatadas[0]?.id ?? '');
    }
  }, []);

  const alterarTipo = useCallback(
    (proximoTipo: TipoTransacao) => {
      tipoAtualRef.current = proximoTipo;
      setTipo(proximoTipo);
      setValor('0,00');
      setCategoriaSelecionada('');
      setCategorias([]);
      void carregarCategorias(proximoTipo);
    },
    [carregarCategorias],
  );

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true;

      async function loadData() {
        try {
          const tipoInicial = getTipoInicial();
          tipoAtualRef.current = tipoInicial;
          setTipo(tipoInicial);
          setValor('0,00');
          setCategoriaSelecionada('');
          setCategorias([]);

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

          const usuario = await db.getFirstAsync<UsuarioLocal>(
            'SELECT id FROM perfil_usuario LIMIT 1',
          );
          if (!telaAtiva) return;

          if (!usuario) {
            setUsuarioId(null);
            setAllVehicles([]);
            setSelectedVehicleId(null);
            await carregarCategorias(tipoInicial);
            return;
          }

          setUsuarioId(usuario.id);

          const veiculos = await db.getAllAsync<Veiculo>(
            `SELECT id, tipo, marca, modelo, ano, motor, placa, km_atual, ativo, id_user
             FROM veiculos
             WHERE id_user = ?
             ORDER BY ativo DESC, id ASC`,
            [usuario?.id],
          );
          if (!telaAtiva) return;
          setAllVehicles(veiculos);

          if (veiculos.length > 0) {
            const veiculoAtivo =
              veiculos.find((v) => v.ativo === 1) ||
              veiculos[0];
            setSelectedVehicleId(veiculoAtivo.id);
          } else {
            setSelectedVehicleId(null);
          }

          await carregarCategorias(tipoInicial);
        } catch (error) {
          logger.error(
            'Erro ao carregar dados financeiros:',
            error,
          );
        }
      }
      loadData();

      return () => {
        telaAtiva = false;
      };
    }, [carregarCategorias, getTipoInicial, params.ts]),
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
    if (salvando || valorNumerico <= 0) return;

    if (!categoriaSelecionada) {
      showCustomAlert(
        t('common.erro'),
        tipo === 'ganho'
          ? t('financeiro.selecione_origem_ganho')
          : t('financeiro.selecione_categoria'),
      );
      return;
    }

    try {
      setSalvando(true);
      await showAppLoadingAsync(
        tipo === 'ganho'
          ? t('financeiro.salvando_ganho')
          : t('financeiro.salvando_despesa'),
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

      await verificarMetaDiaria();
      if (tipo === 'despesa' && valorNumerico >= 500) {
        await criarNotificacao({
          titulo: 'Despesa acima da media',
          mensagem:
            'Uma despesa alta foi registrada. Revise seu fluxo financeiro.',
          tipo: 'financeiro',
          prioridade: 'alta',
          destino: AppRoutes.finance,
          canal: 'historico',
          grupoPreferencia: 'financeiro',
          dedupKey: `gasto_acima_media:${categoriaSelecionada}:${new Date().toISOString().slice(0, 7)}`,
        });
      }
      setShowSuccess(true);
      setTimeout(() => {
        hideAppLoading();
        setSalvando(false);
        setShowSuccess(false);
        setValor('0,00');
        setCategoriaSelecionada('');
        router.replace('/(tabs)/dashboard');
      }, 1200);
    } catch (error) {
      logger.error('Erro ao salvar transacao:', error);
      hideAppLoading();
      setSalvando(false);
      showCustomAlert(
        t('common.erro'),
        t('financeiro.erro_salvar_transacao'),
      );
    }
  };

  const handleAddCategoria = async () => {
    if (!novaCategoriaNome.trim()) return;

    try {
      const corPadrao =
        tipo === 'ganho' ? '#00C853' : '#F44336';

      await showAppLoadingAsync(t('financeiro.criando_categoria'));
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
      await carregarCategorias(tipo);
    } catch (error) {
      logger.error('Erro ao adicionar categoria:', error);
      showCustomAlert(
        t('common.erro'),
        t('financeiro.erro_categoria_existente'),
      );
    } finally {
      hideAppLoading();
    }
  };

  return {
    tipo,
    setTipo: alterarTipo,
    valor,
    valorNumerico,
    handleValueChange,
    categoriaSelecionada,
    setCategoriaSelecionada,
    showSuccess,
    salvando,
    allVehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    categorias,
    semOrigemGanho:
      tipo === 'ganho' && categorias.length === 0,
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
