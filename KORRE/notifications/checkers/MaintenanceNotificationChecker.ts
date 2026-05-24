import { AppRoutes } from '../../constants/routes';
import db from '../../database/DatabaseInit';
import { criarNotificacao } from '../NotificationService';
import { buildMaintenanceDedupKey, buildWeeklyDedupKey } from '../notificationDedupKeys';
import { KM_ALERTA_MANUTENCAO, getVeiculoAtivo, getYearWeek } from './shared';

export const MaintenanceNotificationChecker = {
  async run() {
    const veiculo = await getVeiculoAtivo();
    if (!veiculo) return;

    const itens = await db.getAllAsync<{
      id: number;
      nome: string;
      ultima_troca_km: number;
      intervalo_km: number | null;
      origem: string | null;
      tem_historico_real: number | null;
      valor_previsto: number | null;
    }>(
      `SELECT id, nome, ultima_troca_km, intervalo_km, origem, tem_historico_real, valor_previsto
       FROM itens_manutencao
       WHERE veiculo_id = ? AND COALESCE(computar_no_custo, 1) = 1`,
      [veiculo.id],
    );

    if (!itens.length) {
      await criarNotificacao({
        titulo: 'Veiculo sem manutencao cadastrada',
        mensagem: 'Cadastre itens de manutencao para acompanhar custos e ciclos.',
        tipo: 'oficina',
        prioridade: 'media',
        destino: AppRoutes.oficina,
        grupoPreferencia: 'manutencao',
        dedupKey: `veiculo_sem_manutencao:${veiculo.id}`,
      });
      return;
    }

    let semHistoricoReal = 0;
    for (const item of itens) {
      const planejado =
        item.origem === 'auditoria_korre' &&
        Number(item.tem_historico_real ?? 0) === 0;
      if (planejado) {
        semHistoricoReal += 1;
        await criarNotificacao({
          titulo: `${item.nome} planejado`,
          mensagem: `Voce ja planejou ${item.nome}, mas ainda nao registrou a primeira manutencao real.`,
          tipo: 'oficina',
          prioridade: 'media',
          destino: AppRoutes.oficina,
          canal: 'historico',
          grupoPreferencia: 'manutencao',
          dedupKey: `manutencao_planejada_pendente:${item.id}`,
        });
        continue;
      }

      const intervalo = Number(item.intervalo_km || 0);
      if (intervalo <= 0) continue;
      const limite = Number(item.ultima_troca_km || 0) + intervalo;
      const restante = limite - Number(veiculo.km_atual || 0);

      if (restante <= 0) {
        await criarNotificacao({
          titulo: `${item.nome} vencida`,
          mensagem: `A manutencao passou do limite em ${Math.abs(restante)} km.`,
          tipo: 'manutencao',
          prioridade: 'critica',
          destino: AppRoutes.oficina,
          grupoPreferencia: 'manutencao',
          dedupKey: buildMaintenanceDedupKey(item.id, 'vencida', limite),
        });
      } else if (restante <= KM_ALERTA_MANUTENCAO) {
        await criarNotificacao({
          titulo: `${item.nome} quase no limite`,
          mensagem: `Faltam ${restante} km para a proxima manutencao.`,
          tipo: 'manutencao',
          prioridade: 'alta',
          destino: AppRoutes.oficina,
          grupoPreferencia: 'manutencao',
          dedupKey: buildMaintenanceDedupKey(item.id, 'proxima', limite),
        });
      }
    }

    if (semHistoricoReal === itens.length) {
      await criarNotificacao({
        titulo: 'Oficina sem dados reais',
        mensagem: 'Registre manutencoes reais para melhorar os indices e evitar estimativas antigas.',
        tipo: 'oficina',
        prioridade: 'media',
        destino: AppRoutes.oficina,
        canal: 'historico',
        grupoPreferencia: 'manutencao',
        dedupKey: `oficina_sem_dados:${veiculo.id}:${getYearWeek()}`,
      });
    }

    await this.verificarDivergenciaPrevistoReal(veiculo.id);
  },

  async verificarDivergenciaPrevistoReal(veiculoId: number) {
    const rows = await db.getAllAsync<{
      historico_id: number;
      item_id: number;
      nome: string;
      valor_previsto: number | null;
      valor_pago: number;
    }>(
      `SELECT h.id as historico_id, i.id as item_id, i.nome, i.valor_previsto, h.valor as valor_pago
       FROM historico_manutencao h
       INNER JOIN itens_manutencao i ON i.id = h.item_id
       WHERE h.veiculo_id = ? AND COALESCE(i.valor_previsto, 0) > 0
       ORDER BY h.id DESC
       LIMIT 20`,
      [veiculoId],
    );

    for (const row of rows) {
      const previsto = Number(row.valor_previsto || 0);
      if (previsto <= 0) continue;
      const pago = Number(row.valor_pago || 0);
      const diff = Math.abs((pago - previsto) / previsto);
      if (diff < 0.2) continue;

      await criarNotificacao({
        titulo: `${row.nome} acima do previsto`,
        mensagem: `${row.nome} custou mais que o previsto. Revise seus indices KORRE.`,
        tipo: 'auditoria',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: `manutencao_divergente:${row.item_id}:${row.historico_id}`,
      });
    }
  },
};
