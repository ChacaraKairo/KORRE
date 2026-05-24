import type { FormularioViabilidade } from '../domain/types';
import type { SugestaoCampo } from '../suggestions';

type DbClient = {
  getAllAsync: <T>(
    query: string,
    params?: (string | number)[],
  ) => Promise<T[]>;
  getFirstAsync: <T>(
    query: string,
    params?: (string | number)[],
  ) => Promise<T | null>;
};

interface FinanceRow {
  valor: number;
  data_transacao: string;
  categoria: string | null;
  veiculo_id: number | null;
}

interface VehicleCountRow {
  total: number;
}

const CATEGORY_MAP: Array<{
  matcher: RegExp;
  campo: keyof FormularioViabilidade;
}> = [
  { matcher: /combust|energia/i, campo: 'preco_energia_unidade' },
  {
    matcher: /manuten/i,
    campo: 'manutencao_imprevista_mensal',
  },
  { matcher: /alimenta/i, campo: 'alimentacao_diaria' },
  { matcher: /internet|dados/i, campo: 'plano_dados_mensal' },
  {
    matcher: /seguro/i,
    campo: 'seguro_comercial_anual',
  },
  {
    matcher: /limpeza|higieni/i,
    campo: 'limpeza_higienizacao_mensal',
  },
];

/**
 * Executa a função de add days.
 */
function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Executa a função de to date string.
 */
function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Executa a função de confidence for count.
 */
function confidenceForCount(count: number): 'alta' | 'media' | 'baixa' {
  if (count >= 8) return 'alta';
  if (count >= 4) return 'media';
  return 'baixa';
}

export const FinancialCostResolver = {
  async resolverSugestoes(params: {
    veiculoId: number;
    database?: DbClient;
  }): Promise<SugestaoCampo[]> {
    const database =
      params.database ??
      (await import('../../../database/DatabaseInit')).default;
    const hoje = new Date();
    const inicio180 = toDateString(addDays(hoje, -180));

    const countVeiculos =
      await database.getFirstAsync<VehicleCountRow>(
        'SELECT COUNT(*) as total FROM veiculos',
      );
    const hasManyVehicles = Number(countVeiculos?.total ?? 0) > 1;

    const rows = await database.getAllAsync<FinanceRow>(
      `SELECT t.valor, t.data_transacao, t.veiculo_id, c.nome as categoria
       FROM transacoes_financeiras t
       LEFT JOIN categorias_financeiras c ON c.id = t.categoria_id
       WHERE t.tipo = 'despesa'
         AND date(t.data_transacao) >= date(?)
         AND (
           t.veiculo_id = ?
           OR (? = 0 AND t.veiculo_id IS NULL)
         )`,
      [inicio180, params.veiculoId, hasManyVehicles ? 1 : 0],
    );

    const suggestions: SugestaoCampo[] = [];
    const used = new Set<keyof FormularioViabilidade>();

    for (const map of CATEGORY_MAP) {
      const byCategory = rows.filter(
        (row) =>
          row.categoria &&
          map.matcher.test(row.categoria) &&
          (!hasManyVehicles || row.veiculo_id === params.veiculoId),
      );

      if (!byCategory.length || used.has(map.campo)) {
        continue;
      }

      const buckets = [30, 90, 180]
        .map((days) => {
          const minDate = toDateString(addDays(hoje, -days));
          const filtered = byCategory.filter(
            (row) =>
              toDateString(new Date(row.data_transacao)) >=
              minDate,
          );
          return { days, filtered };
        })
        .filter((bucket) => bucket.filtered.length > 0);

      const selected =
        buckets.find((bucket) => bucket.days === 30 && bucket.filtered.length >= 3) ??
        buckets.find((bucket) => bucket.days === 90 && bucket.filtered.length >= 3) ??
        buckets.find((bucket) => bucket.days === 180 && bucket.filtered.length >= 3);

      if (!selected) {
        continue;
      }

      const media =
        selected.filtered.reduce(
          (sum, row) => sum + Number(row.valor || 0),
          0,
        ) / selected.filtered.length;
      const valor = Number(media.toFixed(2));

      suggestions.push({
        campo: map.campo,
        valor,
        fonte: 'historico_financeiro',
        confianca: confidenceForCount(selected.filtered.length),
        explicacao: `Baseado na media de despesas dos ultimos ${selected.days} dias.`,
        aplicadoAutomaticamente: false,
      });
      used.add(map.campo);
    }

    return suggestions;
  },
};
