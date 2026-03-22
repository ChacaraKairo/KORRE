import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';
import { MANUTENCOES_PADRAO } from '../../type/typeManutencoes';
import { TipoVeiculo } from '../../type/typeVeiculos';

export function useOficina() {
  const [veiculoConsultado, setVeiculoConsultado] =
    useState<any>(null);
  const [itensVisiveis, setItensVisiveis] = useState<any[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Modais e Formulário
  const [modalNovoItem, setModalNovoItem] = useState(false);
  const [modalReset, setModalReset] = useState<{
    visivel: boolean;
    item: any;
    ultimoValor: number;
  }>({ visivel: false, item: null, ultimoValor: 0 });

  const [novoItemNome, setNovoItemNome] = useState('');
  const [novoItemIntervalo, setNovoItemIntervalo] =
    useState('');
  const [novoItemTempo, setNovoItemTempo] = useState('');
  const [novoItemUltimaTrocaKm, setNovoItemUltimaTrocaKm] =
    useState('');
  const [
    novoItemUltimaTrocaData,
    setNovoItemUltimaTrocaData,
  ] = useState('');
  const [novoItemIcone, setNovoItemIcone] =
    useState('wrench');
  const [novoItemVeiculoId, setNovoItemVeiculoId] =
    useState<number | null>(null);

  const addLog = useCallback((msg: string) => {
    console.log(msg); // Mantém o log visível no console do seu PC/Expo
    setLogs((prev) =>
      [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ${msg}`,
      ].slice(-30),
    );
  }, []);

  // ==========================================
  // 1. CARREGAR ITENS DE MANUTENÇÃO
  // ==========================================
  const carregarItensManutencao = useCallback(
    async (veiculoId: number, veiculoTipo: TipoVeiculo) => {
      try {
        const itensDb = await db.getAllAsync(
          'SELECT * FROM itens_manutencao WHERE veiculo_id = ? ORDER BY criticidade DESC',
          [veiculoId],
        );

        const defaultItems =
          MANUTENCOES_PADRAO[veiculoTipo] ||
          MANUTENCOES_PADRAO.moto;

        const virtualItems = defaultItems
          .filter(
            (def) =>
              !itensDb.some(
                (dbItem: any) => dbItem.nome === def.nome,
              ),
          )
          .map((def) => ({
            id: `virtual_${def.nome}`,
            veiculo_id: veiculoId,
            nome: def.nome,
            icone: def.icone,
            intervalo_km: def.intervalo_km,
            intervalo_meses: def.intervalo_meses,
            criticidade: def.criticidade,
            ultima_troca_km: null,
            ultima_troca_data: null,
            isVirtual: true,
          }));

        setItensVisiveis([...itensDb, ...virtualItems]);
      } catch (error) {
        addLog(
          `[ERRO] Falha nos itens de manutenção: ${error}`,
        );
      }
    },
    [addLog],
  );

  // ==========================================
  // 2. CARREGAMENTO GERAL (Abertura da Tela)
  // ==========================================
  const carregarDados = useCallback(async () => {
    try {
      addLog('[SISTEMA] Procurando veículo ativo...');

      const veiculoAtivo: any = await db.getFirstAsync(
        'SELECT * FROM veiculos WHERE ativo = 1 LIMIT 1',
      );

      if (veiculoAtivo) {
        setVeiculoConsultado(veiculoAtivo);
        setNovoItemVeiculoId(veiculoAtivo.id);
        await carregarItensManutencao(
          veiculoAtivo.id,
          veiculoAtivo.tipo as TipoVeiculo,
        );
        addLog(
          `[SUCESSO] Veículo carregado: ${veiculoAtivo.modelo}`,
        );
      } else {
        setVeiculoConsultado(null);
        setItensVisiveis([]);
      }
    } catch (error) {
      addLog(`[ERRO] Falha no carregamento: ${error}`);
    }
  }, [addLog, carregarItensManutencao]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }, [carregarDados]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      carregarDados().then(() => {
        if (isActive) setLoading(false);
      });
      return () => {
        isActive = false;
      };
    }, [carregarDados]),
  );

  // ==========================================
  // 4. PROGRESSO E STATUS (Cálculos Visuais)
  // ==========================================
  const calcularProgresso = useCallback(
    (item: any, currentKmOverride?: number) => {
      const kmAtual =
        currentKmOverride !== undefined
          ? currentKmOverride
          : veiculoConsultado?.km_atual;

      if (kmAtual === undefined)
        return {
          percentagemDesgaste: 0,
          cor: '#00C853',
          status: 'OK',
          infoTexto: '',
        };

      if (
        item.ultima_troca_km === null &&
        item.ultima_troca_data === null
      ) {
        return {
          percentagemDesgaste: 0,
          cor: '#00C853',
          status: 'OK',
          infoTexto:
            'Não registada (Realizar para iniciar ciclo)',
        };
      }

      let isCritico = false,
        isAtencao = false;
      let percKm = 0,
        kmRestante = Infinity;

      if (
        item.intervalo_km &&
        item.ultima_troca_km !== null
      ) {
        const rodado = kmAtual - item.ultima_troca_km;
        percKm = (rodado / item.intervalo_km) * 100;
        kmRestante = item.intervalo_km - rodado;
        if (kmRestante <= 100) isCritico = true;
        else if (kmRestante <= 500) isAtencao = true;
      }

      let percTempo = 0,
        diasRestantes = Infinity;
      if (item.intervalo_meses && item.ultima_troca_data) {
        const ultimaTroca = new Date(
          item.ultima_troca_data,
        );
        const diasPassados = Math.floor(
          (new Date().getTime() - ultimaTroca.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const diasIntervalo = item.intervalo_meses * 30;
        percTempo = (diasPassados / diasIntervalo) * 100;
        diasRestantes = diasIntervalo - diasPassados;
        if (diasRestantes <= 5) isCritico = true;
        else if (diasRestantes <= 15) isAtencao = true;
      }

      const percentagemDesgaste = Math.max(
        0,
        Math.min(100, Math.max(percKm, percTempo)),
      );
      let status = 'OK',
        cor = '#00C853';

      if (isCritico) {
        status = 'Crítico';
        cor = '#EF4444';
      } else if (isAtencao) {
        status = 'Atenção';
        cor = '#F59E0B';
      }

      let infoTexto = 'Sem limite definido';
      if (
        item.intervalo_km > 0 &&
        item.intervalo_meses > 0
      ) {
        infoTexto =
          percTempo > percKm
            ? diasRestantes > 0
              ? `Faltam ${diasRestantes} dias`
              : `Excedido em ${Math.abs(diasRestantes)} dias`
            : kmRestante > 0
              ? `Faltam ${kmRestante} km`
              : `Excedido em ${Math.abs(kmRestante)} km`;
      } else if (item.intervalo_meses > 0) {
        infoTexto =
          diasRestantes > 0
            ? `Faltam ${diasRestantes} dias`
            : `Excedido em ${Math.abs(diasRestantes)} dias`;
      } else if (item.intervalo_km > 0) {
        infoTexto =
          kmRestante > 0
            ? `Faltam ${kmRestante} km`
            : `Excedido em ${Math.abs(kmRestante)} km`;
      }

      return {
        percentagemDesgaste,
        cor,
        status,
        infoTexto,
      };
    },
    [veiculoConsultado],
  );

  const getStatusResumo = useCallback(() => {
    const pendentes = itensVisiveis.filter(
      (item: any) =>
        calcularProgresso(item).status !== 'OK',
    ).length;
    if (pendentes === 0)
      return {
        texto: 'Tudo OK',
        cor: '#00C853',
        bg: 'rgba(0, 200, 83, 0.1)',
      };
    return {
      texto: `${pendentes} ${pendentes === 1 ? 'item pendente' : 'itens pendentes'}`,
      cor: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    };
  }, [itensVisiveis, calcularProgresso]);

  // ==========================================
  // 5. AÇÕES DE INSERÇÃO / UPDATE (Manutenção)
  // ==========================================
  const handleReset = async (item: any) => {
    if (!veiculoConsultado) return;
    try {
      let ultimoValor = 0;
      if (!item.isVirtual) {
        const historico: any = await db.getFirstAsync(
          'SELECT valor FROM historico_manutencao WHERE item_id = ? ORDER BY id DESC LIMIT 1',
          [item.id],
        );
        ultimoValor = historico?.valor || 0;
      }
      setModalReset({ visivel: true, item, ultimoValor });
    } catch (error) {
      setModalReset({
        visivel: true,
        item,
        ultimoValor: 0,
      });
    }
  };

  const handleConfirmReset = async (
    valorPago: number,
    novoIntKm: number | null,
    novoIntMeses: number | null,
  ) => {
    const item = modalReset.item;
    if (!item || !veiculoConsultado) return;

    try {
      let itemIdToUse = item.id;
      const agoraIso = new Date().toISOString();

      if (item.isVirtual) {
        const result: any = await db.runAsync(
          `INSERT INTO itens_manutencao (veiculo_id, nome, icone, ultima_troca_km, intervalo_km, ultima_troca_data, intervalo_meses, criticidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            veiculoConsultado.id,
            item.nome,
            item.icone,
            veiculoConsultado.km_atual,
            novoIntKm,
            agoraIso,
            novoIntMeses,
            item.criticidade || 'media',
          ],
        );
        itemIdToUse = result.lastInsertRowId;
      } else {
        await db.runAsync(
          'UPDATE itens_manutencao SET ultima_troca_km = ?, ultima_troca_data = ?, intervalo_km = ?, intervalo_meses = ? WHERE id = ?',
          [
            veiculoConsultado.km_atual,
            agoraIso,
            novoIntKm,
            novoIntMeses,
            itemIdToUse,
          ],
        );
      }

      await db.runAsync(
        `INSERT INTO historico_manutencao (veiculo_id, item_id, descricao, valor, km_servico) VALUES (?, ?, ?, ?, ?)`,
        [
          veiculoConsultado.id,
          itemIdToUse,
          `Manutenção: ${item.nome}`,
          valorPago,
          veiculoConsultado.km_atual,
        ],
      );

      let categoriaId = null;
      const categoria: any = await db.getFirstAsync(
        "SELECT id FROM categorias_financeiras WHERE nome = ? AND tipo = 'despesa' LIMIT 1",
        [item.nome],
      );

      if (categoria) {
        categoriaId = categoria.id;
      } else {
        const iconeFormatado = item.icone
          ? item.icone
              .split('-')
              .map(
                (p: string) =>
                  p.charAt(0).toUpperCase() + p.slice(1),
              )
              .join('')
          : 'Wrench';
        const result: any = await db.runAsync(
          "INSERT INTO categorias_financeiras (nome, tipo, icone_id, cor) VALUES (?, 'despesa', ?, '#795548')",
          [item.nome, iconeFormatado],
        );
        categoriaId = result.lastInsertRowId;
      }

      await db.runAsync(
        `INSERT INTO transacoes_financeiras (veiculo_id, categoria_id, valor, tipo, data_transacao) VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
        [
          veiculoConsultado.id,
          categoriaId,
          valorPago,
          'despesa',
        ],
      );

      await carregarItensManutencao(
        veiculoConsultado.id,
        veiculoConsultado.tipo as TipoVeiculo,
      );
      setModalReset({
        visivel: false,
        item: null,
        ultimoValor: 0,
      });
      showCustomAlert(
        'Sucesso',
        'Manutenção registada e ciclo renovado!',
      );
    } catch (error) {
      showCustomAlert(
        'Erro',
        'Não foi possível registrar a manutenção.',
      );
    }
  };

  const handleAddNovoItem = async () => {
    if (
      !novoItemNome ||
      (!novoItemIntervalo && !novoItemTempo) ||
      !novoItemVeiculoId
    ) {
      showCustomAlert(
        'Aviso',
        'Preencha o nome e pelo menos um intervalo (KM ou Meses).',
      );
      return;
    }
    const veiculoAlvo = veiculoConsultado;
    if (!veiculoAlvo) return;

    try {
      let dataUltimaTrocaIso = new Date().toISOString();
      if (novoItemUltimaTrocaData) {
        const partes = novoItemUltimaTrocaData.split('/');
        if (partes.length === 3) {
          dataUltimaTrocaIso = new Date(
            `${partes[2]}-${partes[1]}-${partes[0]}T12:00:00Z`,
          ).toISOString();
        }
      }
      const kmUltimaTroca = novoItemUltimaTrocaKm
        ? parseInt(novoItemUltimaTrocaKm)
        : veiculoAlvo.km_atual;

      await db.runAsync(
        `INSERT INTO itens_manutencao (veiculo_id, nome, icone, ultima_troca_km, intervalo_km, ultima_troca_data, intervalo_meses) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          novoItemVeiculoId,
          novoItemNome,
          novoItemIcone,
          kmUltimaTroca,
          novoItemIntervalo
            ? parseInt(novoItemIntervalo)
            : null,
          dataUltimaTrocaIso,
          novoItemTempo ? parseInt(novoItemTempo) : null,
        ],
      );

      if (novoItemVeiculoId === veiculoConsultado?.id) {
        await carregarItensManutencao(
          veiculoConsultado.id,
          veiculoConsultado.tipo as TipoVeiculo,
        );
      }

      setModalNovoItem(false);
      setNovoItemNome('');
      setNovoItemIntervalo('');
      setNovoItemTempo('');
      setNovoItemUltimaTrocaKm('');
      setNovoItemUltimaTrocaData('');
      showCustomAlert('Sucesso', 'Novo item adicionado!');
    } catch (error) {
      showCustomAlert(
        'Erro',
        'Não foi possível salvar a nova manutenção.',
      );
    }
  };

  return {
    logs,
    loading,
    refreshing,
    onRefresh,
    veiculoConsultado,
    setVeiculoConsultado,
    itensVisiveis,
    modalNovoItem,
    setModalNovoItem,
    modalReset,
    setModalReset,
    novoItemNome,
    setNovoItemNome,
    novoItemIntervalo,
    setNovoItemIntervalo,
    novoItemTempo,
    setNovoItemTempo,
    novoItemUltimaTrocaKm,
    setNovoItemUltimaTrocaKm,
    novoItemUltimaTrocaData,
    setNovoItemUltimaTrocaData,
    novoItemIcone,
    setNovoItemIcone,
    novoItemVeiculoId,
    setNovoItemVeiculoId,
    calcularProgresso,
    getStatusResumo,
    handleReset,
    handleConfirmReset,
    handleAddNovoItem,
  };
}
