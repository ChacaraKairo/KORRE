import db from '../../database/DatabaseInit';
import type { FormularioViabilidade } from '../indicesKorre/domain/types';

interface PlannedMaintenanceItem {
  nome: string;
  icone: string;
  valor: number;
  intervaloKm: number;
  criticidade: 'baixa' | 'media' | 'alta';
}

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildPlannedItems = (
  form: Partial<FormularioViabilidade>,
): PlannedMaintenanceItem[] => {
  const items: PlannedMaintenanceItem[] = [
    {
      nome: 'Oleo e filtros',
      icone: 'droplets',
      valor: toNumber(form.valor_oleo_filtros),
      intervaloKm: toNumber(form.intervalo_oleo_filtros_km),
      criticidade: 'alta',
    },
    {
      nome: 'Pneus',
      icone: 'circle-dot',
      valor: toNumber(form.valor_jogo_pneus),
      intervaloKm: toNumber(form.durabilidade_pneus_km),
      criticidade: 'alta',
    },
    {
      nome: 'Freios',
      icone: 'disc',
      valor: toNumber(form.valor_manutencao_freios),
      intervaloKm: toNumber(form.intervalo_freios_km),
      criticidade: 'alta',
    },
    {
      nome: 'Transmissao/correia',
      icone: 'cog',
      valor: toNumber(form.valor_kit_transmissao),
      intervaloKm: toNumber(form.durabilidade_transmissao_km),
      criticidade: 'media',
    },
    {
      nome: 'Limpeza',
      icone: 'activity',
      valor: toNumber(form.limpeza_higienizacao_mensal),
      intervaloKm: 0,
      criticidade: 'baixa',
    },
  ];

  return items.filter(
    (item) => item.valor > 0 || item.intervaloKm > 0,
  );
};

export const MaintenancePlanningService = {
  async sincronizarDaAuditoria(
    veiculoId: number,
    form: Partial<FormularioViabilidade>,
  ) {
    const itens = buildPlannedItems(form);

    for (const item of itens) {
      const existente = await db.getFirstAsync<{
        id: number;
        origem: string | null;
        tem_historico_real: number | null;
      }>(
        `SELECT id, origem, tem_historico_real
         FROM itens_manutencao
         WHERE veiculo_id = ? AND lower(nome) = lower(?)
         LIMIT 1`,
        [veiculoId, item.nome],
      );

      if (!existente) {
        await db.runAsync(
          `INSERT INTO itens_manutencao (
            veiculo_id,
            nome,
            icone,
            ultima_troca_km,
            intervalo_km,
            intervalo_meses,
            criticidade,
            valor_previsto,
            origem,
            tem_historico_real,
            computar_no_custo
          ) VALUES (?, ?, ?, 0, ?, NULL, ?, ?, 'auditoria_korre', 0, 1)`,
          [
            veiculoId,
            item.nome,
            item.icone,
            item.intervaloKm || null,
            item.criticidade,
            item.valor,
          ],
        );
        continue;
      }

      if (Number(existente.tem_historico_real ?? 0) === 1) {
        continue;
      }

      await db.runAsync(
        `UPDATE itens_manutencao
         SET intervalo_km = COALESCE(?, intervalo_km),
             criticidade = ?,
             valor_previsto = ?,
             origem = 'auditoria_korre',
             computar_no_custo = 1
         WHERE id = ? AND COALESCE(tem_historico_real, 0) = 0`,
        [
          item.intervaloKm || null,
          item.criticidade,
          item.valor,
          existente.id,
        ],
      );
    }
  },
};
