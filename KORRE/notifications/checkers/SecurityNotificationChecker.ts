import { AppRoutes } from '../../constants/routes';
import i18n from '../../locales/i18n';
import { criarNotificacao } from '../NotificationService';

export const SecurityNotificationChecker = {
  async run() {
    return;
  },

  async notifyLoginSuccess() {
    await criarNotificacao({
      titulo: i18n.t('notifications.security.login_success_title'),
      mensagem: i18n.t('notifications.security.login_success_body'),
      tipo: 'seguranca',
      prioridade: 'baixa',
      canal: 'historico',
      destino: AppRoutes.perfil,
      grupoPreferencia: 'seguranca',
      dedupKey: `login_sucesso:${new Date().toISOString().slice(0, 10)}`,
    });
  },

  async notifyTooManyAttempts() {
    await criarNotificacao({
      titulo: i18n.t('notifications.security.too_many_title'),
      mensagem: i18n.t('notifications.security.too_many_body'),
      tipo: 'seguranca',
      prioridade: 'alta',
      destino: AppRoutes.login,
      grupoPreferencia: 'seguranca',
      dedupKey: `login_tentativas:${new Date().toISOString().slice(0, 10)}`,
    });
  },
};
