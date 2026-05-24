import type { VehicleAnalyticsRecord } from '../sync/syncTypes';
import { dateToMonth, kmToRange, valueToRange } from '../sync/DataAnonymizer';

/**
 * Executa a função de to num.
 */
function toNum(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export const VehicleDataAggregationService = {
  async gerarAnalyticsRecords(): Promise<VehicleAnalyticsRecord[]> {
    const db = (await import('../../database/DatabaseInit')).default;
    const records: VehicleAnalyticsRecord[] = [];

    const abastecimentos = await db.getAllAsync<{
      data_abastecimento: string;
      km_atual: number | null;
      tipo_combustivel: string | null;
      litros: number | null;
      valor_total: number | null;
      preco_unitario: number | null;
      tanque_cheio: number | null;
      estado_uf: string | null;
      cidade: string | null;
      tipo: string | null;
      marca: string | null;
      modelo: string | null;
      ano: number | null;
    }>(`SELECT a.*, v.tipo, v.marca, v.modelo, v.ano
       FROM abastecimentos a
       LEFT JOIN veiculos v ON v.id = a.veiculo_id
       WHERE COALESCE(a.elegivel_estatistica, 0) = 1`);

    for (const item of abastecimentos) {
      records.push({
        type: 'fuel_entry',
        vehicleProfile: {
          vehicleType: item.tipo ?? undefined,
          brand: item.marca ?? undefined,
          model: item.modelo ?? undefined,
          year: item.ano ?? undefined,
          fuelType: item.tipo_combustivel ?? undefined,
          stateUf: item.estado_uf ?? undefined,
          cityGroup: item.cidade ? item.cidade.toLowerCase().slice(0, 24) : undefined,
          kmRange: kmToRange(toNum(item.km_atual) ?? 0),
        },
        metrics: {
          liters: toNum(item.litros),
          totalValueRange: valueToRange(toNum(item.valor_total) ?? 0),
          unitPrice: toNum(item.preco_unitario),
          fullTank: Boolean(item.tanque_cheio),
          periodMonth: dateToMonth(item.data_abastecimento),
        },
      });
    }

    const consumo = await db.getAllAsync<{
      data_calculo: string;
      consumo_km_l: number | null;
      custo_combustivel_km: number | null;
      confianca_calculo: string | null;
      tipo: string | null;
      marca: string | null;
      modelo: string | null;
      ano: number | null;
    }>(`SELECT c.*, v.tipo, v.marca, v.modelo, v.ano
       FROM consumo_veiculo_periodo c
       LEFT JOIN veiculos v ON v.id = c.veiculo_id`);
    for (const item of consumo) {
      records.push({
        type: 'fuel_consumption',
        vehicleProfile: {
          vehicleType: item.tipo ?? undefined,
          brand: item.marca ?? undefined,
          model: item.modelo ?? undefined,
          year: item.ano ?? undefined,
        },
        metrics: {
          consumoKmL: toNum(item.consumo_km_l),
          custoCombustivelKm: toNum(item.custo_combustivel_km),
          confianca: item.confianca_calculo ?? 'baixa',
          periodMonth: dateToMonth(item.data_calculo),
        },
      });
    }

    const manutencoes = await db.getAllAsync<{
      data_servico: string;
      km_servico: number | null;
      valor: number | null;
      descricao: string | null;
      tipo: string | null;
      marca: string | null;
      modelo: string | null;
      ano: number | null;
    }>(`SELECT h.*, v.tipo, v.marca, v.modelo, v.ano
       FROM historico_manutencao h
       LEFT JOIN veiculos v ON v.id = h.veiculo_id`);
    for (const item of manutencoes) {
      const text = `${item.descricao ?? ''}`.toLowerCase();
      const system = text.includes('pneu')
        ? 'pneu'
        : text.includes('freio')
          ? 'freio'
          : text.includes('transmiss')
            ? 'transmissao'
            : text.includes('oleo') || text.includes('filtro')
              ? 'oleo'
              : text.includes('limpeza')
                ? 'limpeza'
                : 'manutencao';
      records.push({
        type: 'maintenance_event',
        vehicleProfile: {
          vehicleType: item.tipo ?? undefined,
          brand: item.marca ?? undefined,
          model: item.modelo ?? undefined,
          year: item.ano ?? undefined,
          kmRange: kmToRange(toNum(item.km_servico) ?? 0),
        },
        metrics: {
          eventType: 'maintenance_real',
          system,
          valueRange: valueToRange(toNum(item.valor) ?? 0),
          kmRange: kmToRange(toNum(item.km_servico) ?? 0),
          planned: false,
          periodMonth: dateToMonth(item.data_servico),
        },
      });
    }

    const corridas = await db.getAllAsync<{
      data_analise: string;
      decisao: string | null;
      distancia_corrida_km: number | null;
      tempo_total_minutos: number | null;
      lucro_por_hora: number | null;
      tipo: string | null;
      marca: string | null;
      modelo: string | null;
      ano: number | null;
    }>(`SELECT a.*, v.tipo, v.marca, v.modelo, v.ano
       FROM analises_corrida a
       LEFT JOIN veiculos v ON v.id = a.veiculo_id`);
    for (const item of corridas) {
      records.push({
        type: 'ride_analysis',
        vehicleProfile: {
          vehicleType: item.tipo ?? undefined,
          brand: item.marca ?? undefined,
          model: item.modelo ?? undefined,
          year: item.ano ?? undefined,
        },
        metrics: {
          decision: item.decisao ?? 'desconhecida',
          distanceRange: valueToRange(toNum(item.distancia_corrida_km) ?? 0),
          timeRange: valueToRange(toNum(item.tempo_total_minutos) ?? 0),
          profitHourRange: valueToRange(toNum(item.lucro_por_hora) ?? 0),
          belowGoal: (toNum(item.lucro_por_hora) ?? 0) < 0,
          periodMonth: dateToMonth(item.data_analise),
        },
      });
    }

    return records;
  },
};

/**
 * Executa a função de possui campos sensiveis.
 */
export function possuiCamposSensiveis(row: Record<string, unknown>) {
  const blocked = ['cpf', 'email', 'nome', 'placa', 'senha', 'hash', 'id'];
  return Object.keys(row).some((key) =>
    blocked.some((term) => key.toLowerCase().includes(term)),
  );
}
