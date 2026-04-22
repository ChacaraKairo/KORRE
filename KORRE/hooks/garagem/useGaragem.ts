// Arquivo: src/hooks/garagem/useGaragem.ts
import { useState, useEffect, useCallback } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';
import { VeiculoService } from '../cadastro/veiculoService'; // <-- Importando o Serviço

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

  const carregarVeiculos = useCallback(async () => {
    setLoading(true);
    try {
      // Pega o utilizador logado para garantir que estamos buscando apenas a garagem dele
      const user: any = await db.getFirstAsync(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );

      if (!user) {
        setVeiculos([]);
        return;
      }

      // Ordena para que o veículo ativo apareça primeiro
      const lista = await db.getAllAsync(
        'SELECT * FROM veiculos WHERE id_user = ? ORDER BY ativo DESC, id ASC',
        [user.id],
      );

      console.log(
        `[Garagem] ${lista.length} veículos carregados para o user_id ${user.id}.`,
      );
      setVeiculos(lista);
    } catch (error) {
      console.error(
        '[Garagem] Erro ao buscar veículos:',
        error,
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
        `[Garagem] Ativando veículo ID: ${veiculo.id}`,
      );
      await db.runAsync('UPDATE veiculos SET ativo = 0');
      await db.runAsync(
        'UPDATE veiculos SET ativo = 1 WHERE id = ?',
        [veiculo.id],
      );
      await carregarVeiculos();
    } catch (error) {
      showCustomAlert(
        'Erro',
        'Não foi possível ativar o veículo.',
      );
    }
  };

  // --- LÓGICA DE ADIÇÃO (Usando o Novo Serviço) ---
  const adicionarVeiculo = async (novoVeiculo: any) => {
    try {
      // 1. Busca o ID do Utilizador logado
      const user: any = await db.getFirstAsync(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );
      if (!user)
        throw new Error(
          'Usuário não encontrado para vincular o veículo.',
        );

      // 2. Repassa para o Serviço
      await VeiculoService.inserirVeiculo({
        tipo: novoVeiculo.tipo,
        marca: novoVeiculo.marca,
        modelo: novoVeiculo.modelo,
        ano: novoVeiculo.ano,
        motor: novoVeiculo.motor,
        placa: novoVeiculo.placa,
        km_atual: novoVeiculo.km_atual,
        ativo: veiculos.length === 0 ? 1 : 0,
        id_user: user.id, // <-- Fim do erro null!
      });

      console.log(
        '[Garagem] Veículo inserido com sucesso!',
      );
      await carregarVeiculos();
      setModalNovo(false);
    } catch (error) {
      showCustomAlert(
        'Erro',
        'Não foi possível adicionar a nova máquina.',
      );
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
        await db.runAsync(
          'DELETE FROM veiculos WHERE id = ?',
          [modalDelete.veiculo.id],
        );
        await carregarVeiculos();
        setModalDelete({ visivel: false, veiculo: null });
        showCustomAlert(
          'Sucesso',
          'Veículo removido da garagem.',
        );
      } catch (error) {
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
