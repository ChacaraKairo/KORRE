import { useState, useEffect, useCallback } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useGaragem() {
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [modalDelete, setModalDelete] = useState({
    visivel: false,
    veiculo: null as any,
  });
  const [modalNovo, setModalNovo] = useState(false);
  const [confirmacaoPlaca, setConfirmacaoPlaca] =
    useState('');

  // Busca os veículos no banco de dados
  const carregarVeiculos = useCallback(async () => {
    setLoading(true);
    try {
      // Ordena para que o veículo ativo (ativo = 1) apareça sempre em primeiro lugar
      const lista = await db.getAllAsync(
        'SELECT * FROM veiculos ORDER BY ativo DESC, id ASC',
      );
      console.log(
        `[Garagem] ${lista.length} veículos carregados do banco.`,
      );
      setVeiculos(lista);
    } catch (error) {
      console.error(
        '[Garagem] Erro ao buscar veículos:',
        error,
      );
      showCustomAlert(
        'Erro',
        'Não foi possível carregar a sua garagem.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarVeiculos();
  }, [carregarVeiculos]);

  // --- LÓGICA DE TROCA ---
  const ativarVeiculo = async (veiculo: any) => {
    try {
      console.log(
        `[Garagem] Tentando ativar veículo ID: ${veiculo.id} (${veiculo.modelo})`,
      );
      // 1. Desativa todos
      await db.runAsync('UPDATE veiculos SET ativo = 0');
      // 2. Ativa apenas o selecionado
      await db.runAsync(
        'UPDATE veiculos SET ativo = 1 WHERE id = ?',
        [veiculo.id],
      );

      console.log(
        `[Garagem] Veículo ID: ${veiculo.id} ativado com sucesso!`,
      );
      await carregarVeiculos(); // Recarrega a lista
    } catch (error) {
      console.error(
        '[Garagem] Erro ao trocar veículo ativo:',
        error,
      );
      showCustomAlert(
        'Erro',
        'Não foi possível ativar o veículo.',
      );
    }
  };

  // --- LÓGICA DE ADIÇÃO ---
  const adicionarVeiculo = async (novoVeiculo: any) => {
    try {
      console.log(
        '[Garagem] Tentando inserir novo veículo no banco de dados...',
        novoVeiculo,
      );
      await db.runAsync(
        `INSERT INTO veiculos (tipo, modelo, placa, km_atual, ativo) VALUES (?, ?, ?, ?, ?)`,
        [
          novoVeiculo.tipo,
          `${novoVeiculo.marca} ${novoVeiculo.modelo}`.trim(),
          novoVeiculo.placa,
          novoVeiculo.km_atual,
          veiculos.length === 0 ? 1 : 0, // Se for o primeiro registo, já fica ativo
        ],
      );
      console.log(
        '[Garagem] Veículo inserido com sucesso!',
      );
      await carregarVeiculos(); // Recarrega a lista
      setModalNovo(false);
    } catch (error) {
      console.error(
        '[Garagem] ERRO CRÍTICO ao adicionar veículo:',
        error,
      );
      showCustomAlert(
        'Erro',
        'Não foi possível adicionar a nova máquina.',
      );
      throw error;
    }
  };

  // --- LÓGICA DE EXCLUSÃO ---
  const solicitarExclusao = (veiculo: any) => {
    setConfirmacaoPlaca('');
    setModalDelete({ visivel: true, veiculo });
  };
  const cancelarExclusao = () =>
    setModalDelete({ visivel: false, veiculo: null });

  const confirmarExclusao = async () => {
    if (!modalDelete.veiculo) return;

    if (
      confirmacaoPlaca.toUpperCase() ===
      modalDelete.veiculo.placa.toUpperCase()
    ) {
      try {
        console.log(
          `[Garagem] Removendo veículo ID: ${modalDelete.veiculo.id} (${modalDelete.veiculo.placa})`,
        );
        // O "ON DELETE CASCADE" no seu SQLite vai apagar automaticamente
        // as manutenções e histórico atrelados a este veículo!
        await db.runAsync(
          'DELETE FROM veiculos WHERE id = ?',
          [modalDelete.veiculo.id],
        );

        await carregarVeiculos(); // Recarrega a lista
        setModalDelete({ visivel: false, veiculo: null });
        showCustomAlert(
          'Sucesso',
          'Veículo removido da garagem.',
        );
      } catch (error) {
        console.error(
          '[Garagem] Erro ao apagar veículo:',
          error,
        );
        showCustomAlert(
          'Erro',
          'Não foi possível remover o veículo.',
        );
      }
    }
  };

  return {
    veiculos,
    loading,
    carregarVeiculos,
    ativarVeiculo,
    adicionarVeiculo,
    modalNovo,
    setModalNovo,
    modalDelete,
    solicitarExclusao,
    cancelarExclusao,
    confirmarExclusao,
    confirmacaoPlaca,
    setConfirmacaoPlaca,
  };
}
