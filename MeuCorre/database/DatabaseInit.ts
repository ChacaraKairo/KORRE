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
        tipo TEXT CHECK(tipo IN ('moto', 'carro', 'caminhao', 'van', 'bicicleta')) NOT NULL,
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

    // 2. Tabela de Transações Financeiras
    db.execSync(`
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
    `);

    // 3. MIGRACÕES
    const colunasPerfil = [
      { nome: 'tipo_meta', def: "TEXT DEFAULT 'diaria'" },
      { nome: 'meta_semanal', def: 'REAL DEFAULT 0' },
    ];

    colunasPerfil.forEach((col) => {
      try {
        db.execSync(
          `ALTER TABLE perfil_usuario ADD COLUMN ${col.nome} ${col.def};`,
        );
      } catch (e) {
        /* Coluna já existe */
      }
    });

    // 4. NOVA ESTRUTURA DE MANUTENÇÃO (Oficina)
    db.execSync(`
      -- A. Tabela para os Itens de Manutenção (O que deve ser acompanhado: Óleo, Pneu, etc)
      CREATE TABLE IF NOT EXISTS itens_manutencao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        icone TEXT DEFAULT 'Wrench',
        ultima_troca_km INTEGER NOT NULL DEFAULT 0,
        intervalo_km INTEGER NOT NULL,
        criticidade TEXT CHECK(criticidade IN ('baixa', 'media', 'alta')) DEFAULT 'media',
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
      );

      -- B. Tabela para o Histórico de Serviços (Quando foi trocado, quanto custou)
      CREATE TABLE IF NOT EXISTS historico_manutencao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        item_id INTEGER, -- Ligação à peça trocada (Pode ser nulo se for um conserto avulso/inesperado)
        descricao TEXT NOT NULL,
        valor REAL DEFAULT 0,
        km_servico INTEGER NOT NULL,
        data_servico DATE DEFAULT (date('now', 'localtime')),
        FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES itens_manutencao (id) ON DELETE SET NULL
      );
    `);

    console.log('[BANCO] Tabelas prontas.');
  } catch (error) {
    console.error(
      '[ERRO] Falha crítica na inicialização do banco:',
      error,
    );
  }
};

export default db;
