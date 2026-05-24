function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function isoMonth(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

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

export function buildDailyDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${isoDay()}`;
}

export function buildWeeklyDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${isoWeek()}`;
}

export function buildMonthlyDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${isoMonth()}`;
}

export function buildMaintenanceDedupKey(
  itemId: number,
  status: string,
  kmLimite?: number,
): string {
  return `manutencao_${status}:${itemId}:${kmLimite ?? 'sem_limite'}`;
}

export function buildTimestampDedupKey(
  tipo: string,
  id?: string | number,
): string {
  return `${tipo}:${id ?? 'global'}:${Date.now()}`;
}
