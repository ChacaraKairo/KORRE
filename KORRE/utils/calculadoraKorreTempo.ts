/**
 * Utilitário de Cálculo Financeiro: TEMPO (MeuCorre)
 * Foca no custo de "existência" do veículo e do motorista (Custo por Minuto).
 * Refatorado 100% alinhado com a Fonte Única de Verdade (viabilidadeCorrida.ts).
 */

import { CONFIG_MERCADO } from './indices/constants';
import { divisaoSegura, toNumber } from './indices/util';

// Espelha exatamente a união de CustosCapital, CustosExistencia e CustosPessoa do SSOT
export interface FormularioTempo {
  // --- Metadados e Dinâmica de Tempo ---
  dias_trabalhados_semana: number | string;
  horas_por_dia: number | string;

  // 1. Custo Capital
  tipo_aquisicao:
    | 'proprio_quitado'
    | 'financiado'
    | 'alugado'
    | 'consorcio'
    | 'emprestado';
  valor_veiculo_fipe: number | string;
  custo_oportunidade_selic: number | string;
  juros_financiamento_mensal: number | string;
  diaria_aluguel: number | string;
  caucao_aluguel_mensalizado: number | string;
  taxa_administracao_consorcio: number | string;
  custo_reparacao_emprestimo: number | string;

  // 2. Custo Burocrático (Existência)
  ipva_anual: number | string;
  licenciamento_detran_anual: number | string;
  taxas_alvaras_municipais_anual: number | string;
  taxa_vistoria_gnv_anual: number | string;
  imposto_mei_mensal: number | string;
  imposto_renda_mensal: number | string;

  // 3. Custo Operacional Fixo
  seguro_comercial_anual: number | string;
  rastreador_telemetria_mensal: number | string;
  plano_dados_mensal: number | string;
  valor_smartphone: number | string;
  vida_util_smartphone_meses: number | string;

  // 4. Custo Sobrevivência (Pessoa)
  alimentacao_diaria: number | string;
  plano_saude_mensal: number | string;
  salario_liquido_mensal_desejado: number | string;
}

export const CalculadoraTempo = {
  /**
   * Calcula o Custo por Minuto (IMIN) e a Meta por Minuto
   */
  calcularCustoMinuto: (form: FormularioTempo) => {
    // Definir as horas e minutos dinamicamente baseados na rotina do usuário
    const diasPorSemana =
      toNumber(form.dias_trabalhados_semana) || 0;
    const horasPorDia = toNumber(form.horas_por_dia) || 0;
    const diasTrabalhadosMes = diasPorSemana * 4.33; // Média de semanas no mês

    const totalHorasMes =
      diasTrabalhadosMes * horasPorDia ||
      CONFIG_MERCADO.HORAS_TRABALHO_PADRAO_MES;
    const totalMinutosMes = totalHorasMes * 60;

    // A. Custo Capital Mensal
    let custoCapitalMensal = 0;
    switch (form.tipo_aquisicao) {
      case 'proprio_quitado':
        const valorVeiculo = toNumber(
          form.valor_veiculo_fipe,
        );
        const selicAnual = toNumber(
          form.custo_oportunidade_selic,
        );
        custoCapitalMensal = divisaoSegura(
          valorVeiculo * (selicAnual / 100),
          12,
        );
        break;
      case 'financiado':
        custoCapitalMensal = toNumber(
          form.juros_financiamento_mensal,
        );
        break;
      case 'alugado':
        custoCapitalMensal =
          toNumber(form.diaria_aluguel) * 30 +
          toNumber(form.caucao_aluguel_mensalizado);
        break;
      case 'consorcio':
        custoCapitalMensal = toNumber(
          form.taxa_administracao_consorcio,
        );
        break;
      case 'emprestado':
        custoCapitalMensal = toNumber(
          form.custo_reparacao_emprestimo,
        );
        break;
      default:
        custoCapitalMensal = 0;
    }

    // B. Custo Burocrático Mensal
    const somaImpostosAnuais =
      toNumber(form.ipva_anual) +
      toNumber(form.licenciamento_detran_anual) +
      toNumber(form.taxas_alvaras_municipais_anual) +
      toNumber(form.taxa_vistoria_gnv_anual);

    // Aplica o valor padrão do MEI caso não esteja preenchido
    const impostoMeiReal = form.imposto_mei_mensal
      ? toNumber(form.imposto_mei_mensal)
      : CONFIG_MERCADO.VALOR_DAS_MEI;

    const custoBurocraticoMensal =
      divisaoSegura(somaImpostosAnuais, 12) +
      impostoMeiReal +
      toNumber(form.imposto_renda_mensal);

    // C. Custo Operacional Fixo Mensal
    const depreciacaoSmartphoneMensal = divisaoSegura(
      toNumber(form.valor_smartphone),
      toNumber(form.vida_util_smartphone_meses) || 18,
    );
    const custoOperacionalFixoMensal =
      divisaoSegura(
        toNumber(form.seguro_comercial_anual),
        12,
      ) + // Convertido para mensal
      toNumber(form.plano_dados_mensal) +
      toNumber(form.rastreador_telemetria_mensal) +
      depreciacaoSmartphoneMensal;

    // D. Custo Sobrevivência Mensal
    const custoAlimentacaoMensal =
      toNumber(form.alimentacao_diaria) *
      diasTrabalhadosMes;
    const custoSobrevivenciaMensal =
      custoAlimentacaoMensal +
      toNumber(form.plano_saude_mensal);

    // E. Fechamento
    const custoTotalTempoMensal =
      custoCapitalMensal +
      custoBurocraticoMensal +
      custoOperacionalFixoMensal +
      custoSobrevivenciaMensal;

    const imin = divisaoSegura(
      custoTotalTempoMensal,
      totalMinutosMes,
    );

    const metaMinuto = divisaoSegura(
      toNumber(form.salario_liquido_mensal_desejado),
      totalMinutosMes,
    );

    return { imin, metaMinuto, custoTotalTempoMensal };
  },

  calcularCompletudeTempo: (form: FormularioTempo) => {
    // Chaves atualizadas para a checagem de preenchimento
    const camposCriticos: (keyof FormularioTempo)[] = [
      'dias_trabalhados_semana',
      'horas_por_dia',
      'valor_veiculo_fipe',
      'ipva_anual',
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
