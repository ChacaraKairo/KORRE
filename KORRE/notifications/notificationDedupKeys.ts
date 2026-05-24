/**
 * Executa a função de iso day.
 */
function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Executa a função de iso month.
 */
function isoMonth(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

/**
 * Executa a função de iso week.
 */
function isoWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Executa a função de build daily dedup key.
 */
export function buildDailyDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${isoDay()}`;
}

/**
 * Executa a função de build weekly dedup key.
 */
export function buildWeeklyDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${isoWeek()}`;
}

/**
 * Executa a função de build monthly dedup key.
 */
export function buildMonthlyDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${isoMonth()}`;
}

/**
 * Executa a função de build maintenance dedup key.
 */
export function buildMaintenanceDedupKey(
  itemId: number,
  status: string,
  kmLimite?: number,
): string {
  return `manutencao_${status}:${itemId}:${kmLimite ?? 'sem_limite'}`;
}

/**
 * Executa a função de build timestamp dedup key.
 */
export function buildTimestampDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${Date.now()}`;
}
