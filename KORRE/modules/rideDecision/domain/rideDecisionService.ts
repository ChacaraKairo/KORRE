import type {
  RideDecisionInput,
  RideDecisionResult,
  RideDecisionStatus,
} from './types';

/**
 * Executa a função de round money.
 */
const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const decide = (
  lucroLiquido: number,
  lucroPorMinuto: number,
  metaLucroMinuto: number,
  kmAteEmbarque: number,
  kmViagem: number,
): { decisao: RideDecisionStatus; motivo: string } => {
  if (lucroLiquido <= 0) {
    return {
      decisao: 'prejuizo',
      motivo: 'ride_decision.motivos.prejuizo',
    };
  }

  const metaSegura = metaLucroMinuto > 0 ? metaLucroMinuto : 0.01;
  const ratio = lucroPorMinuto / metaSegura;
  const deslocamentoPesado =
    kmAteEmbarque > 3 && kmAteEmbarque >= kmViagem * 0.6;

  if (ratio >= 1.5) {
    return {
      decisao: 'ideal',
      motivo: 'ride_decision.motivos.ideal',
    };
  }

  if (ratio >= 1) {
    return {
      decisao: 'aceitavel',
      motivo: 'ride_decision.motivos.aceitavel',
    };
  }

  if (ratio < 0.5 || deslocamentoPesado) {
    return {
      decisao: 'toxica',
      motivo: deslocamentoPesado
        ? 'ride_decision.motivos.toxica_deslocamento'
        : 'ride_decision.motivos.toxica_meta',
    };
  }

  return {
    decisao: 'fraca',
    motivo: 'ride_decision.motivos.fraca',
  };
};

export class RideDecisionService {
  static analisar(input: RideDecisionInput): RideDecisionResult {
    const distanciaTotal = input.kmAteEmbarque + input.kmViagem;
    const custoDistancia = distanciaTotal * input.custoKm;
    const custoTempo = input.tempoTotalMinutos * input.custoMinuto;
    const custoTotal = custoDistancia + custoTempo;
    const lucroLiquido = input.valorOferta - custoTotal;
    const lucroPorMinuto =
      input.tempoTotalMinutos > 0
        ? lucroLiquido / input.tempoTotalMinutos
        : 0;
    const lucroPorHora = lucroPorMinuto * 60;
    const decisao = decide(
      lucroLiquido,
      lucroPorMinuto,
      input.metaLucroMinuto,
      input.kmAteEmbarque,
      input.kmViagem,
    );

    return {
      decisao: decisao.decisao,
      distanciaTotal: roundMoney(distanciaTotal),
      custoDistancia: roundMoney(custoDistancia),
      custoTempo: roundMoney(custoTempo),
      custoTotal: roundMoney(custoTotal),
      lucroLiquido: roundMoney(lucroLiquido),
      lucroPorHora: roundMoney(lucroPorHora),
      lucroPorMinuto: roundMoney(lucroPorMinuto),
      motivo: decisao.motivo,
    };
  }
}
