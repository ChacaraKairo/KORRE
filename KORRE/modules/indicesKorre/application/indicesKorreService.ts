import { CalculadoraMovimento } from '../domain/calculadoraMovimento';
import { CalculadoraTempo } from '../domain/calculadoraTempo';
import { CalculadoraDecisao as CalculadoraCustoPessoa } from '../domain/calculadoraDecisao';
import type { FormularioViabilidade } from '../domain/types';
import { CalculadoraRepository } from '../infra/indicesKorreRepository';
import { MaintenancePlanningService } from '../../maintenancePlanning/MaintenancePlanningService';
import db from '../../../database/DatabaseInit';
import { criarNotificacao } from '../../../notifications/NotificationService';
import { AppRoutes } from '../../../constants/routes';

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
    const antes = await db.getFirstAsync<{
      custo_km_calculado: number | null;
      custo_minuto_calculado: number | null;
    }>(
      `SELECT custo_km_calculado, custo_minuto_calculado FROM veiculos WHERE id = ?`,
      [veiculoId],
    );
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

    await criarNotificacao({
      titulo: 'Auditoria KORRE salva',
      mensagem: 'Os indices foram atualizados com sucesso.',
      tipo: 'sucesso',
      prioridade: 'baixa',
      destino: AppRoutes.calculadoraKorre,
      canal: 'historico',
      grupoPreferencia: 'indices',
      dedupKey: `auditoria_salva:${veiculoId}:${Date.now()}`,
    });

    const ikmAnterior = Number(antes?.custo_km_calculado || 0);
    if (ikmAnterior > 0 && ikm > ikmAnterior * 1.15) {
      await criarNotificacao({
        titulo: 'Custo por km aumentou',
        mensagem: 'Seu IKM subiu de forma relevante. Revise os custos.',
        tipo: 'indices',
        prioridade: 'alta',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: `ikm_aumentou:${veiculoId}:${new Date().toISOString().slice(0, 10)}`,
      });
    }

    const iminAnterior = Number(antes?.custo_minuto_calculado || 0);
    if (iminAnterior > 0 && iminCustoFixo > iminAnterior * 1.15) {
      await criarNotificacao({
        titulo: 'Custo por minuto aumentou',
        mensagem: 'Seu IMIN subiu de forma relevante.',
        tipo: 'indices',
        prioridade: 'media',
        destino: AppRoutes.calculadoraKorre,
        grupoPreferencia: 'indices',
        dedupKey: `imin_aumentou:${veiculoId}:${new Date().toISOString().slice(0, 10)}`,
      });
    }

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
