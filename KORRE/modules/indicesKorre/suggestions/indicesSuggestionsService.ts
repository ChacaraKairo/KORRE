import type { FormularioViabilidade } from '../domain/types';
import { isCampoVazio } from './applySuggestionsToForm';
import {
  getVehicleUsageProfile,
  VEHICLE_USAGE_PROFILES,
} from './vehicleUsageProfiles';
import { getVehicleDefaultCosts } from './vehicleDefaultCosts';
import type {
  FonteSugestao,
  PerfilUsoKorre,
  ResultadoSugestoes,
  SugestaoCampo,
  SugestoesIndicesInput,
} from './suggestionTypes';

const PROFILE_EXPLANATION =
  'Estimativa baseada no perfil de uso escolhido. Revise antes de salvar.';

const VEHICLE_EXPLANATION =
  'Estimativa conservadora baseada no tipo de veiculo. Use como ponto de partida.';

/**
 * Executa a função de build suggestions.
 */
function buildSuggestions(
  form: Partial<FormularioViabilidade>,
  valores: Partial<FormularioViabilidade>,
  fonte: FonteSugestao,
  explicacao: string,
): SugestaoCampo[] {
  return Object.entries(valores).map(([campo, valor]) => ({
    campo: campo as keyof FormularioViabilidade,
    valor: valor as number | string,
    fonte,
    confianca: fonte === 'padrao_tipo_veiculo' ? 'baixa' : 'media',
    explicacao,
    aplicadoAutomaticamente: isCampoVazio(
      form[campo as keyof FormularioViabilidade],
    ),
  }));
}

export class IndicesSuggestionsService {
  static perfisDisponiveis = VEHICLE_USAGE_PROFILES;

  static gerarSugestoes(
    input: SugestoesIndicesInput,
  ): ResultadoSugestoes {
    const perfilUso: PerfilUsoKorre =
      input.perfilUso ?? 'uso_medio';
    const perfil = getVehicleUsageProfile(perfilUso);
    const custosPadrao = getVehicleDefaultCosts(
      input.tipoVeiculo,
    );

    const sugestoesPerfil = buildSuggestions(
      input.form,
      perfil.valores,
      'estimativa_korre',
      PROFILE_EXPLANATION,
    );
    const sugestoesVeiculo = buildSuggestions(
      input.form,
      custosPadrao.valores,
      'padrao_tipo_veiculo',
      VEHICLE_EXPLANATION,
    );

    return {
      perfilUso,
      sugestoes: [...sugestoesPerfil, ...sugestoesVeiculo],
    };
  }
}

