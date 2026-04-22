/**
 * Utilitário de Cálculo Financeiro: MOVIMENTO (MeuCorre)
 * Foca no custo de desgaste do ativo e queima de insumos (Custo por KM).
 * Refatorado 100% alinhado com a Fonte Única de Verdade (viabilidadeCorrida.ts).
 */

import { divisaoSegura, toNumber } from './indices/util';

export interface PecaPeriodica {
  valor_peca: number | string;
  intervalo_troca_km: number | string;
}

// Interface agora espelha EXATAMENTE os campos do banco de dados (CustosAtivo)
export interface FormularioMovimento {
  // 1. Energia
  preco_energia_unidade: number | string;
  rendimento_energia_unidade: number | string;

  // 2. Manutenção Preventiva Base
  valor_jogo_pneus: number | string;
  durabilidade_pneus_km: number | string;

  valor_oleo_filtros: number | string;
  intervalo_oleo_filtros_km: number | string; // Nomenclatura corrigida

  valor_manutencao_freios: number | string; // Nomenclatura corrigida
  intervalo_freios_km: number | string; // Nomenclatura corrigida

  valor_kit_transmissao: number | string; // Adicionado (Reflete o SSOT)
  durabilidade_transmissao_km: number | string; // Adicionado (Reflete o SSOT)

  pecas_periodicas_extras?: PecaPeriodica[];

  // 3. Imprevistos e Veículos Elétricos
  fundo_depreciacao_bateria_por_km: number | string; // Nomenclatura corrigida
}

export const CalculadoraMovimento = {
  /**
   * Calcula o Custo por Quilômetro (IKM)
   */
  calcularCustoKm: (form: FormularioMovimento) => {
    // A. Custo Energia KM
    const precoEnergia = toNumber(
      form.preco_energia_unidade,
    );
    const rendimentoKm =
      toNumber(form.rendimento_energia_unidade) || 10; // Evita divisões loucas se vier 0
    const custoEnergiaKM = divisaoSegura(
      precoEnergia,
      rendimentoKm,
    );

    // B. Custo Manutenção Preventiva KM
    const custoPneuKm = divisaoSegura(
      toNumber(form.valor_jogo_pneus),
      toNumber(form.durabilidade_pneus_km),
    );
    const custoOleoKm = divisaoSegura(
      toNumber(form.valor_oleo_filtros),
      toNumber(form.intervalo_oleo_filtros_km),
    );
    const custoFreioKm = divisaoSegura(
      toNumber(form.valor_manutencao_freios),
      toNumber(form.intervalo_freios_km),
    );
    const custoTransmissaoKm = divisaoSegura(
      toNumber(form.valor_kit_transmissao),
      toNumber(form.durabilidade_transmissao_km),
    );

    let somatorioPecasKM = 0;
    if (
      form.pecas_periodicas_extras &&
      form.pecas_periodicas_extras.length > 0
    ) {
      form.pecas_periodicas_extras.forEach((peca) => {
        somatorioPecasKM += divisaoSegura(
          toNumber(peca.valor_peca),
          toNumber(peca.intervalo_troca_km),
        );
      });
    }

    const custoManutencaoPreventivaKM =
      custoPneuKm +
      custoOleoKm +
      custoFreioKm +
      custoTransmissaoKm +
      somatorioPecasKM;

    // C. Fundo de Bateria (Exclusivo Elétricos, já vem por KM do banco)
    const fundoBateriaEletricaKm = toNumber(
      form.fundo_depreciacao_bateria_por_km,
    );

    // D. Fechamento do IKM (Puro custo de movimento)
    const ikm =
      custoEnergiaKM +
      custoManutencaoPreventivaKM +
      fundoBateriaEletricaKm;

    return { ikm };
  },

  calcularCompletudeMovimento: (
    form: FormularioMovimento,
  ) => {
    // Chaves atualizadas para refletir a nova interface e o banco
    const camposCriticos: (keyof FormularioMovimento)[] = [
      'preco_energia_unidade',
      'rendimento_energia_unidade',
      'valor_jogo_pneus',
      'durabilidade_pneus_km',
      'valor_oleo_filtros',
      'intervalo_oleo_filtros_km',
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
