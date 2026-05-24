import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AppRoutes } from '../constants/routes';
import {
  resolveNotificationDestino,
  routeRequiresAuthentication,
} from '../notifications/notificationRouting';

describe('notification routing', () => {
  it('notificacao sem destino cai em AppRoutes.notificacoes', () => {
    assert.equal(
      resolveNotificationDestino(undefined),
      AppRoutes.notificacoes,
    );
    assert.equal(
      resolveNotificationDestino('/rota-inexistente'),
      AppRoutes.notificacoes,
    );
  });

  it('notificacao com destino valido usa rota correta', () => {
    assert.equal(
      resolveNotificationDestino(AppRoutes.finance),
      AppRoutes.finance,
    );
  });

  it('identifica rotas privadas', () => {
    assert.equal(routeRequiresAuthentication(AppRoutes.dashboard), true);
    assert.equal(routeRequiresAuthentication(AppRoutes.calculadora), false);
  });
});
