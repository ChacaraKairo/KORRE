import { AppRoutes } from '../../constants/routes';
import db from '../../database/DatabaseInit';
import i18n from '../../locales/i18n';
import { criarNotificacao } from '../NotificationService';
import { buildDailyDedupKey } from '../notificationDedupKeys';
import { DIAS_BACKUP_ALERTA } from './shared';

export const BackupNotificationChecker = {
  async run() {
    const row = await db.getFirstAsync<{ valor: string }>(
      `SELECT valor FROM configuracoes_app WHERE chave = ?`,
      ['ultimo_backup_exportado_em'],
    );

    if (!row?.valor) {
      await criarNotificacao({
        titulo: i18n.t('notifications.backup.first_pending_title'),
        mensagem: i18n.t('notifications.backup.first_pending_body'),
        tipo: 'backup',
        prioridade: 'alta',
        destino: AppRoutes.configuracoes,
        grupoPreferencia: 'backup',
        dedupKey: buildDailyDedupKey('backup_pendente', 'sem_backup'),
      });
      return;
    }

    const diff =
      (Date.now() - new Date(row.valor).getTime()) / 86400000;
    if (diff < DIAS_BACKUP_ALERTA) return;

    await criarNotificacao({
      titulo: i18n.t('notifications.backup.old_title'),
      mensagem: i18n.t('notifications.backup.old_body'),
      tipo: 'backup',
      prioridade: 'alta',
      destino: AppRoutes.configuracoes,
      grupoPreferencia: 'backup',
      dedupKey: buildDailyDedupKey('backup_antigo'),
    });
  },
};
