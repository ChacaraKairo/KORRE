import { useEffect, useState } from 'react';
import {
  criarNotificacao,
  limparHistoricoNotificacoes,
  listarNotificacoes,
  marcarNotificacaoComoLida,
} from '../../notifications/NotificationService';
import type {
  NotificacaoHistorico,
  TipoNotificacao,
} from '../../notifications/NotificationTypes';

/**
 * Executa a função de use notificacoes.
 */
export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<
    NotificacaoHistorico[]
  >([]);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  /**
   * Executa a função de carregar notificacoes.
   */
  const carregarNotificacoes = async () => {
    try {
      const dados = await listarNotificacoes();
      setNotificacoes(dados);
    } catch (error) {
      console.error(
        'Erro ao carregar notificacoes:',
        error,
      );
    }
  };

  const dispararNotificacao = async (
    titulo: string,
    mensagem: string,
    tipo: TipoNotificacao = 'info',
  ) => {
    try {
      await criarNotificacao({
        titulo,
        mensagem,
        tipo,
      });
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao disparar notificacao:', error);
    }
  };

  /**
   * Executa a função de marcar como lida.
   */
  const marcarComoLida = async (id: number) => {
    await marcarNotificacaoComoLida(id);
    await carregarNotificacoes();
  };

  /**
   * Executa a função de limpar historico.
   */
  const limparHistorico = async () => {
    await limparHistoricoNotificacoes();
    await carregarNotificacoes();
  };

  return {
    notificacoes,
    dispararNotificacao,
    marcarComoLida,
    limparHistorico,
  };
}
