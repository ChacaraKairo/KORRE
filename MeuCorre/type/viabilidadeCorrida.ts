/**
 * TIPOS PARA O CÁLCULO DE VIABILIDADE DE CORRIDAS (MEUCORRE)
 * Engenharia Financeira e Contabilidade de Frotas Aplicada.
 * Cobre Veículos a Combustão, Elétricos, Bicicletas e Vans,
 * em todos os modelos de aquisição e regimes de tributação.
 */

export type TipoAquisicao =
  | 'proprio_quitado'
  | 'financiado'
  | 'alugado'
  | 'consorcio'
  | 'emprestado';

// ============================================================================
// CATEGORIA 1: Custos de Capital e Aquisição (O Custo do Ativo)
// ============================================================================
export interface CustosCapital {
  tipo_aquisicao: TipoAquisicao;
  valor_veiculo_fipe: number; // Valor de mercado atual (R$)
  depreciacao_real_estimada: number; // Anos de vida útil para amortizar o valor total (Ex: 3 anos)
  custo_oportunidade_selic: number; // Rendimento anual perdido (Ex: 10.5 para 10.5%)

  // Específicos por tipo de aquisição
  juros_financiamento_mensal: number; // CET, Amortização e IOF (R$)
  diaria_aluguel: number; // Valor da diária na locadora (R$)
  caucao_aluguel_mensalizado: number; // Custo de imobilização do caução (R$)
  taxa_administracao_consorcio: number; // Custo mensal do consórcio (R$)
  custo_reparacao_emprestimo: number; // Rateio informal ou desgaste pago a terceiros (R$)
}

// ============================================================================
// CATEGORIA 2: Custos Governamentais, Impostos e Burocracia
// ============================================================================
export interface CustosBurocracia {
  ipva_anual: number; // R$ (0 para isentos/alugados)
  licenciamento_detran_anual: number; // R$
  imposto_mei_mensal: number; // DAS (Varia entre Passageiro e Carga)
  imposto_renda_mensal: number; // Provisão IRPF para informais (R$)
  taxa_vistoria_gnv_anual: number; // Custo do CSV do Inmetro (R$)
  taxas_alvaras_municipais_anual: number; // Ex: AETC/ZMRC para VUC, RNTRC (R$)
}

// ============================================================================
// CATEGORIA 3: Custos Operacionais Fixos (O Custo de Manter Aberto)
// ============================================================================
export interface CustosFixos {
  seguro_comercial_anual: number; // Seguro APP / RCF-V / RCF-DC (R$)
  rastreador_telemetria_mensal: number; // R$
  plano_dados_mensal: number; // Internet de alta franquia (R$)
}

// ============================================================================
// CATEGORIA 4: Custos Operacionais Variáveis (O Custo de Rodar)
// ============================================================================
export interface CustosVariaveis {
  // Energia
  rendimento_energia_unidade: number; // KM/L (Combustão) ou KM/kWh (EV)
  preco_energia_unidade: number; // R$/L ou R$/kWh

  // Manutenção Preventiva e Corretiva
  valor_oleo_filtros: number; // R$
  intervalo_oleo_filtros_km: number; // KM
  valor_jogo_pneus: number; // R$
  durabilidade_pneus_km: number; // KM
  valor_manutencao_freios: number; // Pastilhas/Discos (R$)
  intervalo_freios_km: number; // KM
  valor_kit_transmissao: number; // Relação (Moto) / Correia (Carro) (R$)
  durabilidade_transmissao_km: number; // KM

  // Provisões Específicas
  fundo_depreciacao_bateria_por_km: number; // "Sinking Fund" para troca de bateria EV/E-Bike (R$/KM)
  manutencao_imprevista_mensal: number; // Margem para elétrica/suspensão (R$/mês)
  limpeza_higienizacao_mensal: number; // R$ (Lavagens profundas para manter nota)
}

// ============================================================================
// CATEGORIA 5: Custos do Fator Humano e Pessoal (A Máquina Humana)
// ============================================================================
export interface CustosFatorHumano {
  alimentacao_diaria: number; // Almoço/Lanches na rua (R$)
  consumo_apoio_diario: number; // Água, uso de sanitários pagos (R$)
  plano_saude_mensal: number; // Necessidade por risco ocupacional (R$)
  fundo_emergencia_percentual: number; // % retida para dias parados/doença (Ex: 5)
  provisao_ferias_mensal: number; // 1/12 avos do lucro alvo (R$)
  provisao_decimo_terceiro_mensal: number; // 1/12 avos do lucro alvo (R$)
}

// ============================================================================
// CATEGORIA 6: Equipamentos e Infraestrutura Tecnológica
// ============================================================================
export interface CustosEquipamentos {
  valor_smartphone: number; // R$
  vida_util_smartphone_meses: number; // Amortização (Burn-in, bateria) - Ex: 18 meses
  custo_powerbanks_cabos_mensal: number; // R$
  custo_suportes_capas_mensal: number; // R$
  custo_bag_mochila_mensal: number; // R$ (Substituição sanitária/desgaste)
  custo_vestuario_protecao_mensal: number; // Capacetes, capas de chuva, luvas (R$)
}

// ============================================================================
// CATEGORIA 7: Dinâmica de Plataforma e Comportamento
// ============================================================================
export interface DinamicaPlataforma {
  percentual_dead_miles: number; // % de KM rodado vazio/sem remuneração
  tempo_espera_medio_minutos: number; // Tempo perdido em restaurantes/embarque
  taxas_saque_antecipacao_mensal: number; // R$ (Custos bancários da plataforma)
  provisao_multas_mensal: number; // R$ (Risco estatístico de trânsito)
}

// ============================================================================
// INTERFACES DE AVALIAÇÃO E RESULTADO
// ============================================================================
export interface AvaliacaoCorrida {
  distancia_ate_embarque_km: number;
  distancia_corrida_km: number;
  tempo_estimado_minutos: number;
  valor_oferecido_app: number;
}

export interface ResultadoViabilidade {
  custo_total_corrida: number; // Absorção total das 7 categorias
  lucro_liquido_real: number; // Resíduo financeiro final
  lucro_por_hora: number; // Rentabilidade horária real
  vale_a_pena: boolean; // Atende ao Break-Even Point e metas
  mensagem_analise: string; // Feedback algorítmico para o motorista
}

// ============================================================================
// PERFIL MESTRE DO TRABALHADOR
// ============================================================================
export interface PerfilFinanceiroTrabalhador {
  capital: CustosCapital;
  burocracia: CustosBurocracia;
  fixos: CustosFixos;
  variaveis: CustosVariaveis;
  humano: CustosFatorHumano;
  equipamentos: CustosEquipamentos;
  plataforma: DinamicaPlataforma;
}
