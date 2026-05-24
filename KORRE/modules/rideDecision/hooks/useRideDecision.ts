import { useEffect, useState } from 'react';
import db from '../../../database/DatabaseInit';
import type { Veiculo } from '../../../types/database';
import {
  RideAnalysisRecord,
  RideAnalysisRepository,
} from '../data/RideAnalysisRepository';
import { RideDecisionService } from '../domain/rideDecisionService';
import type { RideDecisionResult } from '../domain/types';

const parseNumber = (value: string) => {
  const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function useRideDecision() {
  const [veiculoAtivo, setVeiculoAtivo] =
    useState<Veiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [valorOferta, setValorOferta] = useState('');
  const [tempoTotal, setTempoTotal] = useState('');
  const [kmEmbarque, setKmEmbarque] = useState('');
  const [kmViagem, setKmViagem] = useState('');
  const [resultado, setResultado] =
    useState<RideDecisionResult | null>(null);
  const [historico, setHistorico] = useState<RideAnalysisRecord[]>(
    [],
  );
  const [salvando, setSalvando] = useState(false);
  const [analiseSalva, setAnaliseSalva] = useState(false);

  useEffect(() => {
    async function carregarVeiculoAtivo() {
      try {
        const veiculo = await db.getFirstAsync<Veiculo>(
          `SELECT id, tipo, marca, modelo, ano, motor, placa, km_atual, ativo, id_user,
                  custo_km_calculado, custo_minuto_calculado, meta_ganho_minuto_calculado
           FROM veiculos
           WHERE ativo = 1
           LIMIT 1`,
        );
        setVeiculoAtivo(veiculo ?? null);
      } finally {
        setLoading(false);
      }
    }

    void carregarVeiculoAtivo();
  }, []);

  const carregarHistorico = async () => {
    setHistorico(await RideAnalysisRepository.listarRecentes());
  };

  useEffect(() => {
    void carregarHistorico();
  }, []);

  const indicesConfigurados = Boolean(
    veiculoAtivo?.custo_km_calculado &&
      veiculoAtivo?.custo_minuto_calculado &&
      veiculoAtivo?.meta_ganho_minuto_calculado,
  );

  const analisar = () => {
    if (!veiculoAtivo || !indicesConfigurados) {
      setResultado(null);
      return;
    }

    const result = RideDecisionService.analisar({
      valorOferta: parseNumber(valorOferta),
      tempoTotalMinutos: parseNumber(tempoTotal),
      kmAteEmbarque: parseNumber(kmEmbarque),
      kmViagem: parseNumber(kmViagem),
      custoKm: Number(veiculoAtivo.custo_km_calculado ?? 0),
      custoMinuto: Number(veiculoAtivo.custo_minuto_calculado ?? 0),
      metaLucroMinuto: Number(
        veiculoAtivo.meta_ganho_minuto_calculado ?? 0,
      ),
    });

    setResultado(result);
    setAnaliseSalva(false);
  };

  const salvarAnalise = async () => {
    if (!resultado) return;

    setSalvando(true);
    try {
      await RideAnalysisRepository.salvar({
        veiculoId: veiculoAtivo?.id ?? null,
        valorOferta: parseNumber(valorOferta),
        tempoTotalMinutos: parseNumber(tempoTotal),
        kmAteEmbarque: parseNumber(kmEmbarque),
        kmViagem: parseNumber(kmViagem),
        resultado,
      });
      setAnaliseSalva(true);
      await carregarHistorico();
    } finally {
      setSalvando(false);
    }
  };

  return {
    analisar,
    analiseSalva,
    historico,
    indicesConfigurados,
    kmEmbarque,
    kmViagem,
    loading,
    resultado,
    salvando,
    salvarAnalise,
    setKmEmbarque,
    setKmViagem,
    setTempoTotal,
    setValorOferta,
    tempoTotal,
    valorOferta,
    veiculoAtivo,
  };
}
