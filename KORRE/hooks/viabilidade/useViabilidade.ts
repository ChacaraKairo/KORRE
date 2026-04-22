import { useCallback, useEffect, useState } from 'react';
import db from '../../database/DatabaseInit';
import {
  AvaliacaoCorrida,
  ResultadoViabilidade,
} from '../../type/viabilidadeCorrida'; // Confirme se a pasta é 'types' ou 'type'

export function useViabilidade() {
  const [indices, setIndices] = useState<{
    ikm: number;
    imin: number;
    meta: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR OS ÍNDICES DA BASE DE DADOS
  // Esta função roda silenciosamente em background
  const carregarIndices = useCallback(async () => {
    setLoading(true);
    try {
      // Busca os índices mágicos já consolidados no veículo ativo
      const veiculo = await db.getFirstAsync<any>(
        'SELECT custo_km_calculado, custo_minuto_calculado, meta_ganho_minuto_calculado FROM veiculos WHERE ativo = 1 LIMIT 1',
      );

      if (veiculo) {
        setIndices({
          ikm: Number(veiculo.custo_km_calculado) || 0,
          imin: Number(veiculo.custo_minuto_calculado) || 0,
          meta:
            Number(veiculo.meta_ganho_minuto_calculado) ||
            0,
        });
      }
    } catch (error) {
      console.error(
        '[useViabilidade] Erro ao carregar os Índices MC:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que o Hook é montado
  useEffect(() => {
    carregarIndices();
  }, [carregarIndices]);

  // 2. AVALIADOR DE CORRIDAS EM TEMPO REAL
  // Função chamada no momento em que a corrida "toca" na tela
  const avaliarCorrida = useCallback(
    (
      corrida: AvaliacaoCorrida,
    ): ResultadoViabilidade | null => {
      // Se não tem índices ou estão zerados, o motorista não configurou a auditoria
      if (
        !indices ||
        (indices.ikm === 0 && indices.imin === 0)
      ) {
        return null;
      }

      // Garantia de que os valores são numéricos e seguros
      const tempoTotal =
        Number(corrida.tempo_estimado_minutos) || 0;
      const distanciaTotal =
        Number(corrida.distancia_ate_embarque_km || 0) +
        Number(corrida.distancia_corrida_km || 0);
      const valorOferecido =
        Number(corrida.valor_oferecido_app) || 0;

      // --- A Matemática Real ---
      const custoDistancia = distanciaTotal * indices.ikm;
      const custoTempo = tempoTotal * indices.imin;

      const custoTotalCorrida = custoDistancia + custoTempo;
      const lucroLiquido =
        valorOferecido - custoTotalCorrida;

      // Rentabilidade Horária (Prevenção contra divisão por zero)
      const lucroPorMinuto =
        tempoTotal > 0 ? lucroLiquido / tempoTotal : 0;
      const lucroPorHora = lucroPorMinuto * 60;

      // --- A Tomada de Decisão ---
      // Para valer a pena, não basta ter lucro. Tem que bater a Meta de Pró-Labore!
      const vale_a_pena =
        lucroLiquido > 0 && lucroPorMinuto >= indices.meta;

      // --- Geração de Feedback Visual ---
      let mensagem_analise = '';

      if (lucroLiquido <= 0) {
        mensagem_analise = `🚨 PREJUÍZO! Você está pagando para trabalhar. Seu custo nesta corrida é R$ ${custoTotalCorrida.toFixed(2)}. Recuse.`;
      } else if (!vale_a_pena) {
        mensagem_analise = `⚠️ TÓXICA! Dá lucro de R$ ${lucroLiquido.toFixed(2)}, mas rende apenas R$ ${lucroPorHora.toFixed(2)}/h (Abaixo da sua Meta).`;
      } else {
        mensagem_analise = `✅ IDEAL! Cobre todos os custos e rende R$ ${lucroPorHora.toFixed(2)}/h limpos. Pode aceitar!`;
      }

      return {
        custo_total_corrida: custoTotalCorrida,
        lucro_liquido_real: lucroLiquido,
        lucro_por_hora: lucroPorHora,
        vale_a_pena,
        mensagem_analise,
      };
    },
    [indices],
  );

  return {
    loading,
    indices,
    carregarIndices, // Exposto caso precise forçar um recarregamento na UI
    avaliarCorrida,
  };
}
