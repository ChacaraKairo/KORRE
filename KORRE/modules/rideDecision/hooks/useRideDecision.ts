import { useEffect, useState } from 'react';
import db from '../../../database/DatabaseInit';
import type { Veiculo } from '../../../types/database';
import {
  RideAnalysisRecord,
  RideAnalysisRepository,
} from '../data/RideAnalysisRepository';
import { RideDecisionService } from '../domain/rideDecisionService';
import type { RideDecisionResult } from '../domain/types';
import { criarNotificacao } from '../../../notifications/NotificationService';
import { AppRoutes } from '../../../constants/routes';

const parseNumber = (value: string) => {
  const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isBlank = (value: string) => value.trim().length === 0;

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
  const [erroValidacao, setErroValidacao] = useState<string | null>(
    null,
  );

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
    setErroValidacao(null);

    if (!veiculoAtivo || !indicesConfigurados) {
      setResultado(null);
      return;
    }

    const valorOfertaNumber = parseNumber(valorOferta);
    const tempoTotalNumber = parseNumber(tempoTotal);
    const kmEmbarqueNumber = parseNumber(kmEmbarque);
    const kmViagemNumber = parseNumber(kmViagem);

    if (
      isBlank(valorOferta) ||
      isBlank(tempoTotal) ||
      isBlank(kmEmbarque) ||
      isBlank(kmViagem)
    ) {
      setResultado(null);
      setErroValidacao('ride_decision.erros.campos_obrigatorios');
      return;
    }

    if (valorOfertaNumber <= 0) {
      setResultado(null);
      setErroValidacao('ride_decision.erros.valor_oferta');
      return;
    }

    if (tempoTotalNumber <= 0) {
      setResultado(null);
      setErroValidacao('ride_decision.erros.tempo_total');
      return;
    }

    if (kmEmbarqueNumber < 0 || kmViagemNumber <= 0) {
      setResultado(null);
      setErroValidacao('ride_decision.erros.distancia');
      return;
    }

    const result = RideDecisionService.analisar({
      valorOferta: valorOfertaNumber,
      tempoTotalMinutos: tempoTotalNumber,
      kmAteEmbarque: kmEmbarqueNumber,
      kmViagem: kmViagemNumber,
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
      const decisao = String(resultado.decisao).toLowerCase();
      await criarNotificacao({
        titulo:
          decisao === 'prejuizo'
            ? 'Corrida em prejuizo'
            : decisao === 'ideal'
              ? 'Corrida ideal'
              : 'Analise de corrida salva',
        mensagem:
          decisao === 'prejuizo'
            ? 'A corrida analisada ficou em prejuizo. Revise antes de aceitar novas ofertas.'
            : 'Analise registrada com sucesso.',
        tipo: 'corrida',
        prioridade: decisao === 'prejuizo' ? 'alta' : 'baixa',
        destino: String(AppRoutes.analisarCorrida),
        canal: 'historico',
        grupoPreferencia: 'corrida',
        dedupKey: `corrida_${decisao}:${Date.now()}`,
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
    erroValidacao,
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
