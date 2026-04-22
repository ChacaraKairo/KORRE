// database/repositories/FinanceiroRepository.ts
import db from '../DatabaseInit';

export const FinanceiroRepository = {
  getResumoPorPeriodo: async (
    veiculoId: number,
    dataInicio: string,
    tipo: 'ganho' | 'despesa',
  ) => {
    const query = `
      SELECT SUM(valor) as total, COUNT(*) as qtd 
      FROM transacoes_financeiras 
      WHERE tipo = ? AND veiculo_id = ? AND data_transacao >= ?
    `;
    return await db.getFirstAsync<{
      total: number;
      qtd: number;
    }>(query, [tipo, veiculoId, dataInicio]);
  },

  getUltimasMovimentacoes: async (limit = 5) => {
    return await db.getAllAsync<any>(
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
