/**
 * Executa a função de is maintenance overdue.
 */
export function isMaintenanceOverdue(params: {
  kmAtual: number;
  ultimaTrocaKm: number;
  intervaloKm?: number | null;
}) {
  const intervalo = Number(params.intervaloKm || 0);
  if (intervalo <= 0) return false;
  const limite = Number(params.ultimaTrocaKm || 0) + intervalo;
  return Number(params.kmAtual || 0) >= limite;
}

/**
 * Executa a função de is maintenance near due.
 */
export function isMaintenanceNearDue(params: {
  kmAtual: number;
  ultimaTrocaKm: number;
  intervaloKm?: number | null;
  thresholdKm?: number;
}) {
  const intervalo = Number(params.intervaloKm || 0);
  if (intervalo <= 0) return false;
  const limite = Number(params.ultimaTrocaKm || 0) + intervalo;
  const restante = limite - Number(params.kmAtual || 0);
  return restante > 0 && restante <= Number(params.thresholdKm ?? 500);
}

/**
 * Executa a função de is planned maintenance without history.
 */
export function isPlannedMaintenanceWithoutHistory(params: {
  origem?: string | null;
  temHistoricoReal?: number | null;
}) {
  return (
    params.origem === 'auditoria_korre' &&
    Number(params.temHistoricoReal ?? 0) === 0
  );
}

/**
 * Executa a função de should notify backup old.
 */
export function shouldNotifyBackupOld(lastBackupIso: string | null, days = 7) {
  if (!lastBackupIso) return true;
  const diff =
    (Date.now() - new Date(lastBackupIso).getTime()) / 86400000;
  return diff >= days;
}

/**
 * Executa a função de is meta hit.
 */
export function isMetaHit(totalGanhos: number, meta: number) {
  return meta > 0 && totalGanhos >= meta;
}

/**
 * Executa a função de is meta incomplete after hour.
 */
export function isMetaIncompleteAfterHour(params: {
  totalGanhos: number;
  meta: number;
  horaAtual: number;
  horaLimite?: number;
}) {
  return (
    params.meta > 0 &&
    params.totalGanhos < params.meta &&
    params.horaAtual >= Number(params.horaLimite ?? 20)
  );
}
