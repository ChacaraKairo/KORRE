/**
 * Utilitário de Cálculo Financeiro: DECISÃO E LUCRATIVIDADE (MeuCorre)
 * Implementa o algoritmo do "Semáforo de Decisão" (Verde, Amarelo, Vermelho).
 * Refatorado para suporte a Dead Miles e modularização.
 */

import { CONFIG_MERCADO } from './indices/constants';
import { divisaoSegura, toNumber } from './indices/util';

// ============================================================================
// TIPAGENS E INTERFACES
// ============================================================================

export type NivelDecisao =
  | 'IDEAL'
  | 'ACEITAVEL'
  | 'TOXICA'
  | 'PREJUIZO';

export interface DadosMetasUsuario {
  meta_mensal_desejada: number | string;
  total_horas_trabalhadas_mes: number | string;
  meta_mensal_viavel_customizada?: number | string;
}

export interface DadosCorridaApp {
  valor_oferecido_app: number | string;
  distancia_total_km: number | string; // Busca + Viagem
  tempo_total_minutos: number | string; // Espera + Viagem
  percentual_dead_miles?: number | string; // NOVO: Injetado via Banco de Dados
}

export interface CustosBaseCalculados {
  custo_km: number; // IKM (Vindo do calculadoraKorreKM.ts)
  custo_minuto: number; // IMIN (Vindo do calculadoraKorreTempo.ts)
}

export interface ResultadoSemaforo {
  lucro_liquido_corrida: number;
  rentabilidade_minuto_corrida: number;
  nivel: NivelDecisao;
  cor_sugerida: string;
  mensagem: string;
}

// ============================================================================
// MOTOR DE DECISÃO
// ============================================================================

export const CalculadoraDecisao = {
  /**
   * 1. Calcula os Índices de Meta (O quanto precisa e o quanto quer ganhar por minuto)
   */
  calcularIndicesMetas: (metas: DadosMetasUsuario) => {
    const horasMes =
      toNumber(metas.total_horas_trabalhadas_mes) ||
      CONFIG_MERCADO.HORAS_TRABALHO_PADRAO_MES;
    const tempoTrabalhoMensalMinutos = horasMes * 60;

    const metaViavel =
      toNumber(metas.meta_mensal_viavel_customizada) ||
      CONFIG_MERCADO.META_MENSAL_VIAVEL_PADRAO;
    const metaDesejada = toNumber(
      metas.meta_mensal_desejada,
    );

    const lucroMinutoViavel = divisaoSegura(
      metaViavel,
      tempoTrabalhoMensalMinutos,
    );
    const lucroMinutoDesejado = divisaoSegura(
      metaDesejada,
      tempoTrabalhoMensalMinutos,
    );

    return {
      tempoTrabalhoMensalMinutos,
      lucroMinutoViavel,
      lucroMinutoDesejado,
    };
  },

  /**
   * 2. Avalia a Corrida e Retorna o Nível no Semáforo
   */
  avaliarSemaforoCorrida: (
    corrida: DadosCorridaApp,
    custos: CustosBaseCalculados,
    metas: DadosMetasUsuario,
  ): ResultadoSemaforo => {
    // Extrai as metas por minuto
    const { lucroMinutoViavel, lucroMinutoDesejado } =
      CalculadoraDecisao.calcularIndicesMetas(metas);

    // Converte os dados da corrida e aplica a inflação do Dead Miles (deslocamento não pago)
    const distanciaBase = toNumber(
      corrida.distancia_total_km,
    );
    const percentualDeadMiles =
      toNumber(corrida.percentual_dead_miles) || 0;

    // Se o dead miles for 20%, o multiplicador será 1.2. A corrida de 10km "custa" 12km.
    const multiplicadorDeadMiles =
      1 + percentualDeadMiles / 100;
    const distanciaRealParaCusto =
      distanciaBase * multiplicadorDeadMiles;

    const tempo = toNumber(corrida.tempo_total_minutos);
    const valorApp = toNumber(corrida.valor_oferecido_app);

    // Passo 3.1: Encontrar o Lucro Líquido Real da Corrida usando a distância inflada
    const custoTotalCorrida =
      distanciaRealParaCusto * custos.custo_km +
      tempo * custos.custo_minuto;

    const lucroLiquidoCorrida =
      valorApp - custoTotalCorrida;

    // Passo 3.2: Rentabilidade por Minuto da Corrida
    const rentabilidadeMinuto = divisaoSegura(
      lucroLiquidoCorrida,
      tempo,
    );

    // Passo 4: O Algoritmo de Tomada de Decisão (Semáforo)
    let nivel: NivelDecisao;
    let cor_sugerida: string;
    let mensagem: string;

    if (rentabilidadeMinuto <= 0) {
      nivel = 'PREJUIZO';
      cor_sugerida = '#991b1b'; // Red-800
      mensagem =
        'Prejuízo imediato! Recuse. Você vai perder dinheiro real nesta viagem.';
    } else if (rentabilidadeMinuto < lucroMinutoViavel) {
      nivel = 'TOXICA';
      cor_sugerida = '#ef4444'; // Red-500
      mensagem =
        'Sub-remunerada! O lucro cobre os custos, mas te empurra para baixo da linha de viabilidade mensal.';
    } else if (
      rentabilidadeMinuto >= lucroMinutoViavel &&
      rentabilidadeMinuto < lucroMinutoDesejado
    ) {
      nivel = 'ACEITAVEL';
      cor_sugerida = '#f59e0b'; // Amber-500
      mensagem =
        'Abaixo da sua meta, mas viável. Aceite se estiver parado ou indo para um destino melhor.';
    } else {
      nivel = 'IDEAL';
      cor_sugerida = '#10b981'; // Emerald-500
      mensagem =
        'Excelente! Esta corrida paga os custos e acelera sua meta.';
    }

    return {
      lucro_liquido_corrida: lucroLiquidoCorrida,
      rentabilidade_minuto_corrida: rentabilidadeMinuto,
      nivel,
      cor_sugerida,
      mensagem,
    };
  },
};
