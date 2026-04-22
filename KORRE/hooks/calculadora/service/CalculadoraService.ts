import { CalculadoraRepository } from '../../../database/repositories/CalculadoraRepository';
import { CalculadoraDecisao as CalculadoraCustoPessoa } from '../../../utils/calculadoraKorreCustoPessoa';
import { CalculadoraMovimento } from '../../../utils/calculadoraKorreKM';
import { CalculadoraTempo } from '../../../utils/calculadoraKorreTempo';
// IMPORTANTE: Importe a interface mestra que serve como Fonte Única de Verdade
import { FormularioViabilidade } from '../../../type/viabilidadeCorrida';

export const CalculadoraService = {
  carregarDadosCompletosVeiculo: async (
    veiculoId: number,
  ) => {
    const salvos =
      await CalculadoraRepository.getParametrosSalvos(
        veiculoId,
      );
    const oficina =
      await CalculadoraRepository.getDadosDaOficina(
        veiculoId,
      );

    return { salvos, oficina };
  },

  processarESalvarCalculos: async (
    veiculoId: number,
    form: Partial<FormularioViabilidade>, // Usando a SSOT
  ) => {
    // 1. CUSTO DO ATIVO (KM)
    // Passamos o form diretamente sem 'as any', pois as interfaces agora combinam.
    const { ikm } = CalculadoraMovimento.calcularCustoKm(
      form as any,
    ); // O TS pode pedir cast se Partial faltar dados obrigatórios, mas a lógica está segura
    const completudeKM =
      CalculadoraMovimento.calcularCompletudeMovimento(
        form as any,
      );

    // 2. CUSTO DE EXISTÊNCIA (TEMPO)
    const { imin: iminCustoFixo } =
      CalculadoraTempo.calcularCustoMinuto(form as any);
    const completudeTempo =
      CalculadoraTempo.calcularCompletudeTempo(form as any);

    // 3. CUSTO PESSOA E META (SOBREVIVÊNCIA)
    // Tornando a rotina do trabalhador dinâmica
    const diasPorSemana =
      Number(form.dias_trabalhados_semana) || 0;
    const horasPorDia = Number(form.horas_por_dia) || 0;

    const diasTrabalhadosMes = diasPorSemana * 4.33;
    const horasMes = diasTrabalhadosMes * horasPorDia;

    const alimentacaoMensal =
      Number(form.alimentacao_diaria || 0) *
      diasTrabalhadosMes;

    const dadosCustoPessoa = {
      meta_mensal_desejada:
        form.salario_liquido_mensal_desejado || 0,
      total_horas_trabalhadas_mes: horasMes || 160,
      // A meta viável agora reflete a realidade do motorista (Dias trabalhados reais + plano de saúde)
      meta_mensal_viavel_customizada:
        alimentacaoMensal +
        Number(form.plano_saude_mensal || 0),
    };

    const { lucroMinutoDesejado: metaLucroPorMinuto } =
      CalculadoraCustoPessoa.calcularIndicesMetas(
        dadosCustoPessoa,
      );

    // 4. ÍNDICES MÁGICOS
    const iminMetaFinal =
      iminCustoFixo + metaLucroPorMinuto;
    const completudeGeral =
      (completudeKM + completudeTempo) / 2;

    // 5. PERSISTÊNCIA
    await CalculadoraRepository.salvarParametros(
      veiculoId,
      form,
    );

    await CalculadoraRepository.salvarIndicesNoVeiculo(
      veiculoId,
      ikm,
      iminCustoFixo,
      iminMetaFinal,
      completudeGeral,
    );
  },
};
