// database/repositories/FinanceiroRepository.ts
import db from '../DatabaseInit';
import type {
  CategoriaFinanceira,
  MovimentacaoFinanceira,
  TipoTransacao,
} from '../../types/database';
import { OrigemGanhosRepository } from './OrigemGanhosRepository';

export const FinanceiroRepository = {
  listarCategoriasFinanceirasPorTipo: async (
    tipo: TipoTransacao,
  ) => {
    if (tipo === 'ganho') {
      return OrigemGanhosRepository.listarCategoriasGanhoAtivas();
    }

    return db.getAllAsync<CategoriaFinanceira>(
      `SELECT id, nome, tipo, icone, cor
       FROM categorias_financeiras
       WHERE tipo = ?
       ORDER BY nome ASC`,
      [tipo],
    );
  },

  getResumoPorPeriodo: async (
    veiculoId: number,
    dataInicio: string,
    tipo: TipoTransacao,
    dataFim?: string,
  ) => {
    const filtros = [
      'tipo = ?',
      'veiculo_id = ?',
      'data_transacao >= ?',
    ];
    const params: (string | number)[] = [
      tipo,
      veiculoId,
      dataInicio,
    ];

    if (dataFim) {
      filtros.push('data_transacao < ?');
      params.push(dataFim);
    }

    const query = `
      SELECT SUM(valor) as total, COUNT(*) as qtd 
      FROM transacoes_financeiras 
      WHERE ${filtros.join(' AND ')}
    `;
    return await db.getFirstAsync<{
      total: number;
      qtd: number;
    }>(query, params);
  },

  getUltimasMovimentacoes: async (limit = 5) => {
    return await db.getAllAsync<MovimentacaoFinanceira>(
      `
      SELECT t.id, t.tipo, t.valor, c.nome as categoria, strftime('%H:%M', t.data_transacao) as hora 
      FROM transacoes_financeiras t
      LEFT JOIN categorias_financeiras c ON t.categoria_id = c.id
      ORDER BY t.data_transacao DESC, t.id DESC 
      LIMIT ?`,
      [limit],
    );
  },
};
