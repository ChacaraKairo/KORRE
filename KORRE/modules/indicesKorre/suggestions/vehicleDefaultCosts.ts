import type { FormularioViabilidade } from '../domain/types';

export type TipoVeiculoKorre =
  | 'moto'
  | 'carro'
  | 'caminhao'
  | 'van'
  | 'bicicleta'
  | 'carro_eletrico';

export interface VehicleDefaultCostProfile {
  tipoVeiculo: TipoVeiculoKorre | 'padrao';
  valores: Partial<FormularioViabilidade>;
}

const COMMON_DEFAULTS: Partial<FormularioViabilidade> = {
  plano_dados_mensal: 50,
  valor_smartphone: 1800,
  vida_util_smartphone_meses: 18,
  percentual_dead_miles: 15,
  tempo_espera_medio_minutos: 5,
  fundo_emergencia_percentual: 10,
};

export const VEHICLE_DEFAULT_COSTS: Record<
  TipoVeiculoKorre | 'padrao',
  VehicleDefaultCostProfile
> = {
  moto: {
    tipoVeiculo: 'moto',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 35,
      preco_energia_unidade: 5.8,
      valor_oleo_filtros: 70,
      intervalo_oleo_filtros_km: 3000,
      valor_jogo_pneus: 420,
      durabilidade_pneus_km: 16000,
      valor_manutencao_freios: 160,
      intervalo_freios_km: 12000,
      valor_kit_transmissao: 220,
      durabilidade_transmissao_km: 18000,
    },
  },
  carro: {
    tipoVeiculo: 'carro',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 10,
      preco_energia_unidade: 5.8,
      valor_oleo_filtros: 280,
      intervalo_oleo_filtros_km: 10000,
      valor_jogo_pneus: 1600,
      durabilidade_pneus_km: 40000,
      valor_manutencao_freios: 650,
      intervalo_freios_km: 30000,
      valor_kit_transmissao: 0,
      durabilidade_transmissao_km: 0,
    },
  },
  carro_eletrico: {
    tipoVeiculo: 'carro_eletrico',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 6,
      preco_energia_unidade: 0.95,
      valor_oleo_filtros: 0,
      intervalo_oleo_filtros_km: 0,
      valor_jogo_pneus: 2200,
      durabilidade_pneus_km: 35000,
      valor_manutencao_freios: 500,
      intervalo_freios_km: 45000,
      valor_kit_transmissao: 0,
      durabilidade_transmissao_km: 0,
      fundo_depreciacao_bateria_por_km: 0.08,
    },
  },
  van: {
    tipoVeiculo: 'van',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 8,
      preco_energia_unidade: 5.8,
      valor_oleo_filtros: 420,
      intervalo_oleo_filtros_km: 8000,
      valor_jogo_pneus: 2600,
      durabilidade_pneus_km: 45000,
      valor_manutencao_freios: 900,
      intervalo_freios_km: 28000,
      valor_kit_transmissao: 0,
      durabilidade_transmissao_km: 0,
    },
  },
  caminhao: {
    tipoVeiculo: 'caminhao',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 4,
      preco_energia_unidade: 5.8,
      valor_oleo_filtros: 850,
      intervalo_oleo_filtros_km: 10000,
      valor_jogo_pneus: 7200,
      durabilidade_pneus_km: 60000,
      valor_manutencao_freios: 1800,
      intervalo_freios_km: 35000,
      valor_kit_transmissao: 0,
      durabilidade_transmissao_km: 0,
    },
  },
  bicicleta: {
    tipoVeiculo: 'bicicleta',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 1,
      preco_energia_unidade: 0,
      valor_oleo_filtros: 0,
      intervalo_oleo_filtros_km: 0,
      valor_jogo_pneus: 180,
      durabilidade_pneus_km: 5000,
      valor_manutencao_freios: 80,
      intervalo_freios_km: 3000,
      valor_kit_transmissao: 140,
      durabilidade_transmissao_km: 6000,
    },
  },
  padrao: {
    tipoVeiculo: 'padrao',
    valores: {
      ...COMMON_DEFAULTS,
      rendimento_energia_unidade: 10,
      preco_energia_unidade: 5.8,
      valor_oleo_filtros: 250,
      intervalo_oleo_filtros_km: 8000,
      valor_jogo_pneus: 1200,
      durabilidade_pneus_km: 30000,
      valor_manutencao_freios: 500,
      intervalo_freios_km: 25000,
      valor_kit_transmissao: 0,
      durabilidade_transmissao_km: 0,
    },
  },
};

/**
 * Executa a função de get vehicle default costs.
 */
export function getVehicleDefaultCosts(
  tipoVeiculo?: string | null,
): VehicleDefaultCostProfile {
  if (
    tipoVeiculo &&
    Object.prototype.hasOwnProperty.call(
      VEHICLE_DEFAULT_COSTS,
      tipoVeiculo,
    )
  ) {
    return VEHICLE_DEFAULT_COSTS[tipoVeiculo as TipoVeiculoKorre];
  }

  return VEHICLE_DEFAULT_COSTS.padrao;
}

