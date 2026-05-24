import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';

export const SecurityNotificationChecker = {
  async run() {
    return;
  },

  async notifyLoginSuccess() {
    await criarNotificacao({
      titulo: 'Login realizado',
      mensagem: 'Seu acesso foi concluido com sucesso.',
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
      titulo: 'Muitas tentativas de login',
      mensagem: 'Foram detectadas varias tentativas de acesso. Tente novamente mais tarde.',
      tipo: 'seguranca',
      prioridade: 'alta',
      destino: AppRoutes.login,
      grupoPreferencia: 'seguranca',
      dedupKey: `login_tentativas:${new Date().toISOString().slice(0, 10)}`,
    });
  },
};
