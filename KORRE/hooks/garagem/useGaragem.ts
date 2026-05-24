import { useCallback, useEffect, useState } from 'react';
import db from '../../database/DatabaseInit';
import type {
  NovoVeiculo,
  UsuarioLocal,
  Veiculo,
} from '../../types/database';
import { VeiculoService } from '../cadastro/veiculoService';
import { showCustomAlert } from '../alert/useCustomAlert';
import { logger } from '../../utils/logger';

/**
 * Executa a função de use garagem.
 */
export function useGaragem() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalDelete, setModalDelete] = useState<{
    visivel: boolean;
    veiculo: Veiculo | null;
  }>({
    visivel: false,
    veiculo: null,
  });
  const [modalNovo, setModalNovo] = useState(false);
  const [confirmacaoPlaca, setConfirmacaoPlaca] =
    useState('');

  const carregarVeiculos = useCallback(async () => {
    setLoading(true);
    try {
      const user = await db.getFirstAsync<UsuarioLocal>(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );

      if (!user) {
        setVeiculos([]);
        return;
      }

      const lista = await db.getAllAsync<Veiculo>(
        `SELECT id, tipo, marca, modelo, ano, motor, placa, km_atual, ativo, id_user
         FROM veiculos
         WHERE id_user = ?
         ORDER BY ativo DESC, id ASC`,
        [user.id],
      );

      setVeiculos(lista);
    } catch (error) {
      logger.error('[Garagem] Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarVeiculos();
  }, [carregarVeiculos]);

  /**
   * Executa a função de ativar veiculo.
   */
  const ativarVeiculo = async (veiculo: Veiculo) => {
    try {
      const user = await db.getFirstAsync<UsuarioLocal>(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );
      if (!user) return;

      await db.runAsync(
        'UPDATE veiculos SET ativo = 0 WHERE id_user = ?',
        [user.id],
      );
      await db.runAsync(
        'UPDATE veiculos SET ativo = 1 WHERE id = ? AND id_user = ?',
        [veiculo.id, user.id],
      );
      await carregarVeiculos();
    } catch (error) {
      logger.error('[Garagem] Erro ao ativar veículo:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível ativar o veículo.',
      );
    }
  };

  /**
   * Executa a função de adicionar veiculo.
   */
  const adicionarVeiculo = async (novoVeiculo: NovoVeiculo) => {
    try {
      const user = await db.getFirstAsync<UsuarioLocal>(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );

      if (!user) {
        throw new Error(
          'Usuário não encontrado para vincular o veículo.',
        );
      }

      await VeiculoService.inserirVeiculo({
        tipo: novoVeiculo.tipo,
        marca: novoVeiculo.marca,
        modelo: novoVeiculo.modelo,
        ano: novoVeiculo.ano,
        motor: novoVeiculo.motor,
        placa: novoVeiculo.placa,
        km_atual: novoVeiculo.km_atual,
        ativo: veiculos.length === 0 ? 1 : 0,
        id_user: user.id,
      });

      await carregarVeiculos();
      setModalNovo(false);
    } catch (error) {
      logger.error('[Garagem] Erro ao adicionar veículo:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível adicionar a nova máquina.',
      );
    }
  };

  /**
   * Executa a função de solicitar exclusao.
   */
  const solicitarExclusao = (veiculo: Veiculo) => {
    setConfirmacaoPlaca('');
    setModalDelete({ visivel: true, veiculo });
  };

  /**
   * Executa a função de cancelar exclusao.
   */
  const cancelarExclusao = () =>
    setModalDelete({ visivel: false, veiculo: null });

  /**
   * Executa a função de confirmar exclusao.
   */
  const confirmarExclusao = async () => {
    if (!modalDelete.veiculo) return;

    if (
      confirmacaoPlaca.trim().toUpperCase() !==
      modalDelete.veiculo.placa?.toUpperCase()
    ) {
      return;
    }

    try {
      const eraAtivo = modalDelete.veiculo.ativo === 1;
      await db.runAsync('DELETE FROM veiculos WHERE id = ?', [
        modalDelete.veiculo.id,
      ]);
      if (eraAtivo && modalDelete.veiculo.id_user) {
        const proximoVeiculo = await db.getFirstAsync<Veiculo>(
          `SELECT id, tipo, marca, modelo, ano, motor, placa, km_atual, ativo, id_user
           FROM veiculos
           WHERE id_user = ?
           ORDER BY id ASC
           LIMIT 1`,
          [modalDelete.veiculo.id_user],
        );
        if (proximoVeiculo) {
          await db.runAsync(
            'UPDATE veiculos SET ativo = 1 WHERE id = ?',
            [proximoVeiculo.id],
          );
        }
      }
      await carregarVeiculos();
      setModalDelete({ visivel: false, veiculo: null });
      showCustomAlert(
        'Sucesso',
        'Veículo removido da garagem.',
      );
    } catch (error) {
      logger.error('[Garagem] Erro ao remover veículo:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível remover o veículo.',
      );
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
