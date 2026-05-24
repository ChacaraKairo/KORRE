import type { FuelEntryRecord, FuelConsumptionSummary } from '../domain/fuelTypes';

/**
 * Executa a função de diff days.
 */
function diffDays(aIso: string, bIso: string) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.abs(a - b) / 86400000;
}

export const FuelConsumptionService = {
  calcularResumo(entries: FuelEntryRecord[]): FuelConsumptionSummary | null {
    if (!entries.length) return null;
    const ordenado = [...entries].sort(
      (a, b) =>
        new Date(a.data_abastecimento).getTime() -
        new Date(b.data_abastecimento).getTime(),
    );
    const withKm = ordenado.filter((e) => Number(e.km_atual) > 0);
    const kmRodados =
      withKm.length >= 2
        ? Number(withKm[withKm.length - 1].km_atual || 0) -
          Number(withKm[0].km_atual || 0)
        : 0;
    const litrosConsumidos = ordenado.reduce(
      (sum, e) => sum + Number(e.litros || 0),
      0,
    );
    const custoCombustivelTotal = ordenado.reduce(
      (sum, e) => sum + Number(e.valor_total || 0),
      0,
    );
    const consumoKmL =
      kmRodados > 0 && litrosConsumidos > 0
        ? kmRodados / litrosConsumidos
        : 0;
    const custoCombustivelKm =
      kmRodados > 0 ? custoCombustivelTotal / kmRodados : 0;
    const ticketMedio =
      custoCombustivelTotal / Math.max(1, ordenado.length);
    const frequenciaDias =
      ordenado.length >= 2
        ? diffDays(
            ordenado[0].data_abastecimento,
            ordenado[ordenado.length - 1].data_abastecimento,
          ) /
          (ordenado.length - 1)
        : 0;
    const tanqueCheioCount = ordenado.filter(
      (e) => Number(e.tanque_cheio) === 1,
    ).length;
    let confianca: 'alta' | 'media' | 'baixa' = 'baixa';
    if (tanqueCheioCount >= 2 && kmRodados > 0 && litrosConsumidos > 0) {
      confianca = 'alta';
    } else if (ordenado.length >= 2 && kmRodados > 0 && litrosConsumidos > 0) {
      confianca = 'media';
    }

    return {
      kmRodados: Number(kmRodados.toFixed(2)),
      litrosConsumidos: Number(litrosConsumidos.toFixed(2)),
      consumoKmL: Number(consumoKmL.toFixed(2)),
      custoCombustivelTotal: Number(custoCombustivelTotal.toFixed(2)),
      custoCombustivelKm: Number(custoCombustivelKm.toFixed(4)),
      ticketMedio: Number(ticketMedio.toFixed(2)),
      frequenciaDias: Number(frequenciaDias.toFixed(1)),
      confianca,
    };
  },

  async recalcularEPersistir(veiculoId: number, combustivel = 'misto') {
    const db = (await import('../../../database/DatabaseInit')).default;
    const entries = await db.getAllAsync<FuelEntryRecord>(
      `SELECT * FROM abastecimentos WHERE veiculo_id = ? ORDER BY data_abastecimento ASC`,
      [veiculoId],
    );
    const resumo = this.calcularResumo(entries);
    if (!resumo) return null;

    const first = entries[0]?.data_abastecimento?.slice(0, 10);
    const last =
      entries[entries.length - 1]?.data_abastecimento?.slice(0, 10);

    await db.runAsync(
      `INSERT INTO consumo_veiculo_periodo (
        veiculo_id, periodo_inicio, periodo_fim, km_rodados, litros_consumidos, combustivel,
        consumo_km_l, custo_combustivel_total, custo_combustivel_km, confianca_calculo, origem
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'abastecimentos')`,
      [
        veiculoId,
        first ?? null,
        last ?? null,
        resumo.kmRodados,
        resumo.litrosConsumidos,
        combustivel,
        resumo.consumoKmL,
        resumo.custoCombustivelTotal,
        resumo.custoCombustivelKm,
        resumo.confianca,
      ],
    );

    return resumo;
  },

  async getLatestSummaryForVehicle(veiculoId: number) {
    const db = (await import('../../../database/DatabaseInit')).default;
    return db.getFirstAsync<{
      consumo_km_l: number | null;
      custo_combustivel_km: number | null;
      confianca_calculo: 'alta' | 'media' | 'baixa' | null;
    }>(
      `SELECT consumo_km_l, custo_combustivel_km, confianca_calculo
       FROM consumo_veiculo_periodo
       WHERE veiculo_id = ?
       ORDER BY data_calculo DESC, id DESC
       LIMIT 1`,
      [veiculoId],
    );
  },
};
