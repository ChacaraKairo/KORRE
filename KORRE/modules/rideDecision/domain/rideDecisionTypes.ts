export type RideDecision =
  | 'ideal'
  | 'aceitavel'
  | 'fraca'
  | 'toxica'
  | 'prejuizo';

export interface RideOfferInput {
  valorOferecido: number;
  distanciaAteEmbarqueKm: number;
  distanciaViagemKm: number;
  tempoTotalMinutos: number;
  custoKm: number;
  custoMinuto: number;
  metaMinuto: number;
  margemSegurancaPercentual?: number;
}

export interface RideDecisionResult {
  distanciaTotalKm: number;
  custoDistancia: number;
  custoTempo: number;
  custoTotal: number;
  lucroLiquido: number;
  lucroPorHora: number;
  lucroPorMinuto: number;
  decisao: RideDecision;
  mensagem: string;
  motivo: string;
}

