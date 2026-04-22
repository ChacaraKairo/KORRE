/**
 * TIPOS PARA O CÁLCULO DE VIABILIDADE DE CORRIDAS (MEUCORRE)
 * Fonte Única de Verdade para o Banco de Dados, Calculadoras e UI.
 */

export type TipoAquisicao =
  | 'proprio_quitado'
  | 'financiado'
  | 'alugado'
  | 'consorcio'
  | 'emprestado';

// --- Blocos de Custo ---
export interface CustosCapital {
  tipo_aquisicao: TipoAquisicao;
  valor_veiculo_fipe: number;
  depreciacao_real_estimada: number;
  custo_oportunidade_selic: number;
  juros_financiamento_mensal: number;
  diaria_aluguel: number;
  caucao_aluguel_mensalizado: number;
  taxa_administracao_consorcio: number;
  custo_reparacao_emprestimo: number;
}

export interface CustosExistencia {
  estado_uf: string;
  ipva_anual: number;
  licenciamento_detran_anual: number;
  imposto_mei_mensal: number;
  imposto_renda_mensal: number;
  taxa_vistoria_gnv_anual: number;
  taxas_alvaras_municipais_anual: number;
  seguro_comercial_anual: number;
  rastreador_telemetria_mensal: number;
  plano_dados_mensal: number;
  valor_smartphone: number;
  vida_util_smartphone_meses: number;
}

export interface CustosAtivo {
  rendimento_energia_unidade: number;
  preco_energia_unidade: number;
  valor_oleo_filtros: number;
  intervalo_oleo_filtros_km: number;
  valor_jogo_pneus: number;
  durabilidade_pneus_km: number;
  valor_manutencao_freios: number;
  intervalo_freios_km: number;
  valor_kit_transmissao: number;
  durabilidade_transmissao_km: number;
  fundo_depreciacao_bateria_por_km: number;
  manutencao_imprevista_mensal: number;
  limpeza_higienizacao_mensal: number;
}

export interface CustosPessoa {
  salario_liquido_mensal_desejado: number;
  dias_trabalhados_semana: number;
  horas_por_dia: number;
  km_por_dia: number;
  alimentacao_diaria: number;
  consumo_apoio_diario: number;
  plano_saude_mensal: number;
  fundo_emergencia_percentual: number;
  provisao_ferias_mensal: number;
  provisao_decimo_terceiro_mensal: number;
}

export interface DinamicaPlataforma {
  percentual_dead_miles: number;
  tempo_espera_medio_minutos: number;
  taxas_saque_antecipacao_mensal: number;
  provisao_multas_mensal: number;
  custo_powerbanks_cabos_mensal: number;
  custo_suportes_capas_mensal: number;
  custo_bag_mochila_mensal: number;
  custo_vestuario_protecao_mensal: number;
}

// --- Interfaces de Avaliação (Usadas no Hook useViabilidade) ---

/** Interface que define os dados de uma nova corrida para análise */
export interface AvaliacaoCorrida {
  distancia_ate_embarque_km: number;
  distancia_corrida_km: number;
  tempo_estimado_minutos: number;
  valor_oferecido_app: number;
}

/** Interface que define o retorno do cálculo do semáforo */
export interface ResultadoViabilidade {
  custo_total_corrida: number;
  lucro_liquido_real: number;
  lucro_por_hora: number;
  vale_a_pena: boolean;
  mensagem_analise: string;
}

/** Interface mestra do formulário guardado no banco */
export interface FormularioViabilidade
  extends
    CustosCapital,
    CustosExistencia,
    CustosAtivo,
    CustosPessoa,
    DinamicaPlataforma {
  veiculo_id: number;
}
