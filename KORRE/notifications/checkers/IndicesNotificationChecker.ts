import { AppRoutes } from '../../constants/routes';
import i18n from '../../locales/i18n';
import { criarNotificacao } from '../NotificationService';
import { buildDailyDedupKey } from '../notificationDedupKeys';
import { getVeiculoAtivo } from './shared';

export const IndicesNotificationChecker = {
  async run() {
    const veiculo = await getVeiculoAtivo();
    if (!veiculo) return;

    const possuiIndices =
      Number(veiculo.custo_km_calculado || 0) > 0 &&
      Number(veiculo.custo_minuto_calculado || 0) > 0 &&
      Number(veiculo.meta_ganho_minuto_calculado || 0) > 0;
    const completude = Number(veiculo.taxa_completude || 0);

    if (!possuiIndices) {
      await criarNotificacao({
        titulo: i18n.t('notifications.indices.no_audit_title'),
        mensagem: i18n.t('notifications.indices.no_audit_body'),
        tipo: 'indices',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: `veiculo_sem_indices:${veiculo.id}`,
      });
    }

    if (completude < 50) {
      await criarNotificacao({
        titulo: i18n.t('notifications.indices.incomplete_title'),
        mensagem: i18n.t('notifications.indices.incomplete_body'),
        tipo: 'indices',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: buildDailyDedupKey('indices_incompletos', veiculo.id),
      });
    }
  },
};
