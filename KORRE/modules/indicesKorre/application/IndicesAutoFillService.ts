import type { FormularioViabilidade } from '../domain/types';
import {
  IndicesSuggestionsService,
  type SugestaoCampo,
} from '../suggestions';
import { isCampoVazio } from '../suggestions/applySuggestionsToForm';
import { MaintenanceCostResolver } from '../realSources/MaintenanceCostResolver';
import { FinancialCostResolver } from '../realSources/FinancialCostResolver';
import { FuelAuditSuggestionService } from '../../fuel/application/FuelAuditSuggestionService';

export interface ResultadoAutoFillIndices {
  form: Partial<FormularioViabilidade>;
  sugestoesAplicadas: SugestaoCampo[];
  sugestoesIgnoradas: SugestaoCampo[];
  sugestoesRevisao: SugestaoCampo[];
  resumo: {
    historicoOficina: number;
    historicoFinanceiro: number;
    preCadastro: number;
    perfilUso: number;
    padraoKorre: number;
  };
}

function isDifferent(current: unknown, incoming: unknown): boolean {
  const n1 = Number(current);
  const n2 = Number(incoming);
  if (Number.isFinite(n1) && Number.isFinite(n2)) {
    return Math.abs(n1 - n2) > 0.01;
  }
  return String(current) !== String(incoming);
}

export const IndicesAutoFillService = {
  async preencherInteligente(input: {
    veiculoId: number;
    form: Partial<FormularioViabilidade>;
    perfilUso?: 'uso_leve' | 'uso_medio' | 'uso_intenso' | 'uso_profissional_pesado';
    tipoVeiculo?: string | null;
  }): Promise<ResultadoAutoFillIndices> {
    const base = IndicesSuggestionsService.gerarSugestoes({
      form: input.form,
      perfilUso: input.perfilUso,
      tipoVeiculo: input.tipoVeiculo,
    }).sugestoes;

    const [oficina, financeiro, abastecimento] = await Promise.all([
      MaintenanceCostResolver.resolverSugestoes(input.veiculoId),
      FinancialCostResolver.resolverSugestoes({
        veiculoId: input.veiculoId,
      }),
      FuelAuditSuggestionService.gerarSugestoes(input.veiculoId),
    ]);

    const prioritized = [
      ...oficina.filter((s) => s.fonte === 'historico_oficina'),
      ...abastecimento,
      ...financeiro,
      ...oficina.filter((s) => s.fonte === 'pre_cadastro'),
      ...base.filter((s) => s.fonte === 'estimativa_korre'),
      ...base.filter((s) => s.fonte === 'padrao_tipo_veiculo'),
    ];

    const nextForm: Partial<FormularioViabilidade> = {
      ...input.form,
    };
    const aplicadas: SugestaoCampo[] = [];
    const ignoradas: SugestaoCampo[] = [];
    const revisao: SugestaoCampo[] = [];
    const seen = new Set<keyof FormularioViabilidade>();

    for (const sugestao of prioritized) {
      if (seen.has(sugestao.campo)) {
        continue;
      }
      seen.add(sugestao.campo);

      const atual = nextForm[sugestao.campo];
      if (isCampoVazio(atual)) {
        nextForm[sugestao.campo] = sugestao.valor as never;
        aplicadas.push({
          ...sugestao,
          aplicadoAutomaticamente: true,
        });
        continue;
      }

      ignoradas.push({
        ...sugestao,
        aplicadoAutomaticamente: false,
      });

      if (isDifferent(atual, sugestao.valor)) {
        revisao.push({
          ...sugestao,
          aplicadoAutomaticamente: false,
        });
      }
    }

    return {
      form: nextForm,
      sugestoesAplicadas: aplicadas,
      sugestoesIgnoradas: ignoradas,
      sugestoesRevisao: revisao,
      resumo: {
        historicoOficina: aplicadas.filter((s) => s.fonte === 'historico_oficina').length,
        historicoFinanceiro: aplicadas.filter((s) => s.fonte === 'historico_financeiro').length,
        preCadastro: aplicadas.filter((s) => s.fonte === 'pre_cadastro').length,
        perfilUso: aplicadas.filter((s) => s.fonte === 'estimativa_korre').length,
        padraoKorre: aplicadas.filter((s) => s.fonte === 'padrao_tipo_veiculo').length,
      },
    };
  },
};
