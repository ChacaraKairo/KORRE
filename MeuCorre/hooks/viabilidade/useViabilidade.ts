import { useState, useCallback, useEffect } from 'react';
import db from '../../database/DatabaseInit';
import {
  AvaliacaoCorrida,
  ResultadoViabilidade,
} from '../../type/viabilidadeCorrida';

export function useViabilidade() {
  const [indices, setIndices] = useState<{
    ikm: number;
    imin: number;
    meta: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR OS ÍNDICES DA BASE DE DADOS
  // Esta função corre silenciosamente em background quando o app abre
  const carregarIndices = useCallback(async () => {
    setLoading(true);
    try {
      const veiculo = await db.getFirstAsync(
        'SELECT custo_km_calculado, custo_minuto_calculado, meta_ganho_minuto_calculado FROM veiculos WHERE ativo = 1',
      );

      if (veiculo) {
        setIndices({
          ikm: veiculo.custo_km_calculado || 0,
          imin: veiculo.custo_minuto_calculado || 0,
          meta: veiculo.meta_ganho_minuto_calculado || 0,
        });
      }
    } catch (error) {
      console.error(
        'Erro ao carregar os Índices MC:',
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
  // É esta a função que vai ser chamada no momento em que a corrida "toca" no ecrã
  const avaliarCorrida = useCallback(
    (
      corrida: AvaliacaoCorrida,
    ): ResultadoViabilidade | null => {
      if (
        !indices ||
        (indices.ikm === 0 && indices.imin === 0)
      ) {
        // O motorista ainda não configurou a Auditoria Financeira
        return null;
      }

      const tempoTotal = corrida.tempo_estimado_minutos;

      // --- A Matemática Rápida ---
      // O IKM agora é o custo PURO do veículo.
      // Para calcular o custo real da corrida, multiplicamos o IKM puro pela distância TOTAL (Embarque + Corrida).
      const distanciaTotal =
        corrida.distancia_ate_embarque_km +
        corrida.distancia_corrida_km;
      const custoCorrida =
        distanciaTotal * indices.ikm +
        tempoTotal * indices.imin;

      // Lucro Líquido = Valor Bruto - Custo Total
      const lucroLiquido =
        corrida.valor_oferecido_app - custoCorrida;

      // Rentabilidade Horária
      const lucroPorMinuto =
        tempoTotal > 0 ? lucroLiquido / tempoTotal : 0;
      const lucroPorHora = lucroPorMinuto * 60;

      // --- A Tomada de Decisão ---
      // Para valer a pena, não basta não dar prejuízo. Tem de pagar a "Meta/Pró-Labore" do motorista!
      const vale_a_pena =
        lucroLiquido > 0 && lucroPorMinuto >= indices.meta;

      // --- Geração de Feedback Visual ---
      let mensagem_analise = '';
      if (lucroLiquido < 0) {
        mensagem_analise = `🚨 PREJUÍZO! Estás a pagar para trabalhar. O teu custo nesta corrida é R$ ${custoCorrida.toFixed(2)}.`;
      } else if (!vale_a_pena) {
        mensagem_analise = `⚠️ CUIDADO! Dá lucro de R$ ${lucroLiquido.toFixed(2)}, mas rende apenas R$ ${lucroPorHora.toFixed(2)}/h (Abaixo da tua Meta).`;
      } else {
        mensagem_analise = `✅ EXCELENTE! Cobre todos os custos e rende R$ ${lucroPorHora.toFixed(2)}/h limpos. Aceita!`;
      }

      return {
        custo_total_corrida: custoCorrida,
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
    carregarIndices, // Exposto caso precise de forçar um recarregamento
    avaliarCorrida,
  };
}
