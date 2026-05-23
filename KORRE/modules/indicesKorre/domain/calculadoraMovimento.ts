/**
 * Utilitario de Calculo Financeiro: MOVIMENTO (KORRE)
 * Foca no custo de desgaste do ativo e queima de insumos (Custo por KM).
 */

import { divisaoSegura, toNumber } from './util';

export interface PecaPeriodica {
  valor_peca: number | string;
  intervalo_troca_km: number | string;
}

export interface BreakdownCustoKm {
  energiaKm: number;
  pneusKm: number;
  oleoKm: number;
  freiosKm: number;
  transmissaoKm: number;
  pecasExtrasKm: number;
  bateriaEletricaKm: number;
  depreciacaoKm: number;
  manutencaoImprevistaKm: number;
  maoObraPreventivaKm: number;
  limpezaKm: number;
}

export interface ResultadoCustoKm {
  ikm: number;
  breakdown: BreakdownCustoKm;
  avisos: string[];
}

// Interface espelha os campos de movimento do banco/SSOT.
export interface FormularioMovimento {
  preco_energia_unidade: number | string;
  rendimento_energia_unidade: number | string;
  valor_jogo_pneus: number | string;
  durabilidade_pneus_km: number | string;
  valor_oleo_filtros: number | string;
  intervalo_oleo_filtros_km: number | string;
  valor_manutencao_freios: number | string;
  intervalo_freios_km: number | string;
  valor_kit_transmissao: number | string;
  durabilidade_transmissao_km: number | string;
  pecas_periodicas_extras?: PecaPeriodica[];
  fundo_depreciacao_bateria_por_km: number | string;
  km_estimado_mes?: number | string;
  km_por_dia?: number | string;
  dias_trabalhados_semana?: number | string;
  depreciacao_real_estimada?: number | string;
  depreciacao_por_km?: number | string;
  manutencao_imprevista_mensal?: number | string;
  manutencao_imprevista_por_km?: number | string;
  mao_obra_preventiva_por_km?: number | string;
  limpeza_higienizacao_mensal?: number | string;
  limpeza_higienizacao_por_km?: number | string;
}

const calcularKmMes = (form: FormularioMovimento) => {
  const kmEstimadoMes = toNumber(form.km_estimado_mes);
  if (kmEstimadoMes > 0) return kmEstimadoMes;

  const kmPorDia = toNumber(form.km_por_dia);
  const diasTrabalhadosSemana = toNumber(
    form.dias_trabalhados_semana,
  );

  if (kmPorDia > 0 && diasTrabalhadosSemana > 0) {
    return kmPorDia * diasTrabalhadosSemana * 4.33;
  }

  return 0;
};

