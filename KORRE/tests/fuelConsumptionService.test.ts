import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FuelConsumptionService } from '../modules/fuel/application/FuelConsumptionService';
import type { FuelEntryRecord } from '../modules/fuel/domain/fuelTypes';

const base = (overrides: Partial<FuelEntryRecord>): FuelEntryRecord => ({
  id: 1,
  veiculo_id: 1,
  usuario_local_id: null,
  data_abastecimento: '2026-05-01T10:00:00.000Z',
  km_atual: 1000,
  tipo_combustivel: 'gasolina',
  litros: 10,
  valor_total: 50,
  preco_unitario: 5,
  tanque_cheio: 1,
  cidade: null,
  estado_uf: null,
  origem: 'manual',
  sincronizado: 0,
  elegivel_estatistica: 0,
  observacao: null,
  criado_sem_login: 0,
  vinculado_apos_cadastro: 0,
  ...overrides,
});

describe('FuelConsumptionService', () => {
  it('confianca alta apenas com dados suficientes', () => {
    const rows: FuelEntryRecord[] = [
      base({
        id: 1,
        data_abastecimento: '2026-05-01T10:00:00.000Z',
        km_atual: 1000,
        litros: 10,
        tanque_cheio: 1,
      }),
      base({
        id: 2,
        data_abastecimento: '2026-05-10T10:00:00.000Z',
        km_atual: 1200,
        litros: 12,
        tanque_cheio: 1,
      }),
    ];
    const resumo = FuelConsumptionService.calcularResumo(rows);
    assert.ok(resumo);
    assert.equal(resumo?.confianca, 'alta');
  });

  it('confianca media sem tanque cheio mas com km/litros', () => {
    const rows: FuelEntryRecord[] = [
      base({
        id: 1,
        data_abastecimento: '2026-05-01T10:00:00.000Z',
        km_atual: 1000,
        litros: 10,
        tanque_cheio: 0,
      }),
      base({
        id: 2,
        data_abastecimento: '2026-05-10T10:00:00.000Z',
        km_atual: 1200,
        litros: 12,
        tanque_cheio: 0,
      }),
    ];
    const resumo = FuelConsumptionService.calcularResumo(rows);
    assert.equal(resumo?.confianca, 'media');
  });
});
