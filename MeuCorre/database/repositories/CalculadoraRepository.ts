// database/repositories/CalculadoraRepository.ts
import db from '../DatabaseInit';

export const CalculadoraRepository = {
  // Puxa o veículo ativo
  getVeiculoAtivo: async () => {
    return await db.getFirstAsync(
      'SELECT * FROM veiculos WHERE ativo = 1',
    );
  },

  // Puxa os parâmetros se o usuário já tiver preenchido antes
  getParametrosSalvos: async (veiculoId: number) => {
    return await db.getFirstAsync(
      'SELECT * FROM parametros_financeiros WHERE veiculo_id = ?',
      [veiculoId],
    );
  },

  // A MÁGICA: Busca na tabela da Oficina os valores reais do veículo!
  getDadosDaOficina: async (veiculoId: number) => {
    const dadosExtraidos = {
      valorOleo: null,
      kmOleo: null,
      valorPneu: null,
      kmPneu: null,
    };

    // Busca o item Óleo
    const oleo: any = await db.getFirstAsync(
      `SELECT i.intervalo_km, h.valor FROM itens_manutencao i 
       LEFT JOIN historico_manutencao h ON h.item_id = i.id 
       WHERE i.veiculo_id = ? AND i.nome LIKE '%óleo%' ORDER BY h.id DESC LIMIT 1`,
      [veiculoId],
    );
    if (oleo) {
      dadosExtraidos.valorOleo = oleo.valor;
      dadosExtraidos.kmOleo = oleo.intervalo_km;
    }

    // Busca o item Pneu
    const pneu: any = await db.getFirstAsync(
      `SELECT i.intervalo_km, h.valor FROM itens_manutencao i 
       LEFT JOIN historico_manutencao h ON h.item_id = i.id 
       WHERE i.veiculo_id = ? AND i.nome LIKE '%pneu%' ORDER BY h.id DESC LIMIT 1`,
      [veiculoId],
    );
    if (pneu) {
      dadosExtraidos.valorPneu = pneu.valor;
      dadosExtraidos.kmPneu = pneu.intervalo_km;
    }

    return dadosExtraidos;
  },

  // Salva o formulário na tabela de Memória
  salvarParametros: async (
    veiculoId: number,
    form: any,
  ) => {
    const existe: any = await db.getFirstAsync(
      'SELECT id FROM parametros_financeiros WHERE veiculo_id = ?',
      [veiculoId],
    );

    if (existe) {
      // Atualiza os dados se já existirem
      await db.runAsync(
        `UPDATE parametros_financeiros SET 
          estado_uf = ?, tipo_aquisicao = ?, valor_veiculo_fipe = ?, depreciacao_real_estimada = ?, 
          custo_oportunidade_selic = ?, juros_financiamento_mensal = ?, diaria_aluguel = ?, 
          caucao_aluguel_mensalizado = ?, taxa_administracao_consorcio = ?, custo_reparacao_emprestimo = ?, 
          ipva_anual = ?, licenciamento_detran_anual = ?, imposto_mei_mensal = ?, imposto_renda_mensal = ?, 
          taxa_vistoria_gnv_anual = ?, taxas_alvaras_municipais_anual = ?, seguro_comercial_anual = ?, 
          rastreador_telemetria_mensal = ?, plano_dados_mensal = ?, rendimento_energia_unidade = ?, 
          preco_energia_unidade = ?, valor_oleo_filtros = ?, intervalo_oleo_filtros_km = ?, 
          valor_jogo_pneus = ?, durabilidade_pneus_km = ?, valor_manutencao_freios = ?, 
          intervalo_freios_km = ?, valor_kit_transmissao = ?, durabilidade_transmissao_km = ?, 
          fundo_depreciacao_bateria_por_km = ?, manutencao_imprevista_mensal = ?, 
          limpeza_higienizacao_mensal = ?, alimentacao_diaria = ?, consumo_apoio_diario = ?, 
          plano_saude_mensal = ?, fundo_emergencia_percentual = ?, provisao_ferias_mensal = ?, 
          provisao_decimo_terceiro_mensal = ?, salario_liquido_mensal_desejado = ?, valor_smartphone = ?, 
          vida_util_smartphone_meses = ?, custo_powerbanks_cabos_mensal = ?, custo_suportes_capas_mensal = ?, 
          custo_bag_mochila_mensal = ?, custo_vestuario_protecao_mensal = ?, percentual_dead_miles = ?, 
          tempo_espera_medio_minutos = ?, taxas_saque_antecipacao_mensal = ?, provisao_multas_mensal = ?, 
          dias_trabalhados_semana = ?, horas_por_dia = ?, km_por_dia = ?
         WHERE veiculo_id = ?`,
        [
          form.estado_uf,
          form.tipo_aquisicao,
          form.valor_veiculo_fipe,
          form.depreciacao_real_estimada,
          form.custo_oportunidade_selic,
          form.juros_financiamento_mensal,
          form.diaria_aluguel,
          form.caucao_aluguel_mensalizado,
          form.taxa_administracao_consorcio,
          form.custo_reparacao_emprestimo,
          form.ipva_anual,
          form.licenciamento_detran_anual,
          form.imposto_mei_mensal,
          form.imposto_renda_mensal,
          form.taxa_vistoria_gnv_anual,
          form.taxas_alvaras_municipais_anual,
          form.seguro_comercial_anual,
          form.rastreador_telemetria_mensal,
          form.plano_dados_mensal,
          form.rendimento_energia_unidade,
          form.preco_energia_unidade,
          form.valor_oleo_filtros,
          form.intervalo_oleo_filtros_km,
          form.valor_jogo_pneus,
          form.durabilidade_pneus_km,
          form.valor_manutencao_freios,
          form.intervalo_freios_km,
          form.valor_kit_transmissao,
          form.durabilidade_transmissao_km,
          form.fundo_depreciacao_bateria_por_km,
          form.manutencao_imprevista_mensal,
          form.limpeza_higienizacao_mensal,
          form.alimentacao_diaria,
          form.consumo_apoio_diario,
          form.plano_saude_mensal,
          form.fundo_emergencia_percentual,
          form.provisao_ferias_mensal,
          form.provisao_decimo_terceiro_mensal,
          form.salario_liquido_mensal_desejado,
          form.valor_smartphone,
          form.vida_util_smartphone_meses,
          form.custo_powerbanks_cabos_mensal,
          form.custo_suportes_capas_mensal,
          form.custo_bag_mochila_mensal,
          form.custo_vestuario_protecao_mensal,
          form.percentual_dead_miles,
          form.tempo_espera_medio_minutos,
          form.taxas_saque_antecipacao_mensal,
          form.provisao_multas_mensal,
          form.dias_trabalhados_semana,
          form.horas_por_dia,
          form.km_por_dia,
          veiculoId,
        ],
      );
    } else {
      // Insere a primeira vez
      await db.runAsync(
        `INSERT INTO parametros_financeiros 
          (veiculo_id, estado_uf, tipo_aquisicao, valor_veiculo_fipe, depreciacao_real_estimada, 
           custo_oportunidade_selic, juros_financiamento_mensal, diaria_aluguel, caucao_aluguel_mensalizado, 
           taxa_administracao_consorcio, custo_reparacao_emprestimo, ipva_anual, licenciamento_detran_anual, 
           imposto_mei_mensal, imposto_renda_mensal, taxa_vistoria_gnv_anual, taxas_alvaras_municipais_anual, 
           seguro_comercial_anual, rastreador_telemetria_mensal, plano_dados_mensal, rendimento_energia_unidade, 
           preco_energia_unidade, valor_oleo_filtros, intervalo_oleo_filtros_km, valor_jogo_pneus, 
           durabilidade_pneus_km, valor_manutencao_freios, intervalo_freios_km, valor_kit_transmissao, 
           durabilidade_transmissao_km, fundo_depreciacao_bateria_por_km, manutencao_imprevista_mensal, 
           limpeza_higienizacao_mensal, alimentacao_diaria, consumo_apoio_diario, plano_saude_mensal, 
           fundo_emergencia_percentual, provisao_ferias_mensal, provisao_decimo_terceiro_mensal, 
           salario_liquido_mensal_desejado, valor_smartphone, vida_util_smartphone_meses, 
           custo_powerbanks_cabos_mensal, custo_suportes_capas_mensal, custo_bag_mochila_mensal, 
           custo_vestuario_protecao_mensal, percentual_dead_miles, tempo_espera_medio_minutos, 
           taxas_saque_antecipacao_mensal, provisao_multas_mensal, dias_trabalhados_semana, horas_por_dia, km_por_dia) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          veiculoId,
          form.estado_uf,
          form.tipo_aquisicao,
          form.valor_veiculo_fipe,
          form.depreciacao_real_estimada,
          form.custo_oportunidade_selic,
          form.juros_financiamento_mensal,
          form.diaria_aluguel,
          form.caucao_aluguel_mensalizado,
          form.taxa_administracao_consorcio,
          form.custo_reparacao_emprestimo,
          form.ipva_anual,
          form.licenciamento_detran_anual,
          form.imposto_mei_mensal,
          form.imposto_renda_mensal,
          form.taxa_vistoria_gnv_anual,
          form.taxas_alvaras_municipais_anual,
          form.seguro_comercial_anual,
          form.rastreador_telemetria_mensal,
          form.plano_dados_mensal,
          form.rendimento_energia_unidade,
          form.preco_energia_unidade,
          form.valor_oleo_filtros,
          form.intervalo_oleo_filtros_km,
          form.valor_jogo_pneus,
          form.durabilidade_pneus_km,
          form.valor_manutencao_freios,
          form.intervalo_freios_km,
          form.valor_kit_transmissao,
          form.durabilidade_transmissao_km,
          form.fundo_depreciacao_bateria_por_km,
          form.manutencao_imprevista_mensal,
          form.limpeza_higienizacao_mensal,
          form.alimentacao_diaria,
          form.consumo_apoio_diario,
          form.plano_saude_mensal,
          form.fundo_emergencia_percentual,
          form.provisao_ferias_mensal,
          form.provisao_decimo_terceiro_mensal,
          form.salario_liquido_mensal_desejado,
          form.valor_smartphone,
          form.vida_util_smartphone_meses,
          form.custo_powerbanks_cabos_mensal,
          form.custo_suportes_capas_mensal,
          form.custo_bag_mochila_mensal,
          form.custo_vestuario_protecao_mensal,
          form.percentual_dead_miles,
          form.tempo_espera_medio_minutos,
          form.taxas_saque_antecipacao_mensal,
          form.provisao_multas_mensal,
          form.dias_trabalhados_semana,
          form.horas_por_dia,
          form.km_por_dia,
        ],
      );
    }
  },

  // Salva os Índices Mágicos no Veículo (Para acesso ultrarrápido)
  salvarIndices: async (
    veiculoId: number,
    ikm: number,
    imin: number,
    meta: number,
    completude: number,
  ) => {
    await db.runAsync(
      `UPDATE veiculos SET 
        custo_km_calculado = ?, custo_minuto_calculado = ?, 
        meta_ganho_minuto_calculado = ?, taxa_completude = ? 
       WHERE id = ?`,
      [ikm, imin, meta, completude, veiculoId],
    );
  },
};
