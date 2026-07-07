import db from '../../database/DatabaseInit';
import { AppRoutes } from '../../constants/routes';
import i18n from '../../locales/i18n';
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
      titulo: i18n.t('notifications.ride.many_bad_title'),
      mensagem: i18n.t('notifications.ride.many_bad_body'),
      tipo: 'corrida',
      prioridade: 'media',
      destino: String(AppRoutes.analisarCorrida),
      canal: 'historico',
      grupoPreferencia: 'corrida',
      dedupKey: buildDailyDedupKey('muitas_corridas_ruins'),
    });
  },
};
