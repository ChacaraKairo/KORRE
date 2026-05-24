import db from '../../database/DatabaseInit';

export const KM_ALERTA_MANUTENCAO = 500;
export const DIAS_SEM_LANCAMENTO = 3;
export const DIAS_BACKUP_ALERTA = 7;
export const HORARIO_ALERTA_META = 20;
export const DIA_VENCIMENTO_DAS = 20;

/**
 * Executa a função de get today.
 */
export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Executa a função de get year week.
 */
export function getYearWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - start.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/**
 * Executa a função de get year month.
 */
export function getYearMonth(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

/**
 * Executa a função de get veiculo ativo.
 */
export async function getVeiculoAtivo() {
  return db.getFirstAsync<{
    id: number;
    km_atual: number;
    custo_km_calculado: number | null;
    custo_minuto_calculado: number | null;
    meta_ganho_minuto_calculado: number | null;
    taxa_completude: number | null;
  }>(
    `SELECT id, km_atual, custo_km_calculado, custo_minuto_calculado,
            meta_ganho_minuto_calculado, taxa_completude
     FROM veiculos
     WHERE ativo = 1
     LIMIT 1`,
  );
}
