import type { SQLiteBindValue } from 'expo-sqlite';

export const BACKUP_APP_NAME = 'KORRE';
export const BACKUP_SCHEMA_VERSION = 9;

export const BACKUP_TABLES = [
  'perfil_usuario',
  'veiculos',
  'parametros_financeiros',
  'categorias_financeiras',
  'origens_ganho_usuario',
  'transacoes_financeiras',
  'itens_manutencao',
  'historico_manutencao',
  'analises_corrida',
  'notificacoes',
  'abastecimentos',
  'consumo_veiculo_periodo',
  'eventos_veiculo',
] as const;

export type BackupTable = (typeof BACKUP_TABLES)[number];

export const BACKUP_COLUMNS: Record<BackupTable, readonly string[]> = {
  perfil_usuario: [
    'id',
    'nome',
    'email',
    'cpf',
    'senha',
    'foto_uri',
    'meta_diaria',
    'tipo_meta',
    'meta_semanal',
    'data_cadastro',
  ],
  veiculos: [
    'id',
    'tipo',
    'marca',
    'modelo',
    'ano',
    'motor',
    'placa',
    'km_atual',
    'combustivel_padrao',
    'id_user',
    'ativo',
    'custo_km_calculado',
    'custo_minuto_calculado',
    'meta_ganho_minuto_calculado',
    'taxa_completude',
  ],
  parametros_financeiros: [
    'id',
    'veiculo_id',
    'estado_uf',
    'tipo_aquisicao',
    'valor_veiculo_fipe',
    'depreciacao_real_estimada',
    'custo_oportunidade_selic',
    'juros_financiamento_mensal',
    'diaria_aluguel',
    'caucao_aluguel_mensalizado',
    'taxa_administracao_consorcio',
    'custo_reparacao_emprestimo',
    'ipva_anual',
    'licenciamento_detran_anual',
    'imposto_mei_mensal',
    'imposto_renda_mensal',
    'taxa_vistoria_gnv_anual',
    'taxas_alvaras_municipais_anual',
    'seguro_comercial_anual',
    'rastreador_telemetria_mensal',
    'plano_dados_mensal',
    'rendimento_energia_unidade',
    'preco_energia_unidade',
    'valor_oleo_filtros',
    'intervalo_oleo_filtros_km',
    'valor_jogo_pneus',
    'durabilidade_pneus_km',
    'valor_manutencao_freios',
    'intervalo_freios_km',
    'valor_kit_transmissao',
    'durabilidade_transmissao_km',
    'fundo_depreciacao_bateria_por_km',
    'km_estimado_mes',
    'depreciacao_por_km',
    'manutencao_imprevista_mensal',
    'manutencao_imprevista_por_km',
    'mao_obra_preventiva_por_km',
    'limpeza_higienizacao_mensal',
    'limpeza_higienizacao_por_km',
    'alimentacao_diaria',
    'consumo_apoio_diario',
    'plano_saude_mensal',
    'fundo_emergencia_percentual',
    'provisao_ferias_mensal',
    'provisao_decimo_terceiro_mensal',
    'salario_liquido_mensal_desejado',
    'valor_smartphone',
    'vida_util_smartphone_meses',
    'custo_powerbanks_cabos_mensal',
    'custo_suportes_capas_mensal',
    'custo_bag_mochila_mensal',
    'custo_vestuario_protecao_mensal',
    'percentual_dead_miles',
    'tempo_espera_medio_minutos',
    'taxas_saque_antecipacao_mensal',
    'provisao_multas_mensal',
    'dias_trabalhados_semana',
    'horas_por_dia',
    'km_por_dia',
  ],
  categorias_financeiras: ['id', 'nome', 'tipo', 'icone', 'cor'],
  origens_ganho_usuario: [
    'id',
    'nome',
    'categoria',
    'icone',
    'cor',
    'ativo',
  ],
  transacoes_financeiras: [
    'id',
    'veiculo_id',
    'categoria_id',
    'descricao',
    'valor',
    'data_transacao',
    'tipo',
  ],
  itens_manutencao: [
    'id',
    'veiculo_id',
    'nome',
    'icone',
    'ultima_troca_km',
    'intervalo_km',
    'ultima_troca_data',
    'intervalo_meses',
    'criticidade',
    'valor_previsto',
    'origem',
    'tem_historico_real',
    'computar_no_custo',
  ],
  historico_manutencao: [
    'id',
    'veiculo_id',
    'item_id',
    'descricao',
    'valor',
    'km_servico',
    'diferenca_tempo_meses',
    'data_servico',
  ],
  analises_corrida: [
    'id',
    'veiculo_id',
    'valor_oferecido',
    'distancia_embarque_km',
    'distancia_corrida_km',
    'tempo_total_minutos',
    'custo_estimado',
    'lucro_estimado',
    'lucro_por_hora',
    'decisao',
    'data_analise',
  ],
  notificacoes: [
    'id',
    'titulo',
    'mensagem',
    'tipo',
    'lida',
    'origem',
    'destino',
    'dados_json',
    'dedup_key',
    'prioridade',
    'canal',
    'grupo_preferencia',
    'data_criacao',
  ],
  abastecimentos: [
    'id',
    'veiculo_id',
    'usuario_local_id',
    'data_abastecimento',
    'km_atual',
    'tipo_combustivel',
    'litros',
    'valor_total',
    'preco_unitario',
    'tanque_cheio',
    'cidade',
    'estado_uf',
    'origem',
    'sincronizado',
    'elegivel_estatistica',
    'observacao',
    'criado_sem_login',
    'vinculado_apos_cadastro',
  ],
  consumo_veiculo_periodo: [
    'id',
    'veiculo_id',
    'periodo_inicio',
    'periodo_fim',
    'km_rodados',
    'litros_consumidos',
    'combustivel',
    'consumo_km_l',
    'custo_combustivel_total',
    'custo_combustivel_km',
    'confianca_calculo',
    'origem',
    'data_calculo',
  ],
  eventos_veiculo: [
    'id',
    'veiculo_id',
    'tipo_evento',
    'data_evento',
    'km_evento',
    'valor_total',
    'categoria',
    'subcategoria',
    'origem',
    'detalhes_json',
    'elegivel_estatistica',
  ],
};

