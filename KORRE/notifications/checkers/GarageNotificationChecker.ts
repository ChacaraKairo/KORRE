import db from '../../database/DatabaseInit';
import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';
import { buildDailyDedupKey } from '../notificationDedupKeys';
import { getVeiculoAtivo } from './shared';

export const GarageNotificationChecker = {
  async run() {
    const veiculo = await getVeiculoAtivo();
    if (!veiculo) return;

    const ultimaAnalise = await db.getFirstAsync<{ ultima: string | null }>(
      `SELECT MAX(data_analise) as ultima FROM analises_corrida WHERE veiculo_id = ?`,
      [veiculo.id],
    );
    if (ultimaAnalise?.ultima) {
      const diff =
        (Date.now() - new Date(ultimaAnalise.ultima).getTime()) /
        86400000;
      if (diff >= 10) {
        await criarNotificacao({
          titulo: 'KM possivelmente desatualizado',
          mensagem: 'Atualize o KM atual do veiculo para manter alertas corretos.',
          tipo: 'garagem',
          prioridade: 'media',
          destino: AppRoutes.garagem,
          canal: 'historico',
          grupoPreferencia: 'uso_app',
          dedupKey: buildDailyDedupKey('km_desatualizado', veiculo.id),
        });
      }
    }
  },
};
