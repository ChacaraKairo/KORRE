import { AppRoutes } from '../../constants/routes';
import i18n from '../../locales/i18n';
import { criarNotificacao } from '../NotificationService';

export const SystemNotificationChecker = {
  async run() {
    return;
  },

  async notifyErroRecorrente(codigo: string) {
    await criarNotificacao({
      titulo: i18n.t('notifications.system.error_title'),
      mensagem: i18n.t('notifications.system.error_body'),
      tipo: 'sistema',
      prioridade: 'alta',
      canal: 'historico',
      destino: AppRoutes.suporte,
      grupoPreferencia: 'sistema',
      dedupKey: `erro_recorrente:${codigo}:${new Date().toISOString().slice(0, 10)}`,
    });
  },

  async notifySuporteDisponivel() {
    await criarNotificacao({
      titulo: i18n.t('notifications.system.support_title'),
      mensagem: i18n.t('notifications.system.support_body'),
      tipo: 'suporte',
      prioridade: 'baixa',
      canal: 'historico',
      destino: AppRoutes.suporte,
      grupoPreferencia: 'sistema',
      dedupKey: `suporte_disponivel:${new Date().toISOString().slice(0, 10)}`,
    });
  },
};
