// utils/calculadoraMath.ts

// Utilitário blindado para converter strings brasileiras ("1.500,00") em números reais
const toNumber = (val: any) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;

  let str = String(val).trim();

  // Se tiver ponto E vírgula (ex: 1.500,00), remove o ponto e converte vírgula para ponto
  if (str.includes('.') && str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  }
  // Se tem apenas vírgula (ex: 1500,00), converte para ponto
  else if (str.includes(',')) {
    str = str.replace(',', '.');
  }
  // Se houver múltiplos pontos de milhares sem vírgula (ex: 1.500.000), remove-os
  else if (str.split('.').length > 2) {
    str = str.replace(/\./g, '');
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

export const CalculadoraMath = {
  /**
   * 1. CALCULAR OS ÍNDICES MC (IKM e IMIN)
   */
  calcularIndices: (form: any, tipoVeiculo: string) => {
    const isBike = tipoVeiculo === 'bicicleta';

    // --- CUSTO CAPITAL ---
    let custoCapital = 0;
    const fipe = toNumber(form.valor_veiculo_fipe);
    if (form.tipo_aquisicao === 'proprio_quitado') {
      custoCapital =
        (fipe *
          (toNumber(form.custo_oportunidade_selic) / 100)) /
        12;
    } else if (form.tipo_aquisicao === 'financiado') {
      custoCapital = toNumber(
        form.juros_financiamento_mensal,
      );
    } else if (form.tipo_aquisicao === 'alugado') {
      custoCapital =
        toNumber(form.diaria_aluguel) * 30 +
        toNumber(form.caucao_aluguel_mensalizado);
    } else if (form.tipo_aquisicao === 'consorcio') {
      custoCapital = toNumber(
        form.taxa_administracao_consorcio,
      );
    } else {
      custoCapital = toNumber(
        form.custo_reparacao_emprestimo,
      );
    }

    // --- CUSTO FIXO MENSAL ---
    const custoBurocracia =
      (toNumber(form.ipva_anual) +
        toNumber(form.licenciamento_detran_anual) +
        toNumber(form.taxa_vistoria_gnv_anual) +
        toNumber(form.taxas_alvaras_municipais_anual)) /
        12 +
      toNumber(form.imposto_mei_mensal) +
      toNumber(form.imposto_renda_mensal);

    const custoEquipamentos =
      toNumber(form.valor_smartphone) /
        (toNumber(form.vida_util_smartphone_meses) || 1) +
      toNumber(form.custo_powerbanks_cabos_mensal) +
      toNumber(form.custo_suportes_capas_mensal) +
      toNumber(form.custo_bag_mochila_mensal) +
      toNumber(form.custo_vestuario_protecao_mensal);

    const custoFixoMensalTotal =
      custoCapital +
      custoBurocracia +
      custoEquipamentos +
      toNumber(form.seguro_comercial_anual) / 12 +
      toNumber(form.rastreador_telemetria_mensal) +
      toNumber(form.plano_dados_mensal) +
      toNumber(form.provisao_multas_mensal) +
      toNumber(form.taxas_saque_antecipacao_mensal) +
      toNumber(form.manutencao_imprevista_mensal) +
      toNumber(form.limpeza_higienizacao_mensal); // Adicionado (estava perdido)

    // --- CUSTO VARIÁVEL POR KM ---
    // Padrões seguros inseridos nas divisões para impedir a "Explosão Matemática" se os campos estiverem vazios
    let defaultRendimento = 10;
    if (tipoVeiculo === 'moto') defaultRendimento = 35;
    else if (tipoVeiculo === 'bicicleta')
      defaultRendimento = 1;
    else if (tipoVeiculo === 'carro_eletrico')
      defaultRendimento = 6.5;

    const rendimentoEnergia =
      toNumber(form.rendimento_energia_unidade) ||
      defaultRendimento;
    const custoEnergiaKm = isBike
      ? 0
      : toNumber(form.preco_energia_unidade) /
        rendimentoEnergia;

    const kmOleo =
      toNumber(form.intervalo_oleo_filtros_km) || 5000;
    const kmPneus =
      toNumber(form.durabilidade_pneus_km) || 30000;
    const kmFreios =
      toNumber(form.intervalo_freios_km) || 15000;
    const kmTransmissao =
      toNumber(form.durabilidade_transmissao_km) || 20000;

    const custoManutencaoKm =
      toNumber(form.valor_oleo_filtros) / kmOleo +
      toNumber(form.valor_jogo_pneus) / kmPneus +
      toNumber(form.valor_manutencao_freios) / kmFreios +
      toNumber(form.valor_kit_transmissao) / kmTransmissao +
      toNumber(form.fundo_depreciacao_bateria_por_km);

    // Conversão de valores diários/semanais para mensais
    const diasSemana =
      toNumber(form.dias_trabalhados_semana) || 6;
    // Um mês tem em média 4.33 semanas
    const diasTrabalhadosMes = diasSemana * 4.3333;
    const kmMes =
      (toNumber(form.km_por_dia) || 100) *
      diasTrabalhadosMes;

    const anosVidaUtil =
      toNumber(form.depreciacao_real_estimada) || 3; // Se vazio, assume 3 anos por padrão
    const depreciacaoAnual = fipe / anosVidaUtil;
    const depreciacaoMensal = depreciacaoAnual / 12;
    const depreciacaoUsoKm = depreciacaoMensal / kmMes;

    const ikm =
      custoEnergiaKm + custoManutencaoKm + depreciacaoUsoKm;

    // --- CUSTO DO TEMPO (IMIN) ---
    const diasTrabalhadosMedia = 25; // Idealmente seria um campo extra no form no futuro
    const custoHumanoMensal =
      toNumber(form.alimentacao_diaria) *
        diasTrabalhadosMedia +
      toNumber(form.consumo_apoio_diario) *
        diasTrabalhadosMedia +
      toNumber(form.plano_saude_mensal) +
      toNumber(form.provisao_ferias_mensal) +
      toNumber(form.provisao_decimo_terceiro_mensal);

    const horasMes =
      toNumber(form.horas_trabalhadas_mes) || 160; // Se vazio, assume 160h/mês (impede R$300/min)

    const imin =
      (custoFixoMensalTotal + custoHumanoMensal) /
      (horasMes * 60);

    const metaMinuto =
      toNumber(form.salario_liquido_mensal_desejado) /
      (horasMes * 60);

    return { ikm, imin, metaMinuto };
  },

  /**
   * 2. CALCULAR A TAXA DE COMPLETUDE (Gamificação: Vermelho, Laranja, Verde)
   */
  calcularCompletude: (form: any) => {
    // Lista de campos críticos que o motorista deveria preencher
    const camposImportantes = [
      'valor_veiculo_fipe',
      'seguro_comercial_anual',
      'plano_dados_mensal',
      'rendimento_energia_unidade',
      'preco_energia_unidade',
      'valor_oleo_filtros',
      'valor_jogo_pneus',
      'alimentacao_diaria',
      'salario_liquido_mensal_desejado',
      'dias_trabalhados_semana',
      'horas_por_dia',
      'km_por_dia',
    ];

    let preenchidos = 0;
    camposImportantes.forEach((campo) => {
      const valor = form[campo];
      if (
        valor !== '' &&
        valor !== null &&
        valor !== undefined
      )
        preenchidos++;
    });

    const percentual =
      (preenchidos / camposImportantes.length) * 100;
    return percentual; // Retorna de 0 a 100
  },
};
