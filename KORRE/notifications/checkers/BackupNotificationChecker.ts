import { AppRoutes } from '../../constants/routes';
import db from '../../database/DatabaseInit';
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
        titulo: 'Primeiro backup pendente',
        mensagem: 'Proteja seus dados exportando o primeiro backup do KORRE.',
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
      titulo: 'Backup antigo',
      mensagem: 'Seu ultimo backup esta antigo. Atualize para manter seguranca dos dados.',
      tipo: 'backup',
      prioridade: 'alta',
      destino: AppRoutes.configuracoes,
      grupoPreferencia: 'backup',
      dedupKey: buildDailyDedupKey('backup_antigo'),
    });
  },
};
