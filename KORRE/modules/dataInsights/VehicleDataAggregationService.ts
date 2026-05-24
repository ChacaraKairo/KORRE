export interface VehicleAggregateRow {
  tipo_veiculo: string | null;
  marca: string | null;
  modelo: string | null;
  ano: number | null;
  combustivel: string | null;
  estado_uf: string | null;
  cidade_opcional: string | null;
  consumo_medio_km_l: number | null;
  custo_combustivel_km: number | null;
  ticket_medio_abastecimento: number | null;
  frequencia_abastecimento_dias: number | null;
  km_medio_por_dia: number | null;
  custo_manutencao_medio: number | null;
}

export const VehicleDataAggregationService = {
  async gerarVisaoAgregadaLocal(): Promise<VehicleAggregateRow[]> {
    const db = (await import('../../database/DatabaseInit')).default;
    const rows = await db.getAllAsync<VehicleAggregateRow>(
      `SELECT
        v.tipo as tipo_veiculo,
        v.marca,
        v.modelo,
        CAST(v.ano as INTEGER) as ano,
        (
          SELECT a.tipo_combustivel
          FROM abastecimentos a
          WHERE a.veiculo_id = v.id
          ORDER BY a.data_abastecimento DESC, a.id DESC
          LIMIT 1
        ) as combustivel,
        (
          SELECT a.estado_uf
          FROM abastecimentos a
          WHERE a.veiculo_id = v.id
          ORDER BY a.data_abastecimento DESC, a.id DESC
          LIMIT 1
        ) as estado_uf,
        (
          SELECT a.cidade
          FROM abastecimentos a
          WHERE a.veiculo_id = v.id
          ORDER BY a.data_abastecimento DESC, a.id DESC
          LIMIT 1
        ) as cidade_opcional,
        (
          SELECT AVG(c.consumo_km_l)
          FROM consumo_veiculo_periodo c
          WHERE c.veiculo_id = v.id
        ) as consumo_medio_km_l,
        (
          SELECT AVG(c.custo_combustivel_km)
          FROM consumo_veiculo_periodo c
          WHERE c.veiculo_id = v.id
        ) as custo_combustivel_km,
        (
          SELECT AVG(a.valor_total)
          FROM abastecimentos a
          WHERE a.veiculo_id = v.id
        ) as ticket_medio_abastecimento,
        (
          SELECT CASE
            WHEN COUNT(*) > 1 THEN (julianday(MAX(data_abastecimento)) - julianday(MIN(data_abastecimento))) / (COUNT(*) - 1)
            ELSE NULL
          END
          FROM abastecimentos a
          WHERE a.veiculo_id = v.id
        ) as frequencia_abastecimento_dias,
        (
          SELECT CASE
            WHEN COUNT(*) > 0 THEN (MAX(km_servico) - MIN(km_servico)) / MAX(1, (julianday(MAX(data_servico)) - julianday(MIN(data_servico))))
            ELSE NULL
          END
          FROM historico_manutencao h
          WHERE h.veiculo_id = v.id
        ) as km_medio_por_dia,
        (
          SELECT AVG(h.valor)
          FROM historico_manutencao h
          WHERE h.veiculo_id = v.id
        ) as custo_manutencao_medio
      FROM veiculos v`,
    );

    return rows.map((row) => ({
      ...row,
      cidade_opcional: row.cidade_opcional ?? null,
    }));
  },
};

export function possuiCamposSensiveis(
  row: Record<string, unknown>,
) {
  const blocked = [
    'cpf',
    'email',
    'nome',
    'placa',
    'senha',
    'hash',
    'id',
    'veiculo_id',
    'usuario_id',
  ];
  return Object.keys(row).some((key) =>
    blocked.some((term) => key.toLowerCase() === term),
  );
}