export const BACKUP_EXPORT_COLUMNS: Record<
  BackupTable,
  readonly string[]
> = {
  ...BACKUP_COLUMNS,
  perfil_usuario: BACKUP_COLUMNS.perfil_usuario.filter(
    (column) => column !== 'senha',
  ),
};

export const BACKUP_RESTORE_COLUMNS: Record<
  BackupTable,
  readonly string[]
> = {
  ...BACKUP_COLUMNS,
  perfil_usuario: BACKUP_COLUMNS.perfil_usuario.filter(
    (column) => column !== 'senha',
  ),
};

export const sanitizeBackupRow = (
  table: BackupTable,
  row: Record<string, unknown>,
) => {
  const normalizedRow = normalizeLegacyBackupRow(table, row);
  const allowed = BACKUP_RESTORE_COLUMNS[table];
  const columns = allowed.filter((column) =>
    Object.prototype.hasOwnProperty.call(normalizedRow, column),
  );

  return {
    columns,
    values: columns.map((column) =>
      toSQLiteBindValue(normalizedRow[column]),
    ),
  };
};

export const validateBackupPayload = (data: unknown) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Backup invalido.');
  }

  const payload = data as {
    app?: unknown;
    versao_banco?: unknown;
    tabelas?: unknown;
  };

  if (payload.app !== BACKUP_APP_NAME) {
    throw new Error('Backup pertence a outro app.');
  }

  if (
    typeof payload.versao_banco !== 'number' ||
    payload.versao_banco < 1 ||
    payload.versao_banco > BACKUP_SCHEMA_VERSION
  ) {
    throw new Error('Versao de backup incompativel.');
  }

  if (!payload.tabelas || typeof payload.tabelas !== 'object') {
    throw new Error('Backup sem tabelas.');
  }

  const tabelas = payload.tabelas as Record<string, unknown>;
  for (const table of BACKUP_TABLES) {
    if (
      payload.versao_banco < 5 &&
      table === 'origens_ganho_usuario'
    ) {
      continue;
    }

    if (payload.versao_banco < 6 && table === 'analises_corrida') {
      continue;
    }

    if (payload.versao_banco < 9) {
      if (table === 'abastecimentos') continue;
      if (table === 'consumo_veiculo_periodo') continue;
      if (table === 'eventos_veiculo') continue;
    }

    if (!Array.isArray(tabelas[table])) {
      throw new Error(`Tabela obrigatoria ausente: ${table}`);
    }
  }

  return tabelas;
};

const normalizeLegacyBackupRow = (
  table: BackupTable,
  row: Record<string, unknown>,
) => {
  if (
    table === 'historico_manutencao' &&
    Object.prototype.hasOwnProperty.call(
      row,
      'direfenca_tempo_meses',
    ) &&
    !Object.prototype.hasOwnProperty.call(
      row,
      'diferenca_tempo_meses',
    )
  ) {
    return {
      ...row,
      diferenca_tempo_meses: row.direfenca_tempo_meses,
    };
  }

  return row;
};

const toSQLiteBindValue = (value: unknown): SQLiteBindValue => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value instanceof Uint8Array
  ) {
    return value;
  }

  if (value === undefined) return null;
  return String(value);
};
