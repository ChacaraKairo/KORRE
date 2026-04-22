import * as SQLite from 'expo-sqlite';
import { SelicService } from '../utils/SelicService'; // Certifique-se de que o caminho está correto

// Nome do banco consistente com o projeto
const db = SQLite.openDatabaseSync('meucorre.db');

// Versão inicial consolidada
const DATABASE_VERSION = 1;

export const DatabaseInit = () => {
  try {
    let { user_version: currentDbVersion } =
      db.getFirstSync<{ user_version: number }>(
        'PRAGMA user_version;',
      ) ?? { user_version: 0 };

    console.log(
      `[BANCO] Versão atual: ${currentDbVersion} | Versão alvo: ${DATABASE_VERSION}`,
    );

    // Ativa performance e integridade
    db.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

    if (currentDbVersion < DATABASE_VERSION) {
      console.log(
        '[BANCO] Criando tabelas do ecossistema MeuCorre...',
      );
      initV1();

      db.execSync(
        `PRAGMA user_version = ${DATABASE_VERSION};`,
      );
      console.log(
        `[BANCO] V${DATABASE_VERSION} inicializada com sucesso.`,
      );
    }

    // DISPARO AUTOMÁTICO: Verifica a Selic sempre que o app inicia (Lógica de dia 1 está no Service)
    SelicService.validarEAtualizarSelic();
  } catch (error) {
    console.error(
      '[ERRO] Falha crítica na inicialização do SQLite:',
      error,
    );
  }
};

const initV1 = () => {
  db.execSync(`
    -- 1. CONFIGURAÇÕES DO APP (Selic, Versões de Dados, etc)
    CREATE TABLE IF NOT EXISTS configuracoes_app (
      chave TEXT PRIMARY KEY,
      valor TEXT
    );

    INSERT OR IGNORE INTO configuracoes_app (chave, valor) VALUES ('taxa_selic_atual', '14.75');

    -- 2. PERFIL DO USUÁRIO
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

    -- 3. VEÍCULOS (Com campos de cache para os Índices Mágicos)
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

    -- 4. PARÂMETROS FINANCEIROS (Inputs da Calculadora)
    CREATE TABLE IF NOT EXISTS parametros_financeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      veiculo_id INTEGER UNIQUE NOT NULL,
      estado_uf TEXT DEFAULT 'SP',
      tipo_aquisicao TEXT DEFAULT 'proprio_quitado',
      valor_veiculo_fipe REAL DEFAULT 0,
      depreciacao_real_estimada REAL DEFAULT 0,
      custo_oportunidade_selic REAL DEFAULT 0,
      juros_financiamento_mensal REAL DEFAULT 0,
      diaria_aluguel REAL DEFAULT 0,
      caucao_aluguel_mensalizado REAL DEFAULT 0,
      taxa_administracao_consorcio REAL DEFAULT 0,
      custo_reparacao_emprestimo REAL DEFAULT 0,
      ipva_anual REAL DEFAULT 0,
      licenciamento_detran_anual REAL DEFAULT 0,
      imposto_mei_mensal REAL DEFAULT 0,
      imposto_renda_mensal REAL DEFAULT 0,
      taxa_vistoria_gnv_anual REAL DEFAULT 0,
      taxas_alvaras_municipais_anual REAL DEFAULT 0,
      seguro_comercial_anual REAL DEFAULT 0,
      rastreador_telemetria_mensal REAL DEFAULT 0,
      plano_dados_mensal REAL DEFAULT 0,
      rendimento_energia_unidade REAL DEFAULT 0, 
      preco_energia_unidade REAL DEFAULT 0,
      valor_oleo_filtros REAL DEFAULT 0,
      intervalo_oleo_filtros_km REAL DEFAULT 0,
      valor_jogo_pneus REAL DEFAULT 0,
      durabilidade_pneus_km REAL DEFAULT 0,
      valor_manutencao_freios REAL DEFAULT 0,
      intervalo_freios_km REAL DEFAULT 0,
      valor_kit_transmissao REAL DEFAULT 0,
      durabilidade_transmissao_km REAL DEFAULT 0,
      fundo_depreciacao_bateria_por_km REAL DEFAULT 0,
      manutencao_imprevista_mensal REAL DEFAULT 0,
      limpeza_higienizacao_mensal REAL DEFAULT 0,
      alimentacao_diaria REAL DEFAULT 0,
      consumo_apoio_diario REAL DEFAULT 0,
      plano_saude_mensal REAL DEFAULT 0,
      fundo_emergencia_percentual REAL DEFAULT 0,
      provisao_ferias_mensal REAL DEFAULT 0,
      provisao_decimo_terceiro_mensal REAL DEFAULT 0,
      salario_liquido_mensal_desejado REAL DEFAULT 0,
      valor_smartphone REAL DEFAULT 0,
      vida_util_smartphone_meses REAL DEFAULT 0,
      custo_powerbanks_cabos_mensal REAL DEFAULT 0,
      custo_suportes_capas_mensal REAL DEFAULT 0,
      custo_bag_mochila_mensal REAL DEFAULT 0,
      custo_vestuario_protecao_mensal REAL DEFAULT 0,
      percentual_dead_miles REAL DEFAULT 0,
      tempo_espera_medio_minutos REAL DEFAULT 0,
      taxas_saque_antecipacao_mensal REAL DEFAULT 0,
      provisao_multas_mensal REAL DEFAULT 0,
      dias_trabalhados_semana REAL DEFAULT 0,
      horas_por_dia REAL DEFAULT 0,
      km_por_dia REAL DEFAULT 0,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
    );

    -- 5. CATEGORIAS FINANCEIRAS
    CREATE TABLE IF NOT EXISTS categorias_financeiras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      tipo TEXT CHECK(tipo IN ('ganho', 'despesa')) NOT NULL,
      icone TEXT,
      cor TEXT       
    );

    -- 6. TRANSAÇÕES FINANCEIRAS
    CREATE TABLE IF NOT EXISTS transacoes_financeiras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      veiculo_id INTEGER,
      categoria_id INTEGER NOT NULL,
      descricao TEXT,
      valor REAL NOT NULL,
      data_transacao DATETIME DEFAULT (datetime('now', 'localtime')), 
      tipo TEXT CHECK(tipo IN ('ganho', 'despesa')) NOT NULL,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE SET NULL,
      FOREIGN KEY (categoria_id) REFERENCES categorias_financeiras (id)
    );

    -- 7. ITENS DE MANUTENÇÃO (REVISÃO)
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

    -- 8. HISTÓRICO DE SERVIÇOS
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

    -- 9. SISTEMA DE NOTIFICAÇÕES
    CREATE TABLE IF NOT EXISTS notificacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      tipo TEXT DEFAULT 'info',
      lida INTEGER DEFAULT 0,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- INSERÇÃO DE CATEGORIAS PADRÃO
    INSERT OR IGNORE INTO categorias_financeiras (nome, tipo, icone, cor) VALUES 
    ('Combustível', 'despesa', 'Fuel', '#EF4444'),
    ('Manutenção', 'despesa', 'Wrench', '#F59E0B'),
    ('Alimentação', 'despesa', 'Utensils', '#3B82F6'),
    ('Outros Ganhos', 'ganho', 'PlusCircle', '#00C853'),
    ('Outras Despesas', 'despesa', 'MinusCircle', '#6B7280');
  `);
};

export default db;
