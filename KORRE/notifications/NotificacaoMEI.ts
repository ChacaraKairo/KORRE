import Constants from 'expo-constants';
import db from '../database/DatabaseInit';
import i18n from '../locales/i18n';

const LIMITE_MENSAL_MEI = 6750;
const isExpoGo = Constants.appOwnership === 'expo';

export const NotificacaoMEI = {
  async gerarTextoNotificacaoSemanal() {
    try {
      const agora = new Date();
      const anoAtual = agora.getFullYear();
      const mesAtual = (agora.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const dataInicioMes = `${anoAtual}-${mesAtual}-01 00:00:00`;

      const result: any = await db.getFirstAsync(
        "SELECT SUM(valor) as total FROM transacoes_financeiras WHERE tipo = 'ganho' AND data_transacao >= ?",
        [dataInicioMes],
      );

      const totalGanhos = result?.total || 0;
      const porcentagem = (
        (totalGanhos / LIMITE_MENSAL_MEI) *
        100
      ).toFixed(1);
      const restante = (
        LIMITE_MENSAL_MEI - totalGanhos
      ).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      if (parseFloat(porcentagem) >= 95) {
        return i18n.t('notifications.mei.revenue_critical_body', {
          percentage: porcentagem,
          remaining: restante,
        });
      }

      return i18n.t('notifications.mei.revenue_body', {
        percentage: porcentagem,
        remaining: restante,
      });
    } catch (error) {
      console.error(
        'Erro ao calcular dados para notificação:',
        error,
      );
      return i18n.t('notifications.mei.revenue_fallback_body');
    }
  },

  async dispararNotificacaoFaturamento() {
    if (isExpoGo) return;

    const Notifications = await import('expo-notifications');
    const mensagem =
      await this.gerarTextoNotificacaoSemanal();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.mei.revenue_title'),
        body: mensagem,
        data: { screen: '/(relatorios)' },
        sound: true,
      },
      trigger: null,
    });
  },
};
