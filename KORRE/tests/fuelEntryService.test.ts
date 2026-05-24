import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FuelEntryService } from '../modules/fuel/application/FuelEntryService';
import { FuelEntryRepository } from '../modules/fuel/data/FuelEntryRepository';
import { DataConsentService } from '../modules/privacy/DataConsentService';

describe('FuelEntryService', () => {
  it('nao salva sem valor_total', () => {
    assert.throws(
      () =>
        FuelEntryService.normalizarEntrada({
          tipoCombustivel: 'gasolina',
          valorTotal: 0,
        }),
      /valor_total_obrigatorio/,
    );
  });

  it('nao salva sem tipo_combustivel', () => {
    assert.throws(
      () =>
        FuelEntryService.normalizarEntrada({
          tipoCombustivel: '' as any,
          valorTotal: 50,
        }),
      /tipo_combustivel_obrigatorio/,
    );
  });

  it('calcula preco_unitario com valor_total e litros', () => {
    const parsed = FuelEntryService.normalizarEntrada({
      tipoCombustivel: 'etanol',
      valorTotal: 100,
      litros: 20,
    });
    assert.equal(parsed.precoUnitario, 5);
  });

  it('calcula litros com valor_total e preco_unitario', () => {
    const parsed = FuelEntryService.normalizarEntrada({
      tipoCombustivel: 'gasolina',
      valorTotal: 120,
      precoUnitario: 6,
    });
    assert.equal(parsed.litros, 20);
  });

  it('abastecimento sem login marca criado_sem_login=1', async () => {
    const originalCan = DataConsentService.canBeEligibleForStats;
    const originalCriar = FuelEntryRepository.criar;
    const originalEvento = FuelEntryRepository.registrarEventoAbastecimento;
    let payload: any;
    (DataConsentService as any).canBeEligibleForStats = async () => false;
    (FuelEntryRepository as any).criar = async (input: any) => {
      payload = input;
      return 123;
    };
    (FuelEntryRepository as any).registrarEventoAbastecimento =
      async () => {};

    try {
      const res = await FuelEntryService.salvarAbastecimento({
        tipoCombustivel: 'gasolina',
        valorTotal: 50,
      });
      assert.equal(payload.criadoSemLogin, true);
      assert.equal(res.criadoSemLogin, 1);
    } finally {
      (DataConsentService as any).canBeEligibleForStats = originalCan;
      (FuelEntryRepository as any).criar = originalCriar;
      (FuelEntryRepository as any).registrarEventoAbastecimento =
        originalEvento;
    }
  });

  it('sem consentimento fica elegivel_estatistica=0', async () => {
    const originalCan = DataConsentService.canBeEligibleForStats;
    const originalCriar = FuelEntryRepository.criar;
    const originalEvento = FuelEntryRepository.registrarEventoAbastecimento;
    let payload: any;
    (DataConsentService as any).canBeEligibleForStats = async () => false;
    (FuelEntryRepository as any).criar = async (input: any) => {
      payload = input;
      return 1;
    };
    (FuelEntryRepository as any).registrarEventoAbastecimento =
      async () => {};

    try {
      const res = await FuelEntryService.salvarAbastecimento({
        tipoCombustivel: 'gasolina',
        valorTotal: 50,
        veiculoId: 3,
      });
      assert.equal(payload.elegivelEstatistica, false);
      assert.equal(res.elegivelEstatistica, 0);
    } finally {
      (DataConsentService as any).canBeEligibleForStats = originalCan;
      (FuelEntryRepository as any).criar = originalCriar;
      (FuelEntryRepository as any).registrarEventoAbastecimento =
        originalEvento;
    }
  });

  it('com consentimento ativo permite elegivel_estatistica=1', async () => {
    const originalCan = DataConsentService.canBeEligibleForStats;
    const originalCriar = FuelEntryRepository.criar;
    const originalEvento = FuelEntryRepository.registrarEventoAbastecimento;
    let payload: any;
    (DataConsentService as any).canBeEligibleForStats = async () => true;
    (FuelEntryRepository as any).criar = async (input: any) => {
      payload = input;
      return 1;
    };
    (FuelEntryRepository as any).registrarEventoAbastecimento =
      async () => {};

    try {
      const res = await FuelEntryService.salvarAbastecimento({
        tipoCombustivel: 'etanol',
        valorTotal: 70,
        veiculoId: 10,
      });
      assert.equal(payload.elegivelEstatistica, true);
      assert.equal(res.elegivelEstatistica, 1);
    } finally {
      (DataConsentService as any).canBeEligibleForStats = originalCan;
      (FuelEntryRepository as any).criar = originalCriar;
      (FuelEntryRepository as any).registrarEventoAbastecimento =
        originalEvento;
    }
  });

  it('vincular abastecimento chama repositorio com veiculo', async () => {
    const original = FuelEntryRepository.vincularSemLoginAoVeiculo;
    let veiculoId: number | null = null;
    (FuelEntryRepository as any).vincularSemLoginAoVeiculo = async (
      id: number,
    ) => {
      veiculoId = id;
    };
    try {
      await FuelEntryService.vincularPendentesAoVeiculo(42);
      assert.equal(veiculoId, 42);
    } finally {
      (FuelEntryRepository as any).vincularSemLoginAoVeiculo = original;
    }
  });
});
