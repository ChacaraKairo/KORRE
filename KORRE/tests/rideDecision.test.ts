import assert from 'node:assert/strict';
import test from 'node:test';

import { RideDecisionService } from '../modules/rideDecision/domain/rideDecisionService';

test('ride decision calculates base cost and acceptable profit', () => {
  const result = RideDecisionService.analisar({
    valorOferta: 32,
    tempoTotalMinutos: 30,
    kmAteEmbarque: 2,
    kmViagem: 10,
    custoKm: 1,
    custoMinuto: 0.2,
    metaLucroMinuto: 0.4,
  });

  assert.equal(result.distanciaTotal, 12);
  assert.equal(result.custoTotal, 18);
  assert.equal(result.lucroLiquido, 14);
  assert.equal(result.lucroPorHora, 28);
  assert.equal(result.decisao, 'aceitavel');
});

test('ride decision marks loss when the offer does not cover costs', () => {
  const result = RideDecisionService.analisar({
    valorOferta: 10,
    tempoTotalMinutos: 25,
    kmAteEmbarque: 3,
    kmViagem: 8,
    custoKm: 1.1,
    custoMinuto: 0.15,
    metaLucroMinuto: 0.4,
  });

  assert.equal(result.decisao, 'prejuizo');
  assert.equal(result.motivo, 'ride_decision.motivos.prejuizo');
});

test('ride decision flags toxic ride when pickup distance weighs too much', () => {
  const result = RideDecisionService.analisar({
    valorOferta: 24,
    tempoTotalMinutos: 30,
    kmAteEmbarque: 6,
    kmViagem: 6,
    custoKm: 1,
    custoMinuto: 0.1,
    metaLucroMinuto: 0.5,
  });

  assert.equal(result.decisao, 'toxica');
  assert.equal(result.motivo, 'ride_decision.motivos.toxica_deslocamento');
});

test('ride decision marks ideal when profit is well above goal', () => {
  const result = RideDecisionService.analisar({
    valorOferta: 60,
    tempoTotalMinutos: 30,
    kmAteEmbarque: 1,
    kmViagem: 8,
    custoKm: 1,
    custoMinuto: 0.2,
    metaLucroMinuto: 0.6,
  });

  assert.equal(result.decisao, 'ideal');
});
