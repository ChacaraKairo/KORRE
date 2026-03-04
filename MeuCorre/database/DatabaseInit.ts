import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('meucorre.db');

export const DatabaseInit = () => {
  try {
    // 1. Configurações Iniciais e Tabelas Base
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS perfil_usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        senha TEXT,
        foto_uri TEXT,
        meta_diaria REAL DEFAULT 0,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT CHECK(tipo IN ('moto', 'carro', 'caminhao', 'van')) NOT NULL,
        marca TEXT,
        modelo TEXT NOT NULL,
        ano INTEGER,
        motor TEXT, 
        placa TEXT NOT NULL UNIQUE,
        km_atual INTEGER DEFAULT 0,
        combustivel_padrao TEXT DEFAULT 'flex',
        ativo INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS categorias_financeiras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        tipo TEXT CHECK(tipo IN ('ganho', 'despesa')) NOT NULL,
        icone_id TEXT, 
        cor TEXT       
      );
    `);

    // 2. Tabela de Transações Financeiras (Ganhos e Gastos)
    // Aqui incluímos o veiculo_id para o rastreio
    db.execSync(`
      CREATE TABLE IF NOT EXISTS transacoes_financeiras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER, -- Pode ser NULL se for um gasto geral
        categoria_id INTEGER NOT NULL,
        descricao TEXT,
        valor REAL NOT NULL,
        data_transacao DATE DEFAULT (date('now', 'localtime')),
        tipo TEXT CHECK(tipo IN ('ganho', 'despesa')) NOT NULL,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE SET NULL,
        FOREIGN KEY (categoria_id) REFERENCES categorias_financeiras (id)
      );
    `);

    // 3. MIGRACÕES (Tratamento de colunas para apps já instalados)

    // Migração Perfil
    const colunasPerfil = [
      { nome: 'tipo_meta', def: "TEXT DEFAULT 'diaria'" },
      { nome: 'meta_semanal', def: 'REAL DEFAULT 0' },
    ];

    colunasPerfil.forEach((col) => {
      try {
        db.execSync(
          `ALTER TABLE perfil_usuario ADD COLUMN ${col.nome} ${col.def};`,
        );
        console.log(
          `[MIGRAÇÃO] Coluna ${col.nome} adicionada ao perfil.`,
        );
      } catch (e) {
        /* Coluna já existe */
      }
    });

    // Migração Transações (Caso você já tivesse a tabela sem o veiculo_id)
    try {
      db.execSync(
        'ALTER TABLE transacoes_financeiras ADD COLUMN veiculo_id INTEGER;',
      );
      console.log(
        '[MIGRAÇÃO] Coluna veiculo_id adicionada às transações.',
      );
    } catch (e) {
      /* Coluna já existe */
    }

    // 4. Manutenção (Garante que a tabela de manutenção existe)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS registros_manutencao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        descricao TEXT NOT NULL,
        valor REAL DEFAULT 0,
        km_no_servico INTEGER,
        data_servico DATE DEFAULT (date('now', 'localtime')),
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
      );
    `);

    console.log(
      '[BANCO] Sistema pronto e vinculado aos veículos.',
    );
  } catch (error) {
    console.error(
      '[ERRO] Falha crítica na inicialização do banco:',
      error,
    );
  }
};

export default db;
