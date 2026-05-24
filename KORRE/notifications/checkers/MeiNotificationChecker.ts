import db from '../../database/DatabaseInit';
import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../NotificationService';
import { DIA_VENCIMENTO_DAS, getYearMonth } from './shared';

export const MeiNotificationChecker = {
  async run() {
    const pref = await db.getFirstAsync<{ valor: string }>(
      `SELECT valor FROM configuracoes_app WHERE chave = ?`,
      ['notificacoes_mei_ativas'],
    );
    if (!pref || pref.valor !== '1') return;

    const hoje = new Date();
    const anoMes = getYearMonth(hoje);
    const chave = `mei_das_pago_${anoMes}`;
    const status = await db.getFirstAsync<{ valor: string }>(
      'SELECT valor FROM configuracoes_app WHERE chave = ?',
      [chave],
    );
    if (status?.valor === 'true') return;

    const dia = hoje.getDate();
    if (dia === DIA_VENCIMENTO_DAS) {
      await criarNotificacao({
        titulo: 'DAS vence hoje',
        mensagem: 'O DAS do MEI vence hoje.',
        tipo: 'mei',
        prioridade: 'critica',
        destino: AppRoutes.finance,
        grupoPreferencia: 'mei',
        dedupKey: `das_vence_hoje:${anoMes}`,
      });
      return;
    }

    if (dia > DIA_VENCIMENTO_DAS) {
      await criarNotificacao({
        titulo: 'DAS possivelmente atrasado',
        mensagem: 'O vencimento do DAS ja passou. Verifique sua situacao.',
        tipo: 'mei',
        prioridade: 'critica',
        destino: AppRoutes.finance,
        grupoPreferencia: 'mei',
        dedupKey: `das_possivelmente_atrasado:${anoMes}`,
      });
      return;
    }

    if (dia >= DIA_VENCIMENTO_DAS - 2) {
      await criarNotificacao({
        titulo: 'DAS perto do vencimento',
        mensagem: 'O DAS do MEI esta perto do vencimento.',
        tipo: 'mei',
        prioridade: 'alta',
        destino: AppRoutes.finance,
        grupoPreferencia: 'mei',
        dedupKey: `das_perto_vencimento:${anoMes}`,
      });
    }
  },
};
