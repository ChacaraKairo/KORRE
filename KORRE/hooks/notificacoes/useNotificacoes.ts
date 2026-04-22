import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import db from '../../database/DatabaseInit';

// Configura como a notificação se comporta com a app aberta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<any[]>(
    [],
  );

  useEffect(() => {
    solicitarPermissoes();
    carregarNotificacoes();
  }, []);

  const solicitarPermissoes = async () => {
    const { status } =
      await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };

  const carregarNotificacoes = async () => {
    try {
      const dados = await db.getAllAsync(
        'SELECT * FROM notificacoes ORDER BY id DESC',
      );
      setNotificacoes(dados);
    } catch (error) {
      console.error(
        'Erro ao carregar notificações:',
        error,
      );
    }
  };

  // Função principal: Dispara no ecrã e salva no histórico!
  const dispararNotificacao = async (
    titulo: string,
    mensagem: string,
    tipo: 'info' | 'alerta' | 'sucesso' = 'info',
  ) => {
    try {
      // 1. Dispara a Push Notification no sistema do celular
      await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: mensagem,
          data: { tipo },
        },
        trigger: null, // null = dispara imediatamente
      });

      // 2. Salva no banco de dados
      await db.runAsync(
        'INSERT INTO notificacoes (titulo, mensagem, tipo) VALUES (?, ?, ?)',
        [titulo, mensagem, tipo],
      );

      carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao disparar notificação:', error);
    }
  };

  const marcarComoLida = async (id: number) => {
    await db.runAsync(
      'UPDATE notificacoes SET lida = 1 WHERE id = ?',
      [id],
    );
    carregarNotificacoes();
  };

  const limparHistorico = async () => {
    await db.runAsync('DELETE FROM notificacoes');
    carregarNotificacoes();
  };

  return {
    notificacoes,
    dispararNotificacao,
    marcarComoLida,
    limparHistorico,
  };
}
