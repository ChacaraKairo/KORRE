import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MaintenanceCostResolver } from '../modules/indicesKorre/realSources/MaintenanceCostResolver';

describe('MaintenanceCostResolver', () => {
  it('prioriza historico real sobre valor previsto', async () => {
    const sugestoes =
      await MaintenanceCostResolver.resolverSugestoes(1, {
        getAllAsync: async <T,>(
          query: string,
        ): Promise<T[]> => {
          if (query.includes('FROM itens_manutencao')) {
            return [
              {
                id: 10,
                nome: 'Pneus',
                intervalo_km: 42000,
                valor_previsto: 1000,
              },
            ] as T[];
          }
          return [
            {
              item_id: 10,
              valor: 1200,
              km_servico: 40000,
            },
          ] as T[];
        },
      } as any);

    const valorPneu = sugestoes.find(
      (s) => s.campo === 'valor_jogo_pneus',
    );
    assert.equal(valorPneu?.valor, 1200);
    assert.equal(valorPneu?.fonte, 'historico_oficina');
  });

  it('usa valor previsto quando nao ha historico real', async () => {
    const sugestoes =
      await MaintenanceCostResolver.resolverSugestoes(1, {
        getAllAsync: async <T,>(
          query: string,
        ): Promise<T[]> => {
          if (query.includes('FROM itens_manutencao')) {
            return [
              {
                id: 11,
                nome: 'Freios',
                intervalo_km: 30000,
                valor_previsto: 650,
              },
            ] as T[];
          }
          return [] as T[];
        },
      } as any);

    const valorFreio = sugestoes.find(
      (s) => s.campo === 'valor_manutencao_freios',
    );
    assert.equal(valorFreio?.valor, 650);
    assert.equal(valorFreio?.fonte, 'pre_cadastro');
  });
});
