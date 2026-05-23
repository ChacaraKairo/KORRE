import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RideDecisionService } from '../modules/rideDecision';

describe('RideDecisionService', () => {
  it('calcula custos, lucro e lucro por hora', () => {
    const result = RideDecisionService.analyze({
      valorOferecido: 40,
      distanciaAteEmbarqueKm: 2,
      distanciaViagemKm: 8,
      tempoTotalMinutos: 30,
      custoKm: 1,
      custoMinuto: 0.2,
      metaMinuto: 0.5,
    });

    assert.equal(result.distanciaTotalKm, 10);
    assert.equal(result.custoDistancia, 10);
    assert.equal(result.custoTempo, 6);
    assert.equal(result.custoTotal, 16);
    assert.equal(result.lucroLiquido, 24);
    assert.equal(result.lucroPorHora, 48);
    assert.equal(result.decisao, 'ideal');
  });

  it('classifica prejuizo quando a corrida nao cobre custos', () => {
    const result = RideDecisionService.analyze({
      valorOferecido: 10,
      distanciaAteEmbarqueKm: 5,
      distanciaViagemKm: 10,
      tempoTotalMinutos: 20,
      custoKm: 1,
      custoMinuto: 0.5,
      metaMinuto: 0.4,
    });

    assert.equal(result.decisao, 'prejuizo');
  });

  it('classifica corrida toxica quando fica muito abaixo da meta', () => {
    const result = RideDecisionService.analyze({
      valorOferecido: 22,
      distanciaAteEmbarqueKm: 2,
      distanciaViagemKm: 8,
      tempoTotalMinutos: 40,
      custoKm: 1,
      custoMinuto: 0.2,
      metaMinuto: 0.5,
    });

    assert.equal(result.decisao, 'toxica');
  });
});

