import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { possuiCamposSensiveis } from '../modules/dataInsights/VehicleDataAggregationService';

describe('VehicleDataAggregationService', () => {
  it('detecta campos sensiveis proibidos', () => {
    assert.equal(possuiCamposSensiveis({ email: 'x@y.com' }), true);
    assert.equal(possuiCamposSensiveis({ cpf: '000' }), true);
    assert.equal(possuiCamposSensiveis({ placa: 'AAA0000' }), true);
  });

  it('nao marca payload agregado sem campos proibidos', () => {
    assert.equal(
      possuiCamposSensiveis({
        tipo_veiculo: 'moto',
        marca: 'Honda',
        modelo: 'CG',
        consumo_medio_km_l: 35,
      }),
      false,
    );
  });
});
