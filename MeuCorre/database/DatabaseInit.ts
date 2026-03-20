import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('meucorre.db');

export const DatabaseInit = () => {
  try {
    // Criação de todas as tabelas e colunas atualizadas numa única execução
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS perfil_usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        senha TEXT,
        foto_uri TEXT,
        meta_diaria REAL DEFAULT 0,
        tipo_meta TEXT DEFAULT 'diaria', 
        meta_semanal REAL DEFAULT 0,     
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT CHECK(tipo IN ('moto', 'carro', 'caminhao', 'van', 'bicicleta')) NOT NULL,
        marca TEXT,
        modelo TEXT NOT NULL,
        ano INTEGER,
        motor TEXT, 
        placa TEXT NOT NULL UNIQUE,
        km_atual INTEGER DEFAULT 0,
        combustivel_padrao TEXT DEFAULT 'flex',
        id_user INTEGER,
        ativo INTEGER DEFAULT 0,
        FOREIGN KEY (id_user) REFERENCES perfil_usuario (id) ON DELETE CASCADE
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

    // --- MIGRAÇÃO SEGURA PARA ADICIONAR COLUNAS EM TABELAS EXISTENTES ---
    try {
      db.execSync(
        `ALTER TABLE itens_manutencao ADD COLUMN ultima_troca_data DATE DEFAULT (date('now', 'localtime'));`,
      );
    } catch (e) {
      /* Ignora se a coluna já existir */
    }

    try {
      db.execSync(
        `ALTER TABLE itens_manutencao ADD COLUMN intervalo_meses INTEGER;`,
      );
    } catch (e) {
      /* Ignora se a coluna já existir */
    }

    console.log(
      '[BANCO] Esquema de tabelas criado/verificado com sucesso.',
    );
  } catch (error) {
    console.error(
      '[ERRO] Falha crítica na inicialização do banco:',
      error,
    );
  }
};

export default db;
