import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('meucorre.db');

export const DatabaseInit = () => {
  try {
    // Execução limpa: Cria as tabelas do zero com a estrutura completa
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS perfil_usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE,
        cpf TEXT UNIQUE,
        senha TEXT,
        foto_uri TEXT,
        meta_diaria REAL DEFAULT 0,
        tipo_meta TEXT DEFAULT 'diaria', 
        meta_semanal REAL DEFAULT 0,     
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT CHECK(tipo IN ('moto', 'carro', 'caminhao', 'van', 'bicicleta', 'carro_eletrico')) NOT NULL,
        marca TEXT,
        modelo TEXT NOT NULL,
        ano INTEGER,
        motor TEXT, 
        placa TEXT NOT NULL UNIQUE,
        km_atual INTEGER DEFAULT 0,
        combustivel_padrao TEXT DEFAULT 'flex',
        id_user INTEGER,
        ativo INTEGER DEFAULT 0,
        custo_km_calculado REAL DEFAULT 0,
        custo_minuto_calculado REAL DEFAULT 0,
        meta_ganho_minuto_calculado REAL DEFAULT 0,
        taxa_completude REAL DEFAULT 0,
        FOREIGN KEY (id_user) REFERENCES perfil_usuario (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS parametros_financeiros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER UNIQUE NOT NULL,
        estado_uf TEXT DEFAULT 'SP',
        tipo_aquisicao TEXT DEFAULT 'proprio_quitado',
        valor_veiculo_fipe REAL,
        depreciacao_real_estimada REAL,
        custo_oportunidade_selic REAL,
        juros_financiamento_mensal REAL,
        diaria_aluguel REAL,
        caucao_aluguel_mensalizado REAL,
        taxa_administracao_consorcio REAL,
        custo_reparacao_emprestimo REAL,
        ipva_anual REAL,
        licenciamento_detran_anual REAL,
        imposto_mei_mensal REAL,
        imposto_renda_mensal REAL,
        taxa_vistoria_gnv_anual REAL,
        taxas_alvaras_municipais_anual REAL,
        seguro_comercial_anual REAL,
        rastreador_telemetria_mensal REAL,
        plano_dados_mensal REAL,
        rendimento_energia_unidade REAL,
        preco_energia_unidade REAL,
        valor_oleo_filtros REAL,
        intervalo_oleo_filtros_km REAL,
        valor_jogo_pneus REAL,
        durabilidade_pneus_km REAL,
        valor_manutencao_freios REAL,
        intervalo_freios_km REAL,
        valor_kit_transmissao REAL,
        durabilidade_transmissao_km REAL,
        fundo_depreciacao_bateria_por_km REAL,
        manutencao_imprevista_mensal REAL,
        limpeza_higienizacao_mensal REAL,
        alimentacao_diaria REAL,
        consumo_apoio_diario REAL,
        plano_saude_mensal REAL,
        fundo_emergencia_percentual REAL,
        provisao_ferias_mensal REAL,
        provisao_decimo_terceiro_mensal REAL,
        salario_liquido_mensal_desejado REAL,
        valor_smartphone REAL,
        vida_util_smartphone_meses REAL,
        custo_powerbanks_cabos_mensal REAL,
        custo_suportes_capas_mensal REAL,
        custo_bag_mochila_mensal REAL,
        custo_vestuario_protecao_mensal REAL,
        percentual_dead_miles REAL,
        tempo_espera_medio_minutos REAL,
        taxas_saque_antecipacao_mensal REAL,
        provisao_multas_mensal REAL,
        dias_trabalhados_semana REAL,
        horas_por_dia REAL,
        km_por_dia REAL,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS categorias_financeiras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        tipo TEXT CHECK(tipo IN ('ganho', 'despesa')) NOT NULL,
        icone_id TEXT, 
        cor TEXT       
      );

      CREATE TABLE IF NOT EXISTS transacoes_financeiras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER,
        categoria_id INTEGER NOT NULL,
        descricao TEXT,
        valor REAL NOT NULL,
        data_transacao DATE DEFAULT (date('now', 'localtime')),
        tipo TEXT CHECK(tipo IN ('ganho', 'despesa')) NOT NULL,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE SET NULL,
        FOREIGN KEY (categoria_id) REFERENCES categorias_financeiras (id)
      );

      CREATE TABLE IF NOT EXISTS itens_manutencao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        icone TEXT DEFAULT 'Wrench',
        ultima_troca_km INTEGER NOT NULL DEFAULT 0,
        intervalo_km INTEGER,
        ultima_troca_data DATE DEFAULT (date('now', 'localtime')),
        intervalo_meses INTEGER,
        criticidade TEXT CHECK(criticidade IN ('baixa', 'media', 'alta')) DEFAULT 'media',
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS historico_manutencao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        item_id INTEGER, 
        descricao TEXT NOT NULL,
        valor REAL DEFAULT 0,
        km_servico INTEGER NOT NULL,
        direfenca_tempo_meses INTEGER,
        data_servico DATE DEFAULT (date('now', 'localtime')),
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES itens_manutencao (id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS notificacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        tipo TEXT DEFAULT 'info',
        lida INTEGER DEFAULT 0,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(
      '[BANCO] Estrutura inicializada com sucesso.',
    );
  } catch (error) {
    console.error(
      '[ERRO] Falha na inicialização do banco:',
      error,
    );
  }
};

export default db;
