import { useCallback, useEffect, useMemo, useState } from 'react';
import db from '../../../database/DatabaseInit';
import { RideDecisionService } from '../../rideDecision';
import type { RideDecisionResult } from '../../rideDecision';

export interface RideAnalyzerForm {
  valorOferecido: string;
  tempoTotalMinutos: string;
  distanciaAteEmbarqueKm: string;
  distanciaViagemKm: string;
}

interface ActiveRideIndexes {
  veiculoId: number | null;
  custoKm: number;
  custoMinuto: number;
  metaMinuto: number;
}

const EMPTY_FORM: RideAnalyzerForm = {
  valorOferecido: '',
  tempoTotalMinutos: '',
  distanciaAteEmbarqueKm: '',
  distanciaViagemKm: '',
};

function parseDecimal(value: string): number {
  const normalized = String(value)
    .replace(',', '.')
    .replace(/[^0-9.]/g, '');
  const parts = normalized.split('.');
  const safe =
    parts.length > 2
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : normalized;
  const numberValue = Number(safe);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function useRideAnalyzer() {
  const [form, setForm] =
    useState<RideAnalyzerForm>(EMPTY_FORM);
  const [indices, setIndices] =
    useState<ActiveRideIndexes | null>(null);
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] =
    useState<RideDecisionResult | null>(null);

  const carregarIndices = useCallback(async () => {
    setLoading(true);
    try {
      const veiculo = await db.getFirstAsync<any>(
        `SELECT id, custo_km_calculado, custo_minuto_calculado, meta_ganho_minuto_calculado
         FROM veiculos
         WHERE ativo = 1
         LIMIT 1`,
      );

      if (!veiculo) {
        setIndices(null);
        return;
      }

      setIndices({
        veiculoId: Number(veiculo.id) || null,
        custoKm: Number(veiculo.custo_km_calculado) || 0,
        custoMinuto:
          Number(veiculo.custo_minuto_calculado) || 0,
        metaMinuto:
          Number(veiculo.meta_ganho_minuto_calculado) || 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarIndices();
  }, [carregarIndices]);

  const indicesConfigurados = useMemo(() => {
    if (!indices) return false;
    return indices.custoKm > 0 || indices.custoMinuto > 0;
  }, [indices]);

  const handleChange = useCallback(
    (campo: keyof RideAnalyzerForm, valor: string) => {
      setForm((prev) => ({
        ...prev,
        [campo]: valor,
      }));
      setResultado(null);
    },
    [],
  );

  const analisar = useCallback(() => {
    if (!indicesConfigurados || !indices) return;

    const nextResult = RideDecisionService.analyze({
      valorOferecido: parseDecimal(form.valorOferecido),
      tempoTotalMinutos: parseDecimal(
        form.tempoTotalMinutos,
      ),
      distanciaAteEmbarqueKm: parseDecimal(
        form.distanciaAteEmbarqueKm,
      ),
      distanciaViagemKm: parseDecimal(
        form.distanciaViagemKm,
      ),
      custoKm: indices.custoKm,
      custoMinuto: indices.custoMinuto,
      metaMinuto: indices.metaMinuto,
    });

    setResultado(nextResult);
  }, [form, indices, indicesConfigurados]);

  const limpar = useCallback(() => {
    setForm(EMPTY_FORM);
    setResultado(null);
  }, []);

  return {
    form,
    indices,
    loading,
    resultado,
    indicesConfigurados,
    handleChange,
    analisar,
    limpar,
    recarregarIndices: carregarIndices,
  };
}

