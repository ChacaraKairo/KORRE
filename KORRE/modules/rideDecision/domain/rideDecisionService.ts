import type {
  RideDecision,
  RideDecisionResult,
  RideOfferInput,
} from './rideDecisionTypes';

function toSafeNumber(value: number): number {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
}

function getDecision(
  lucroLiquido: number,
  lucroPorMinuto: number,
  metaMinuto: number,
): RideDecision {
  if (lucroLiquido <= 0) return 'prejuizo';
  if (metaMinuto <= 0) return 'aceitavel';

  if (lucroPorMinuto >= metaMinuto * 1.25) {
    return 'ideal';
  }

  if (lucroPorMinuto >= metaMinuto) {
    return 'aceitavel';
  }

  if (lucroPorMinuto >= metaMinuto * 0.65) {
    return 'fraca';
  }

  return 'toxica';
}

const MESSAGE_BY_DECISION: Record<RideDecision, string> = {
  ideal: 'rideAnalyzer.result.message.ideal',
  aceitavel: 'rideAnalyzer.result.message.aceitavel',
  fraca: 'rideAnalyzer.result.message.fraca',
  toxica: 'rideAnalyzer.result.message.toxica',
  prejuizo: 'rideAnalyzer.result.message.prejuizo',
};

const REASON_BY_DECISION: Record<RideDecision, string> = {
  ideal: 'rideAnalyzer.result.reason.ideal',
  aceitavel: 'rideAnalyzer.result.reason.aceitavel',
  fraca: 'rideAnalyzer.result.reason.fraca',
  toxica: 'rideAnalyzer.result.reason.toxica',
  prejuizo: 'rideAnalyzer.result.reason.prejuizo',
};

export class RideDecisionService {
  static analyze(input: RideOfferInput): RideDecisionResult {
    const valorOferecido = toSafeNumber(input.valorOferecido);
    const distanciaAteEmbarqueKm = toSafeNumber(
      input.distanciaAteEmbarqueKm,
    );
    const distanciaViagemKm = toSafeNumber(
      input.distanciaViagemKm,
    );
    const tempoTotalMinutos = toSafeNumber(
      input.tempoTotalMinutos,
    );
    const custoKm = toSafeNumber(input.custoKm);
    const custoMinuto = toSafeNumber(input.custoMinuto);
    const margem =
      toSafeNumber(input.margemSegurancaPercentual ?? 0) / 100;
    const metaMinuto =
      toSafeNumber(input.metaMinuto) * (1 + margem);

    const distanciaTotalKm =
      distanciaAteEmbarqueKm + distanciaViagemKm;
    const custoDistancia = distanciaTotalKm * custoKm;
    const custoTempo = tempoTotalMinutos * custoMinuto;
    const custoTotal = custoDistancia + custoTempo;
    const lucroLiquido = valorOferecido - custoTotal;
    const lucroPorMinuto =
      tempoTotalMinutos > 0
        ? lucroLiquido / tempoTotalMinutos
        : 0;
    const lucroPorHora = lucroPorMinuto * 60;
    const decisao = getDecision(
      lucroLiquido,
      lucroPorMinuto,
      metaMinuto,
    );

    return {
      distanciaTotalKm,
      custoDistancia,
      custoTempo,
      custoTotal,
      lucroLiquido,
      lucroPorHora,
      lucroPorMinuto,
      decisao,
      mensagem: MESSAGE_BY_DECISION[decisao],
      motivo: REASON_BY_DECISION[decisao],
    };
  }
}

