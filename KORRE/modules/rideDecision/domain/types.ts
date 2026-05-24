export type RideDecisionStatus =
  | 'ideal'
  | 'aceitavel'
  | 'fraca'
  | 'toxica'
  | 'prejuizo';

export interface RideDecisionInput {
  valorOferta: number;
  tempoTotalMinutos: number;
  kmAteEmbarque: number;
  kmViagem: number;
  custoKm: number;
  custoMinuto: number;
  metaLucroMinuto: number;
}

export interface RideDecisionResult {
  decisao: RideDecisionStatus;
  distanciaTotal: number;
  custoDistancia: number;
  custoTempo: number;
  custoTotal: number;
  lucroLiquido: number;
  lucroPorHora: number;
  lucroPorMinuto: number;
  motivo: string;
}
