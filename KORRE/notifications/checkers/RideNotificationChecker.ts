import db from '../../database/DatabaseInit';
import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';
import { buildDailyDedupKey } from '../notificationDedupKeys';

export const RideNotificationChecker = {
  async run() {
    const rows = await db.getAllAsync<{ decisao: string }>(
      `SELECT decisao
       FROM analises_corrida
       WHERE date(data_analise) >= date('now', '-7 day')`,
    );
    if (!rows.length) return;
    const ruins = rows.filter((row) =>
      ['fraca', 'toxica', 'prejuizo'].includes(
        String(row.decisao).toLowerCase(),
      ),
    ).length;
    if (ruins < 5) return;

    await criarNotificacao({
      titulo: 'Muitas corridas ruins',
      mensagem: 'As analises recentes indicam muitas corridas fracas ou em prejuizo.',
      tipo: 'corrida',
      prioridade: 'media',
      destino: String(AppRoutes.analisarCorrida),
      canal: 'historico',
      grupoPreferencia: 'corrida',
      dedupKey: buildDailyDedupKey('muitas_corridas_ruins'),
    });
  },
};
