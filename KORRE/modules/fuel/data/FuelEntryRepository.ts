import type { FuelEntryRecord } from '../domain/fuelTypes';

export const FuelEntryRepository = {
  async criar(input: {
    veiculoId?: number | null;
    usuarioLocalId?: number | null;
    dataAbastecimento?: string;
    kmAtual?: number | null;
    tipoCombustivel: string;
    litros?: number | null;
    valorTotal: number;
    precoUnitario?: number | null;
    tanqueCheio?: boolean;
    cidade?: string | null;
    estadoUf?: string | null;
    origem?: string;
    elegivelEstatistica?: boolean;
    observacao?: string | null;
    criadoSemLogin?: boolean;
    vinculadoAposCadastro?: boolean;
  }) {
    const db = (await import('../../../database/DatabaseInit')).default;
    const result: any = await db.runAsync(
      `INSERT INTO abastecimentos (
        veiculo_id, usuario_local_id, data_abastecimento, km_atual, tipo_combustivel,
        litros, valor_total, preco_unitario, tanque_cheio, cidade, estado_uf,
        origem, elegivel_estatistica, observacao, criado_sem_login, vinculado_apos_cadastro
      ) VALUES (?, ?, COALESCE(?, datetime('now', 'localtime')), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.veiculoId ?? null,
        input.usuarioLocalId ?? null,
        input.dataAbastecimento ?? null,
        input.kmAtual ?? null,
        input.tipoCombustivel,
        input.litros ?? null,
        input.valorTotal,
        input.precoUnitario ?? null,
        input.tanqueCheio ? 1 : 0,
        input.cidade ?? null,
        input.estadoUf ?? null,
        input.origem ?? 'calculadora_flex',
        input.elegivelEstatistica ? 1 : 0,
        input.observacao ?? null,
        input.criadoSemLogin ? 1 : 0,
        input.vinculadoAposCadastro ? 1 : 0,
      ],
    );

    const id = Number(result.lastInsertRowId);
    return id;
  },

  async registrarEventoAbastecimento(input: {
    veiculoId?: number | null;
    kmAtual?: number | null;
    valorTotal: number;
    tipoCombustivel: string;
    origem?: string;
    elegivelEstatistica?: boolean;
    detalhes?: Record<string, unknown>;
  }) {
    const db = (await import('../../../database/DatabaseInit')).default;
    await db.runAsync(
      `INSERT INTO eventos_veiculo (
        veiculo_id, tipo_evento, km_evento, valor_total, categoria, subcategoria,
        origem, detalhes_json, elegivel_estatistica
      ) VALUES (?, 'abastecimento', ?, ?, 'combustivel', ?, ?, ?, ?)`,
      [
        input.veiculoId ?? null,
        input.kmAtual ?? null,
        input.valorTotal,
        input.tipoCombustivel,
        input.origem ?? 'calculadora_flex',
        input.detalhes ? JSON.stringify(input.detalhes) : null,
        input.elegivelEstatistica ? 1 : 0,
      ],
    );
  },

  async listarPorVeiculo(veiculoId: number) {
    const db = (await import('../../../database/DatabaseInit')).default;
    return db.getAllAsync<FuelEntryRecord>(
      `SELECT * FROM abastecimentos
       WHERE veiculo_id = ?
       ORDER BY data_abastecimento DESC, id DESC`,
      [veiculoId],
    );
  },

  async listarSemLogin() {
    const db = (await import('../../../database/DatabaseInit')).default;
    return db.getAllAsync<FuelEntryRecord>(
      `SELECT * FROM abastecimentos
       WHERE criado_sem_login = 1 AND veiculo_id IS NULL
       ORDER BY data_abastecimento DESC, id DESC`,
    );
  },

  async contarSemLogin() {
    const db = (await import('../../../database/DatabaseInit')).default;
    const row = await db.getFirstAsync<{ total: number }>(
      `SELECT COUNT(*) as total FROM abastecimentos WHERE criado_sem_login = 1 AND veiculo_id IS NULL`,
    );
    return Number(row?.total || 0);
  },

  async vincularSemLoginAoVeiculo(veiculoId: number) {
    const db = (await import('../../../database/DatabaseInit')).default;
    await db.runAsync(
      `UPDATE abastecimentos
       SET veiculo_id = ?, vinculado_apos_cadastro = 1
       WHERE criado_sem_login = 1 AND veiculo_id IS NULL`,
      [veiculoId],
    );
  },

  async apagarSemLogin() {
    const db = (await import('../../../database/DatabaseInit')).default;
    await db.runAsync(
      `DELETE FROM abastecimentos WHERE criado_sem_login = 1 AND veiculo_id IS NULL`,
    );
  },
};
