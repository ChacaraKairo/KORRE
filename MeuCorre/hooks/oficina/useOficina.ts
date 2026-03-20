import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit'; // Ajuste o caminho se necessário
import { showCustomAlert } from '../alert/useCustomAlert';

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
  }>({
    visivel: false,
    item: null,
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
        await carregarItensManutencao(veiculoAtivo.id);
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
  ) => {
    try {
      const itens = await db.getAllAsync(
        'SELECT * FROM itens_manutencao WHERE veiculo_id = ? ORDER BY criticidade DESC',
        [veiculoId],
      );
      setItensVisiveis(itens);
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
  const handleReset = (item: any) => {
    if (!veiculoConsultado) return;

    showCustomAlert(
      'Renovar Ciclo',
      `Deseja registrar a manutenção de "${item.nome}" como realizada e reiniciar a contagem?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, registrar',
          onPress: async () => {
            try {
              await db.runAsync(
                'UPDATE itens_manutencao SET ultima_troca_km = ?, ultima_troca_data = ? WHERE id = ?',
                [
                  veiculoConsultado.km_atual,
                  new Date().toISOString(),
                  item.id,
                ],
              );

              // Salvar no histórico de manutenções
              await db.runAsync(
                `INSERT INTO historico_manutencao (veiculo_id, item_id, descricao, valor, km_servico) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                  veiculoConsultado.id,
                  item.id,
                  `Manutenção: ${item.nome}`,
                  0, // Valor a 0 (poderá ser editável no futuro na tela de histórico)
                  veiculoConsultado.km_atual,
                ],
              );

              await carregarItensManutencao(
                veiculoConsultado.id,
              );
              showCustomAlert(
                'Sucesso',
                'Manutenção registrada no histórico e ciclo renovado!',
              );
            } catch (error) {
              console.error(
                'Erro ao resetar manutenção:',
                error,
              );
              showCustomAlert(
                'Erro',
                'Não foi possível registrar a manutenção.',
              );
            }
          },
        },
      ],
    );
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
        await carregarItensManutencao(veiculoConsultado.id);
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
    handleAddNovoItem,
  };
}