export const CalculadoraMovimento = {
  /**
   * Calcula o Custo por Quilometro (IKM).
   */
  calcularCustoKm: (
    form: FormularioMovimento,
  ): ResultadoCustoKm => {
    const avisos: string[] = [];

    const precoEnergia = toNumber(
      form.preco_energia_unidade,
    );
    const rendimentoKm = toNumber(
      form.rendimento_energia_unidade,
    );
    const energiaKm =
      rendimentoKm > 0
        ? divisaoSegura(precoEnergia, rendimentoKm)
        : 0;

    if (rendimentoKm <= 0) {
      avisos.push('Informe o rendimento do veículo.');
    }

    const pneusKm = divisaoSegura(
      toNumber(form.valor_jogo_pneus),
      toNumber(form.durabilidade_pneus_km),
    );
    const oleoKm = divisaoSegura(
      toNumber(form.valor_oleo_filtros),
      toNumber(form.intervalo_oleo_filtros_km),
    );
    const freiosKm = divisaoSegura(
      toNumber(form.valor_manutencao_freios),
      toNumber(form.intervalo_freios_km),
    );
    const transmissaoKm = divisaoSegura(
      toNumber(form.valor_kit_transmissao),
      toNumber(form.durabilidade_transmissao_km),
    );

    const pecasExtrasKm = (form.pecas_periodicas_extras ?? [])
      .map((peca) =>
        divisaoSegura(
          toNumber(peca.valor_peca),
          toNumber(peca.intervalo_troca_km),
        ),
      )
      .reduce((total, valor) => total + valor, 0);

    const bateriaEletricaKm = toNumber(
      form.fundo_depreciacao_bateria_por_km,
    );

    const kmMes = calcularKmMes(form);
    const depreciacaoDiretaKm = toNumber(
      form.depreciacao_por_km,
    );
    const depreciacaoMensal = toNumber(
      form.depreciacao_real_estimada,
    );
    const depreciacaoKm =
      depreciacaoDiretaKm > 0
        ? depreciacaoDiretaKm
        : depreciacaoMensal > 0 && kmMes > 0
          ? divisaoSegura(depreciacaoMensal, kmMes)
          : 0;

    const imprevistosDiretoKm = toNumber(
      form.manutencao_imprevista_por_km,
    );
    const imprevistosMensal = toNumber(
      form.manutencao_imprevista_mensal,
    );
    const manutencaoImprevistaKm =
      imprevistosDiretoKm > 0
        ? imprevistosDiretoKm
        : imprevistosMensal > 0 && kmMes > 0
          ? divisaoSegura(imprevistosMensal, kmMes)
          : 0;

    const limpezaDiretaKm = toNumber(
      form.limpeza_higienizacao_por_km,
    );
    const limpezaMensal = toNumber(
      form.limpeza_higienizacao_mensal,
    );
    const limpezaKm =
      limpezaDiretaKm > 0
        ? limpezaDiretaKm
        : limpezaMensal > 0 && kmMes > 0
          ? divisaoSegura(limpezaMensal, kmMes)
          : 0;

    const maoObraPreventivaKm = toNumber(
      form.mao_obra_preventiva_por_km,
    );

    const precisaDiluirMensais =
      (depreciacaoMensal > 0 && depreciacaoDiretaKm <= 0) ||
      (imprevistosMensal > 0 && imprevistosDiretoKm <= 0) ||
      (limpezaMensal > 0 && limpezaDiretaKm <= 0);

    if (precisaDiluirMensais && kmMes <= 0) {
      avisos.push(
        'Informe KM por dia e dias trabalhados por semana para diluir custos mensais.',
      );
    }
    if (depreciacaoKm <= 0) {
      avisos.push(
        'Informe depreciação mensal ou depreciação por km.',
      );
    }
    if (manutencaoImprevistaKm <= 0) {
      avisos.push(
        'Informe reserva de manutenção imprevista.',
      );
    }

    const ikm =
      energiaKm +
      pneusKm +
      oleoKm +
      freiosKm +
      transmissaoKm +
      pecasExtrasKm +
      bateriaEletricaKm +
      depreciacaoKm +
      manutencaoImprevistaKm +
      maoObraPreventivaKm +
      limpezaKm;

    return {
      ikm,
      breakdown: {
        energiaKm,
        pneusKm,
        oleoKm,
        freiosKm,
        transmissaoKm,
        pecasExtrasKm,
        bateriaEletricaKm,
        depreciacaoKm,
        manutencaoImprevistaKm,
        maoObraPreventivaKm,
        limpezaKm,
      },
      avisos,
    };
  },

  calcularCompletudeMovimento: (
    form: FormularioMovimento,
  ) => {
    const camposCriticos: (keyof FormularioMovimento)[] = [
      'preco_energia_unidade',
      'rendimento_energia_unidade',
      'valor_jogo_pneus',
      'durabilidade_pneus_km',
      'valor_oleo_filtros',
      'intervalo_oleo_filtros_km',
      'km_por_dia',
      'dias_trabalhados_semana',
    ];

    let preenchidos = 0;
    camposCriticos.forEach((campo) => {
      const valor = form[campo];
      if (
        valor !== '' &&
        valor !== null &&
        valor !== undefined &&
        valor !== 0 &&
        valor !== '0'
      ) {
        preenchidos++;
      }
    });

    return (preenchidos / camposCriticos.length) * 100;
  },
};
