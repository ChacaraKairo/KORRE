import { AppRoutes } from '../../constants/routes';
import i18n from '../../locales/i18n';
import { criarNotificacao } from '../NotificationService';

export const PrivacyNotificationChecker = {
  async run() {
    return;
  },

  async notifyPoliticaAtualizada(versao: string) {
    await criarNotificacao({
      titulo: i18n.t('notifications.privacy.policy_title'),
      mensagem: i18n.t('notifications.privacy.policy_body'),
      tipo: 'privacidade',
      prioridade: 'media',
      destino: AppRoutes.politicaPrivacidade,
      canal: 'historico',
      grupoPreferencia: 'privacidade',
      dedupKey: `politica_atualizada:${versao}`,
    });
  },

  async notifyTermosAtualizados(versao: string) {
    await criarNotificacao({
      titulo: i18n.t('notifications.privacy.terms_title'),
      mensagem: i18n.t('notifications.privacy.terms_body'),
      tipo: 'privacidade',
      prioridade: 'media',
      destino: AppRoutes.termos,
      canal: 'historico',
      grupoPreferencia: 'privacidade',
      dedupKey: `termos_atualizados:${versao}`,
    });
  },
};
