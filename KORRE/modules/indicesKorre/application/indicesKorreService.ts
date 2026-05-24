import { CalculadoraMovimento } from '../domain/calculadoraMovimento';
import { CalculadoraTempo } from '../domain/calculadoraTempo';
import { CalculadoraDecisao as CalculadoraCustoPessoa } from '../domain/calculadoraDecisao';
import type { FormularioViabilidade } from '../domain/types';
import { CalculadoraRepository } from '../infra/indicesKorreRepository';
import { MaintenancePlanningService } from '../../maintenancePlanning/MaintenancePlanningService';

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
    form: Partial<FormularioViabilidade>,
  ) => {
    const resultadoKm = CalculadoraMovimento.calcularCustoKm(
      form as any,
    );
    const ikm = resultadoKm.ikm;
    const completudeKM =
      CalculadoraMovimento.calcularCompletudeMovimento(
        form as any,
      );

    const { imin: iminCustoFixo } =
      CalculadoraTempo.calcularCustoMinuto(form as any);
    const completudeTempo =
      CalculadoraTempo.calcularCompletudeTempo(form as any);

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
      meta_mensal_viavel_customizada:
        alimentacaoMensal +
        Number(form.plano_saude_mensal || 0),
    };

    const { lucroMinutoDesejado: metaLucroPorMinuto } =
      CalculadoraCustoPessoa.calcularIndicesMetas(
        dadosCustoPessoa,
      );

    const iminMetaFinal =
      iminCustoFixo + metaLucroPorMinuto;
    const completudeGeral =
      (completudeKM + completudeTempo) / 2;

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

    await MaintenancePlanningService.sincronizarDaAuditoria(
      veiculoId,
      form,
    );

    return {
      ikm,
      iminCustoFixo,
      iminMetaFinal,
      completudeGeral,
      breakdownKm: resultadoKm.breakdown,
      avisosKm: resultadoKm.avisos,
    };
  },
};

export const IndicesKorreService = CalculadoraService;
