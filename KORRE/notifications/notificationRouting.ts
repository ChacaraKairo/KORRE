import { AppRoutes } from '../constants/routes';

/**
 * Executa a função de resolve notification destino.
 */
export function resolveNotificationDestino(destino?: string) {
  if (
    destino &&
    Object.values(AppRoutes).includes(destino as never)
  ) {
    return destino;
  }
  return AppRoutes.notificacoes;
}

/**
 * Executa a função de route requires authentication.
 */
export function routeRequiresAuthentication(destino: string) {
  return destino.startsWith('/(tabs)/') && destino !== AppRoutes.calculadora;
}
