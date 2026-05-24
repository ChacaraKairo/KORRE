import type { FormularioViabilidade } from '../domain/types';
import type { PerfilUsoKorre } from './suggestionTypes';

export interface VehicleUsageProfile {
  id: PerfilUsoKorre;
  titulo: string;
  descricao: string;
  valores: Partial<FormularioViabilidade>;
}

export const VEHICLE_USAGE_PROFILES: Record<
  PerfilUsoKorre,
  VehicleUsageProfile
> = {
  uso_leve: {
    id: 'uso_leve',
    titulo: 'Uso leve',
    descricao: 'Roda poucos dias por semana e usa o veiculo como renda complementar.',
    valores: {
      dias_trabalhados_semana: 3,
      horas_por_dia: 4,
      km_por_dia: 60,
      alimentacao_diaria: 20,
      limpeza_higienizacao_mensal: 40,
      manutencao_imprevista_mensal: 80,
    },
  },
  uso_medio: {
    id: 'uso_medio',
    titulo: 'Uso medio',
    descricao: 'Trabalha com frequencia, mas sem rotina extrema.',
    valores: {
      dias_trabalhados_semana: 5,
      horas_por_dia: 6,
      km_por_dia: 120,
      alimentacao_diaria: 30,
      limpeza_higienizacao_mensal: 80,
      manutencao_imprevista_mensal: 160,
    },
  },
  uso_intenso: {
    id: 'uso_intenso',
    titulo: 'Uso intenso',
    descricao: 'Usa o veiculo quase todos os dias para ganhar dinheiro.',
    valores: {
      dias_trabalhados_semana: 6,
      horas_por_dia: 8,
      km_por_dia: 200,
      alimentacao_diaria: 45,
      limpeza_higienizacao_mensal: 140,
      manutencao_imprevista_mensal: 280,
    },
  },
  uso_profissional_pesado: {
    id: 'uso_profissional_pesado',
    titulo: 'Uso profissional pesado',
    descricao: 'Depende totalmente do veiculo e trabalha muitas horas por dia.',
    valores: {
      dias_trabalhados_semana: 6,
      horas_por_dia: 10,
      km_por_dia: 280,
      alimentacao_diaria: 60,
      limpeza_higienizacao_mensal: 220,
      manutencao_imprevista_mensal: 420,
    },
  },
};

/**
 * Executa a função de get vehicle usage profile.
 */
export function getVehicleUsageProfile(
  perfilUso: PerfilUsoKorre = 'uso_medio',
): VehicleUsageProfile {
  return VEHICLE_USAGE_PROFILES[perfilUso];
}

