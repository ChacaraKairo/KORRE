import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';

export const PrivacyNotificationChecker = {
  async run() {
    return;
  },

  async notifyPoliticaAtualizada(versao: string) {
    await criarNotificacao({
      titulo: 'Politica de privacidade atualizada',
      mensagem: 'Revise os termos de privacidade da versao atual.',
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
      titulo: 'Termos atualizados',
      mensagem: 'Os termos de uso foram atualizados.',
      tipo: 'privacidade',
      prioridade: 'media',
      destino: AppRoutes.termos,
      canal: 'historico',
      grupoPreferencia: 'privacidade',
      dedupKey: `termos_atualizados:${versao}`,
    });
  },
};
