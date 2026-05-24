import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';

export const SystemNotificationChecker = {
  async run() {
    return;
  },

  async notifyErroRecorrente(codigo: string) {
    await criarNotificacao({
      titulo: 'Erro interno recorrente',
      mensagem: 'Detectamos um erro recorrente. Acesse suporte para orientacoes.',
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
      titulo: 'Suporte disponivel',
      mensagem: 'Os canais de suporte estao disponiveis no aplicativo.',
      tipo: 'suporte',
      prioridade: 'baixa',
      canal: 'historico',
      destino: AppRoutes.suporte,
      grupoPreferencia: 'sistema',
      dedupKey: `suporte_disponivel:${new Date().toISOString().slice(0, 10)}`,
    });
  },
};
