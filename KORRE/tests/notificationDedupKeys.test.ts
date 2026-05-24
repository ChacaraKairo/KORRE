import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildDailyDedupKey,
  buildMaintenanceDedupKey,
  buildMonthlyDedupKey,
  buildTimestampDedupKey,
  buildWeeklyDedupKey,
} from '../notifications/notificationDedupKeys';

describe('notification dedup keys', () => {
  it('gera chaves diaria/semanal/mensal', () => {
    assert.ok(buildDailyDedupKey('meta').startsWith('meta:'));
    assert.ok(buildWeeklyDedupKey('meta').includes('-W'));
    assert.ok(buildMonthlyDedupKey('meta').match(/\d{4}-\d{2}$/));
  });

  it('gera chave de manutencao com item e limite', () => {
    assert.equal(
      buildMaintenanceDedupKey(10, 'vencida', 40000),
      'manutencao_vencida:10:40000',
    );
  });

  it('gera chave por timestamp para eventos unicos', () => {
    const key = buildTimestampDedupKey('auditoria', 1);
    assert.ok(key.startsWith('auditoria:1:'));
  });
});
