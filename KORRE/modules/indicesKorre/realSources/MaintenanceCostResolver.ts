import type { FormularioViabilidade } from '../domain/types';
import type { SugestaoCampo } from '../suggestions';

type DbClient = {
  getAllAsync: <T>(
    query: string,
    params?: (string | number)[],
  ) => Promise<T[]>;
};

interface MaintenanceRow {
  id: number;
  nome: string;
  intervalo_km: number | null;
  valor_previsto: number | null;
}

interface HistoricoRow {
  item_id: number;
  valor: number | null;
  km_servico: number | null;
}

const FIELD_MAP: Array<{
  matcher: RegExp;
  campos: Array<keyof FormularioViabilidade>;
}> = [
  {
    matcher: /oleo|óleo|filtro/i,
    campos: ['valor_oleo_filtros', 'intervalo_oleo_filtros_km'],
  },
  {
    matcher: /pneu/i,
    campos: ['valor_jogo_pneus', 'durabilidade_pneus_km'],
  },
  {
    matcher: /freio/i,
    campos: ['valor_manutencao_freios', 'intervalo_freios_km'],
  },
  {
    matcher: /transmiss|correia|corrente|embreagem/i,
    campos: ['valor_kit_transmissao', 'durabilidade_transmissao_km'],
  },
  {
    matcher: /limpeza|higieni/i,
    campos: ['limpeza_higienizacao_mensal'],
  },
  {
    matcher: /imprevist|extraordin/i,
    campos: ['manutencao_imprevista_mensal'],
  },
];

function toNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function pushSuggestion(
  target: SugestaoCampo[],
  usedFields: Set<keyof FormularioViabilidade>,
  campo: keyof FormularioViabilidade,
  valor: number | null,
  fonte: 'historico_oficina' | 'pre_cadastro',
  explicacao: string,
) {
  if (!valor || usedFields.has(campo)) {
    return;
  }

  target.push({
    campo,
    valor,
    fonte,
    confianca: fonte === 'historico_oficina' ? 'alta' : 'media',
    explicacao,
    aplicadoAutomaticamente: false,
  });
  usedFields.add(campo);
}

export const MaintenanceCostResolver = {
  async resolverSugestoes(
    veiculoId: number,
    database?: DbClient,
  ): Promise<SugestaoCampo[]> {
    const dbClient =
      database ??
      (await import('../../../database/DatabaseInit')).default;
    const itens = await dbClient.getAllAsync<MaintenanceRow>(
      `SELECT id, nome, intervalo_km, valor_previsto
       FROM itens_manutencao
       WHERE veiculo_id = ? AND COALESCE(computar_no_custo, 1) = 1`,
      [veiculoId],
    );

    if (!itens.length) {
      return [];
    }

    const historicos =
      await dbClient.getAllAsync<HistoricoRow>(
        `SELECT h.item_id, h.valor, h.km_servico
         FROM historico_manutencao h
         WHERE h.veiculo_id = ?
         ORDER BY h.data_servico DESC, h.id DESC`,
        [veiculoId],
      );

    const historicoByItem = new Map<number, HistoricoRow[]>();
    for (const row of historicos) {
      const list = historicoByItem.get(row.item_id) ?? [];
      list.push(row);
      historicoByItem.set(row.item_id, list);
    }

    const sugestoes: SugestaoCampo[] = [];
    const usedFields = new Set<keyof FormularioViabilidade>();

    for (const item of itens) {
      const mapping = FIELD_MAP.find((rule) =>
        rule.matcher.test(item.nome),
      );
      if (!mapping) {
        continue;
      }

      const historico = historicoByItem.get(item.id) ?? [];
      const historicoValor = toNumber(historico[0]?.valor);
      const previstoValor = toNumber(item.valor_previsto);
      const intervalo = toNumber(item.intervalo_km);
      const origem = historicoValor
        ? 'historico_oficina'
        : previstoValor
          ? 'pre_cadastro'
          : null;

      if (!origem) {
        continue;
      }

      const explicacao =
        origem === 'historico_oficina'
          ? 'Baseado na ultima manutencao registrada na Oficina.'
          : 'Valor planejado na Oficina, ainda sem manutencao real registrada.';

      for (const campo of mapping.campos) {
        const isIntervalo =
          campo.includes('intervalo') || campo.includes('durabilidade');
        const valor = isIntervalo
          ? intervalo
          : historicoValor ?? previstoValor;
        pushSuggestion(
          sugestoes,
          usedFields,
          campo,
          valor,
          origem,
          explicacao,
        );
      }
    }

    return sugestoes;
  },
};
