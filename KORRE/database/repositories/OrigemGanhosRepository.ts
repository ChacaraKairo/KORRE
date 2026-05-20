import db from '../DatabaseInit';
import type { CategoriaFinanceira } from '../../types/database';

export interface OrigemGanho {
  id: number;
  nome: string;
  categoria: string;
  cor: string;
  icone: string;
  ativo: number;
}

export type NovaOrigemGanho = Omit<OrigemGanho, 'id' | 'ativo'>;

const ORIGENS_PADRAO: NovaOrigemGanho[] = [
  {
    nome: 'iFood',
    categoria: 'Delivery',
    cor: '#EA1D2C',
    icone: 'ShoppingBag',
  },
  {
    nome: 'Uber',
    categoria: 'Transporte',
    cor: '#000000',
    icone: 'Navigation',
  },
  {
    nome: '99',
    categoria: 'Transporte',
    cor: '#FFCC00',
    icone: 'Smartphone',
  },
  {
    nome: 'Loggi',
    categoria: 'Logistica',
    cor: '#00B5E2',
    icone: 'Package',
  },
  {
    nome: 'Lalamove',
    categoria: 'Logistica',
    cor: '#EA5B0C',
    icone: 'Truck',
  },
  {
    nome: 'Rappi',
    categoria: 'Delivery',
    cor: '#FF441F',
    icone: 'ShoppingBag',
  },
  {
    nome: 'Ze Delivery',
    categoria: 'Bebidas',
    cor: '#FFD700',
    icone: 'Zap',
  },
  {
    nome: 'Particulares',
    categoria: 'Fixo / Extra',
    cor: '#00C853',
    icone: 'Briefcase',
  },
  {
    nome: 'InDrive',
    categoria: 'Transporte',
    cor: '#8BC34A',
    icone: 'Car',
  },
  {
    nome: 'Uber Eats',
    categoria: 'Delivery',
    cor: '#06C167',
    icone: 'ShoppingBag',
  },
  {
    nome: 'Mercado Livre Envios',
    categoria: 'Logistica',
    cor: '#FFE600',
    icone: 'Package',
  },
  {
    nome: 'Shopee Entregas',
    categoria: 'Logistica',
    cor: '#EE4D2D',
    icone: 'Package',
  },
  {
    nome: 'Amazon Flex',
    categoria: 'Logistica',
    cor: '#FF9900',
    icone: 'Package',
  },
  {
    nome: 'Borzo',
    categoria: 'Logistica',
    cor: '#00AEEF',
    icone: 'Zap',
  },
  {
    nome: 'Cabify',
    categoria: 'Transporte',
    cor: '#7145D6',
    icone: 'Car',
  },
  {
    nome: 'Wappa',
    categoria: 'Transporte',
    cor: '#1976D2',
    icone: 'Car',
  },
  {
    nome: 'Taxi / Local',
    categoria: 'Transporte',
    cor: '#FFC107',
    icone: 'Car',
  },
  {
    nome: 'Frete particular',
    categoria: 'Logistica',
    cor: '#00C853',
    icone: 'Truck',
  },
];

export const OrigemGanhosRepository = {
  ensureSchema: async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS origens_ganho_usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL,
        categoria TEXT,
        icone TEXT,
        cor TEXT,
        ativo INTEGER NOT NULL DEFAULT 0
      );
    `);

    for (const origem of ORIGENS_PADRAO) {
      await db.runAsync(
        `INSERT OR IGNORE INTO origens_ganho_usuario
          (nome, categoria, icone, cor, ativo)
         VALUES (?, ?, ?, ?, 0)`,
        [
          origem.nome,
          origem.categoria,
          origem.icone,
          origem.cor,
        ],
      );
    }
  },

  listarOrigens: async () => {
    await OrigemGanhosRepository.ensureSchema();
    return db.getAllAsync<OrigemGanho>(
      `SELECT id, nome, categoria, icone, cor, ativo
       FROM origens_ganho_usuario
       ORDER BY id ASC`,
    );
  },

  salvarOrigemCustomizada: async (origem: NovaOrigemGanho) => {
    await OrigemGanhosRepository.ensureSchema();
    await db.runAsync(
      `INSERT OR IGNORE INTO origens_ganho_usuario
        (nome, categoria, icone, cor, ativo)
       VALUES (?, ?, ?, ?, 1)`,
      [origem.nome, origem.categoria, origem.icone, origem.cor],
    );
    await db.runAsync(
      `UPDATE origens_ganho_usuario
       SET categoria = ?, icone = ?, cor = ?, ativo = 1
       WHERE nome = ?`,
      [origem.categoria, origem.icone, origem.cor, origem.nome],
    );
  },

  salvarSelecionadas: async (idsSelecionados: number[]) => {
    await OrigemGanhosRepository.ensureSchema();
    const ids = new Set(idsSelecionados);
    const origens = await OrigemGanhosRepository.listarOrigens();

    await db.execAsync('BEGIN TRANSACTION;');
    try {
      await db.runAsync(
        'UPDATE origens_ganho_usuario SET ativo = 0',
      );

      for (const origem of origens) {
        if (!ids.has(origem.id)) continue;

        await db.runAsync(
          `UPDATE origens_ganho_usuario
           SET ativo = 1
           WHERE id = ?`,
          [origem.id],
        );

        await db.runAsync(
          `INSERT OR IGNORE INTO categorias_financeiras
            (nome, tipo, icone, cor)
           VALUES (?, 'ganho', ?, ?)`,
          [origem.nome, origem.icone, origem.cor],
        );
      }

      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  },

  listarCategoriasGanhoAtivas: async () => {
    await OrigemGanhosRepository.ensureSchema();
    return db.getAllAsync<CategoriaFinanceira>(
      `SELECT c.id, c.nome, c.tipo, c.icone, c.cor
       FROM categorias_financeiras c
       INNER JOIN origens_ganho_usuario o
         ON o.nome = c.nome
        AND o.ativo = 1
       WHERE c.tipo = 'ganho'
       ORDER BY o.id ASC`,
    );
  },
};
