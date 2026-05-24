import { AppRoutes } from '../../constants/routes';
import db from '../../database/DatabaseInit';
import { criarNotificacao } from '../NotificationService';
import { buildDailyDedupKey, buildWeeklyDedupKey } from '../notificationDedupKeys';
import { DIAS_SEM_LANCAMENTO, HORARIO_ALERTA_META, getToday, getYearWeek } from './shared';

export const FinancialNotificationChecker = {
  async run() {
    await this.verificarMetaDiaria();
    await this.verificarSemLancamentos();
    await this.verificarGanhosAbaixoMedia();
  },

  async verificarMetaDiaria() {
    const user = await db.getFirstAsync<{
      meta_diaria: number;
      tipo_meta: string;
    }>('SELECT meta_diaria, tipo_meta FROM perfil_usuario LIMIT 1');
    if (!user || user.tipo_meta !== 'diaria') return;
    const meta = Number(user.meta_diaria || 0);
    if (meta <= 0) return;

    const hoje = getToday();
    const ganhos = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(valor), 0) as total
       FROM transacoes_financeiras
       WHERE tipo = 'ganho' AND date(data_transacao) = ?`,
      [hoje],
    );
    const total = Number(ganhos?.total || 0);

    if (total >= meta) {
      await criarNotificacao({
        titulo: 'Meta diaria batida',
        mensagem: 'Voce atingiu sua meta diaria.',
        tipo: 'meta',
        prioridade: 'baixa',
        destino: AppRoutes.dashboard,
        canal: 'historico',
        grupoPreferencia: 'financeiro',
        dedupKey: `meta_batida:${hoje}`,
      });
      return;
    }

    if (new Date().getHours() >= HORARIO_ALERTA_META) {
      await criarNotificacao({
        titulo: 'Meta diaria incompleta',
        mensagem: `Faltam R$ ${(meta - total).toFixed(2)} para bater a meta de hoje.`,
        tipo: 'meta',
        prioridade: 'media',
        destino: AppRoutes.finance,
        grupoPreferencia: 'financeiro',
        dedupKey: `meta_incompleta:${hoje}`,
      });
    }
  },

  async verificarSemLancamentos() {
    const row = await db.getFirstAsync<{ ultima: string | null }>(
      `SELECT MAX(data_transacao) as ultima FROM transacoes_financeiras`,
    );
    if (!row?.ultima) return;
    const diff =
      (Date.now() - new Date(row.ultima).getTime()) / 86400000;
    if (diff < DIAS_SEM_LANCAMENTO) return;

    await criarNotificacao({
      titulo: 'Sem lancamentos recentes',
      mensagem: 'Voce esta ha alguns dias sem registrar ganhos ou despesas.',
      tipo: 'financeiro',
      prioridade: 'media',
      destino: AppRoutes.finance,
      canal: 'historico',
      grupoPreferencia: 'financeiro',
      dedupKey: buildDailyDedupKey('sem_lancamentos'),
    });
  },

  async verificarGanhosAbaixoMedia() {
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - 7);
    const inicioAnterior = new Date();
    inicioAnterior.setDate(inicioAnterior.getDate() - 14);

    const [atual, anterior] = await Promise.all([
      db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(valor), 0) as total
         FROM transacoes_financeiras
         WHERE tipo = 'ganho' AND date(data_transacao) >= date(?)`,
        [inicioSemana.toISOString().slice(0, 10)],
      ),
      db.getFirstAsync<{ total: number }>(
        `SELECT COALESCE(SUM(valor), 0) as total
         FROM transacoes_financeiras
         WHERE tipo = 'ganho'
           AND date(data_transacao) >= date(?)
           AND date(data_transacao) < date(?)`,
        [
          inicioAnterior.toISOString().slice(0, 10),
          inicioSemana.toISOString().slice(0, 10),
        ],
      ),
    ]);

    const atualTotal = Number(atual?.total || 0);
    const anteriorTotal = Number(anterior?.total || 0);
    if (anteriorTotal <= 0) return;
    if (atualTotal >= anteriorTotal * 0.85) return;

    await criarNotificacao({
      titulo: 'Ganhos abaixo da media',
      mensagem: 'Os ganhos recentes ficaram abaixo da semana anterior.',
      tipo: 'financeiro',
      prioridade: 'media',
      destino: AppRoutes.relatorios,
      canal: 'historico',
      grupoPreferencia: 'financeiro',
      dedupKey: `ganhos_abaixo_media:${getYearWeek()}`,
    });
  },
};
