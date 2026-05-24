import { AppRoutes } from '../../constants/routes';
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
        titulo: 'Veiculo sem Auditoria KORRE',
        mensagem: 'Finalize a Auditoria KORRE para ativar os indices.',
        tipo: 'indices',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: `veiculo_sem_indices:${veiculo.id}`,
      });
    }

    if (completude < 50) {
      await criarNotificacao({
        titulo: 'Indices incompletos',
        mensagem: 'A completude da auditoria esta baixa. Revise os campos principais.',
        tipo: 'indices',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: buildDailyDedupKey('indices_incompletos', veiculo.id),
      });
    }
  },
};
