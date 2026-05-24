import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isMaintenanceNearDue,
  isMaintenanceOverdue,
  isMetaHit,
  isMetaIncompleteAfterHour,
  isPlannedMaintenanceWithoutHistory,
  shouldNotifyBackupOld,
} from '../notifications/notificationRules';

describe('notification rules', () => {
  it('identifica manutencao proxima do vencimento', () => {
    assert.equal(
      isMaintenanceNearDue({
        kmAtual: 9550,
        ultimaTrocaKm: 5000,
        intervaloKm: 5000,
        thresholdKm: 500,
      }),
      true,
    );
  });

  it('identifica manutencao vencida', () => {
    assert.equal(
      isMaintenanceOverdue({
        kmAtual: 10100,
        ultimaTrocaKm: 5000,
        intervaloKm: 5000,
      }),
      true,
    );
  });

  it('item planejado nao deve ser tratado como historico real', () => {
    assert.equal(
      isPlannedMaintenanceWithoutHistory({
        origem: 'auditoria_korre',
        temHistoricoReal: 0,
      }),
      true,
    );
  });

  it('detecta backup pendente/antigo', () => {
    assert.equal(shouldNotifyBackupOld(null, 7), true);
    const recent = new Date();
    recent.setDate(recent.getDate() - 1);
    assert.equal(shouldNotifyBackupOld(recent.toISOString(), 7), false);
  });

  it('meta batida e meta incompleta', () => {
    assert.equal(isMetaHit(200, 150), true);
    assert.equal(
      isMetaIncompleteAfterHour({
        totalGanhos: 100,
        meta: 200,
        horaAtual: 21,
        horaLimite: 20,
      }),
      true,
    );
  });
});
