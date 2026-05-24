import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { IndicesAutoFillService } from '../modules/indicesKorre/application/IndicesAutoFillService';
import { MaintenanceCostResolver } from '../modules/indicesKorre/realSources/MaintenanceCostResolver';
import { FinancialCostResolver } from '../modules/indicesKorre/realSources/FinancialCostResolver';

describe('IndicesAutoFillService', () => {
  it('nao sobrescreve valor manual e cria sugestao de revisao', async () => {
    const oldMaintenance = MaintenanceCostResolver.resolverSugestoes;
    const oldFinancial = FinancialCostResolver.resolverSugestoes;
    try {
      MaintenanceCostResolver.resolverSugestoes = async () => [
        {
          campo: 'valor_jogo_pneus',
          valor: 1200,
          fonte: 'historico_oficina',
          confianca: 'alta',
          explicacao: 'x',
          aplicadoAutomaticamente: false,
        },
      ];
      FinancialCostResolver.resolverSugestoes = async () => [];

      const result =
        await IndicesAutoFillService.preencherInteligente({
          veiculoId: 1,
          form: { valor_jogo_pneus: 900 },
          perfilUso: 'uso_medio',
          tipoVeiculo: 'moto',
        });

      assert.equal(result.form.valor_jogo_pneus, 900);
      assert.ok(
        result.sugestoesRevisao.some(
          (s) => s.campo === 'valor_jogo_pneus',
        ),
      );
    } finally {
      MaintenanceCostResolver.resolverSugestoes = oldMaintenance;
      FinancialCostResolver.resolverSugestoes = oldFinancial;
    }
  });

  it('mantem perfil e padrao como fallback', async () => {
    const oldMaintenance = MaintenanceCostResolver.resolverSugestoes;
    const oldFinancial = FinancialCostResolver.resolverSugestoes;
    try {
      MaintenanceCostResolver.resolverSugestoes = async () => [];
      FinancialCostResolver.resolverSugestoes = async () => [];

      const result =
        await IndicesAutoFillService.preencherInteligente({
          veiculoId: 1,
          form: {},
          perfilUso: 'uso_intenso',
          tipoVeiculo: 'moto',
        });

      assert.ok(
        result.sugestoesAplicadas.some(
          (s) => s.fonte === 'estimativa_korre',
        ),
      );
      assert.ok(
        result.sugestoesAplicadas.some(
          (s) => s.fonte === 'padrao_tipo_veiculo',
        ),
      );
    } finally {
      MaintenanceCostResolver.resolverSugestoes = oldMaintenance;
      FinancialCostResolver.resolverSugestoes = oldFinancial;
    }
  });
});
