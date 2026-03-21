import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit'; // Ajuste o caminho se necessário
import { showCustomAlert } from '../alert/useCustomAlert';
import { MANUTENCOES_PADRAO } from '../../type/typeManutencoes';
import { TipoVeiculo } from '../../type/typeVeiculos';

export function useOficina() {
  // Estados de Dados (Agora vêm do Banco de Dados)
  const [frota, setFrota] = useState<any[]>([]);
  const [veiculoConsultado, setVeiculoConsultado] =
    useState<any>(null);
  const [itensVisiveis, setItensVisiveis] = useState<any[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [listaAberta, setListaAberta] = useState(false);
  const [modalNovoItem, setModalNovoItem] = useState(false);
  const [modalReset, setModalReset] = useState<{
    visivel: boolean;
    item: any;
    ultimoValor: number;
  }>({
    visivel: false,
    item: null,
    ultimoValor: 0,
  });

  // Estados do Formulário
  const [novoItemNome, setNovoItemNome] = useState('');
  const [novoItemIntervalo, setNovoItemIntervalo] =
    useState('');
  const [novoItemTempo, setNovoItemTempo] = useState(''); // Meses
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

  // ==========================================
  // 1. CARREGAR DADOS DO BANCO (VEÍCULOS E ITENS)
  // ==========================================
  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      // Busca o veículo ativo atualizado
      const veiculoAtivo: any = await db.getFirstAsync(
        'SELECT * FROM veiculos WHERE ativo = 1 LIMIT 1',
      );

      if (veiculoAtivo) {
        setFrota([veiculoAtivo]);
        setVeiculoConsultado(veiculoAtivo);
        setNovoItemVeiculoId(veiculoAtivo.id);
        await carregarItensManutencao(
          veiculoAtivo.id,
          veiculoAtivo.tipo as TipoVeiculo,
        );
      } else {
        setVeiculoConsultado(null);
        setItensVisiveis([]);
      }
    } catch (error) {
      console.error('Erro ao buscar veiculo ativo:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarItensManutencao = async (
    veiculoId: number,
    veiculoTipo: TipoVeiculo,
  ) => {
    try {
      const itensDb = await db.getAllAsync(
        'SELECT * FROM itens_manutencao WHERE veiculo_id = ? ORDER BY criticidade DESC',
        [veiculoId],
      );

      // Pega os itens padrões para este tipo de veículo
      const defaultItems =
        MANUTENCOES_PADRAO[veiculoTipo] ||
        MANUTENCOES_PADRAO.moto;

      // Filtra os padrões que ainda não existem no banco de dados
      const virtualItems = defaultItems
        .filter(
          (def) =>
            !itensDb.some(
              (dbItem: any) => dbItem.nome === def.nome,
            ),
        )
        .map((def) => ({
          id: `virtual_${def.nome}`, // ID Temporário para o React
          veiculo_id: veiculoId,
          nome: def.nome,
          icone: def.icone,
          intervalo_km: def.intervalo_km,
          intervalo_meses: def.intervalo_meses,
          criticidade: def.criticidade,
          ultima_troca_km: null, // Ainda não foi feita
          ultima_troca_data: null,
          isVirtual: true, // Marca que este item ainda não está no banco
        }));

      // Junta os itens reais do banco com as sugestões virtuais
      setItensVisiveis([...itensDb, ...virtualItems]);
    } catch (error) {
      console.error(
        'Erro ao buscar itens de manutenção:',
        error,
      );
    }
  };

  // Recarrega sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  // ==========================================
  // 2. LÓGICA DE CÁLCULO E REGRAS DE NEGÓCIO
  // ==========================================
  const calcularProgresso = (
    item: any,
    currentKmOverride?: number,
  ) => {
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

    // Trata itens virtuais (nunca realizados)
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

    let isCritico = false;
    let isAtencao = false;

    // 1. Desgaste por KM
    let percKm = 0;
    let kmRestante = Infinity;
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

    // 2. Desgaste por Tempo (meses -> dias)
    let percTempo = 0;
    let diasRestantes = Infinity;
    if (item.intervalo_meses && item.ultima_troca_data) {
      const ultimaTroca = new Date(item.ultima_troca_data);
      const hoje = new Date();
      const diasPassados = Math.floor(
        (hoje.getTime() - ultimaTroca.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const diasIntervalo = item.intervalo_meses * 30; // Aproximação 1 mês = 30 dias
      percTempo = (diasPassados / diasIntervalo) * 100;
      diasRestantes = diasIntervalo - diasPassados;
      if (diasRestantes <= 5) isCritico = true;
      else if (diasRestantes <= 15) isAtencao = true;
    }

    // 3. Avalia qual critério está mais crítico (mais perto ou acima de 100%)
    const percentagemDesgaste = Math.max(
      0,
      Math.min(100, Math.max(percKm, percTempo)),
    );

    let status = 'OK';
    let cor = '#00C853';

    if (isCritico) {
      status = 'Crítico';
      cor = '#EF4444';
    } else if (isAtencao) {
      status = 'Atenção';
      cor = '#F59E0B';
    }

    let infoTexto = 'Sem limite definido';
    const temKm =
      item.intervalo_km && item.intervalo_km > 0;
    const temTempo =
      item.intervalo_meses && item.intervalo_meses > 0;

    if (temKm && temTempo) {
      // Prioriza a exibição do que tiver MAIOR percentagem de desgaste (mais perto do limite)
      if (percTempo > percKm) {
        infoTexto =
          diasRestantes > 0
            ? `Faltam ${diasRestantes} dias`
            : `Excedido em ${Math.abs(diasRestantes)} dias`;
      } else {
        infoTexto =
          kmRestante > 0
            ? `Faltam ${kmRestante} km`
            : `Excedido em ${Math.abs(kmRestante)} km`;
      }
    } else if (temTempo) {
      infoTexto =
        diasRestantes > 0
          ? `Faltam ${diasRestantes} dias`
          : `Excedido em ${Math.abs(diasRestantes)} dias`;
    } else if (temKm) {
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
  };

  const getStatusResumo = () => {
    const pendentes = itensVisiveis.filter(
      (item: any) =>
        calcularProgresso(item).status !== 'OK',
    ).length;

    if (pendentes === 0) {
      return {
        texto: 'Tudo OK',
        cor: '#00C853',
        bg: 'rgba(0, 200, 83, 0.1)',
      };
    }
    return {
      texto: `${pendentes} ${pendentes === 1 ? 'item pendente' : 'itens pendentes'}`,
      cor: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    };
  };

  // ==========================================
  // 3. AÇÕES (INSERIR E ATUALIZAR)
  // ==========================================
  const handleReset = async (item: any) => {
    if (!veiculoConsultado) return;

    try {
      console.log(
        `[BUSCA] Iniciando reset para:`,
        item.nome,
        `| Virtual:`,
        item.isVirtual,
      );
      let ultimoValor = 0;
      if (!item.isVirtual) {
        // Procura o último valor registado se for um item real
        const historico: any = await db.getFirstAsync(
          'SELECT valor FROM historico_manutencao WHERE item_id = ? ORDER BY id DESC LIMIT 1',
          [item.id],
        );
        ultimoValor = historico?.valor || 0;
        console.log(
          `[BUSCA] Último valor no histórico:`,
          ultimoValor,
        );
      }

      setModalReset({
        visivel: true,
        item, // Correção: O item tinha ficado de fora, causando a falha ao confirmar!
        ultimoValor,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
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

    console.log(
      `[CADASTRO] Tentando salvar manutenção. Veículo ativo:`,
      !!veiculoConsultado,
      `| Item:`,
      item?.nome,
    );

    if (!item || !veiculoConsultado) {
      console.log(
        `[CADASTRO] Operação cancelada. Item ou veículo ausente.`,
      );
      return;
    }

    try {
      let itemIdToUse = item.id;
      const agoraIso = new Date().toISOString();

      if (item.isVirtual) {
        console.log(
          `[CADASTRO] Inserindo nova manutenção virtual no banco...`,
        );
        // 1. Se for a primeira vez, salva na tabela de itens de manutenção
        const result: any = await db.runAsync(
          `INSERT INTO itens_manutencao (veiculo_id, nome, icone, ultima_troca_km, intervalo_km, ultima_troca_data, intervalo_meses, criticidade) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
        console.log(
          `[CADASTRO] Manutenção criada com ID:`,
          itemIdToUse,
        );
      } else {
        console.log(
          `[CADASTRO] Atualizando ciclo de manutenção existente (ID: ${itemIdToUse})...`,
        );
        // 1. Se já existia, apenas atualiza o ciclo e aplica possíveis edições nos intervalos
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

      console.log(
        `[CADASTRO] Salvando no histórico (valor pago: ${valorPago})...`,
      );
      // 2. Salvar no histórico de manutenções
      await db.runAsync(
        `INSERT INTO historico_manutencao (veiculo_id, item_id, descricao, valor, km_servico) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          veiculoConsultado.id,
          itemIdToUse,
          `Manutenção: ${item.nome}`,
          valorPago,
          veiculoConsultado.km_atual,
        ],
      );

      console.log(
        `[CADASTRO] Verificando categorias financeiras...`,
      );
      // 3. Garantir Categoria e Inserir Transação Financeira
      let categoriaId = null;
      const categoria: any = await db.getFirstAsync(
        "SELECT id FROM categorias_financeiras WHERE nome = ? AND tipo = 'despesa' LIMIT 1",
        [item.nome],
      );

      if (categoria) {
        categoriaId = categoria.id;
        console.log(
          `[CADASTRO] Categoria encontrada (ID: ${categoriaId})`,
        );
      } else {
        // Formata o ícone (ex: 'circle-dot' vira 'CircleDot') para compatibilidade com o Lucide
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
        console.log(
          `[CADASTRO] Nova categoria criada (ID: ${categoriaId})`,
        );
      }

      console.log(
        `[CADASTRO] Inserindo despesa financeira...`,
      );
      await db.runAsync(
        `INSERT INTO transacoes_financeiras 
        (veiculo_id, categoria_id, valor, tipo, data_transacao) 
        VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
        [
          veiculoConsultado.id,
          categoriaId,
          valorPago,
          'despesa',
        ],
      );

      console.log(
        `[CADASTRO] Sucesso! Recarregando tela de oficina...`,
      );
      await carregarItensManutencao(
        veiculoConsultado.id,
        veiculoConsultado.tipo as TipoVeiculo,
      );

      // Fecha o Modal
      setModalReset({
        visivel: false,
        item: null,
        ultimoValor: 0,
      });

      showCustomAlert(
        'Sucesso',
        'Manutenção registada e ciclo renovado!\n\nEste gasto foi adicionado automaticamente ao teu financeiro, não precisas de o registar novamente no dashboard.',
      );
    } catch (error) {
      console.error(
        '[CADASTRO] Erro ao resetar manutenção:',
        error,
      );
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

    // Procura o veículo na frota para pegar a KM atual dele
    const veiculoAlvo = veiculoConsultado;
    if (!veiculoAlvo) return;

    try {
      let dataUltimaTrocaIso = new Date().toISOString();
      if (novoItemUltimaTrocaData) {
        const partes = novoItemUltimaTrocaData.split('/');
        if (partes.length === 3) {
          const [dia, mes, ano] = partes;
          dataUltimaTrocaIso = new Date(
            `${ano}-${mes}-${dia}T12:00:00Z`,
          ).toISOString();
        }
      }

      const kmUltimaTroca = novoItemUltimaTrocaKm
        ? parseInt(novoItemUltimaTrocaKm)
        : veiculoAlvo.km_atual;

      // 1. Insere o novo item no banco
      await db.runAsync(
        `INSERT INTO itens_manutencao (veiculo_id, nome, icone, ultima_troca_km, intervalo_km, ultima_troca_data, intervalo_meses) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

      // 2. Se adicionou no veículo que estamos a ver, recarrega a lista
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
      showCustomAlert(
        'Sucesso',
        'Novo item de manutenção adicionado!',
      );
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível salvar a nova manutenção.',
      );
    }
  };

  return {
    loading,
    frota,
    veiculoConsultado,
    setVeiculoConsultado,
    itensVisiveis,
    listaAberta,
    setListaAberta,
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
