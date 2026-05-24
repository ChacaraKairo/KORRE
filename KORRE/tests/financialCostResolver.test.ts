import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FinancialCostResolver } from '../modules/indicesKorre/realSources/FinancialCostResolver';

function dateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

describe('FinancialCostResolver', () => {
  it('gera media com base nos ultimos 90 dias quando 30 nao e suficiente', async () => {
    const sugestoes =
      await FinancialCostResolver.resolverSugestoes({
        veiculoId: 1,
        database: {
          getFirstAsync: async () => ({ total: 1 }),
          getAllAsync: async () =>
            [
              {
                valor: 300,
                data_transacao: dateDaysAgo(50),
                categoria: 'Limpeza',
                veiculo_id: 1,
              },
              {
                valor: 150,
                data_transacao: dateDaysAgo(60),
                categoria: 'Limpeza',
                veiculo_id: 1,
              },
              {
                valor: 150,
                data_transacao: dateDaysAgo(70),
                categoria: 'Limpeza',
                veiculo_id: 1,
              },
            ],
        } as any,
      });

    const limpeza = sugestoes.find(
      (s) => s.campo === 'limpeza_higienizacao_mensal',
    );
    assert.equal(limpeza?.valor, 200);
    assert.equal(limpeza?.fonte, 'historico_financeiro');
  });
});
