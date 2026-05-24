import { AppRoutes } from '../constants/routes';

export function resolveNotificationDestino(destino?: string) {
  if (
    destino &&
    Object.values(AppRoutes).includes(destino as never)
  ) {
    return destino;
  }
  return AppRoutes.notificacoes;
}

export function routeRequiresAuthentication(destino: string) {
  return destino.startsWith('/(tabs)/') && destino !== AppRoutes.calculadora;
}
