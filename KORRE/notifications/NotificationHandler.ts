import Constants from 'expo-constants';
import { router } from 'expo-router';
import { AppRoutes } from '../constants/routes';
import { handleRemoteCommand } from './RemoteCommandHandler';
import { getAuthSessionUserId } from '../utils/auth/authSession';
import {
  resolveNotificationDestino,
  routeRequiresAuthentication,
} from './notificationRouting';

const isExpoGo = Constants.appOwnership === 'expo';
const remoteCommandsEnabled =
  process.env.EXPO_PUBLIC_KORRE_ENABLE_REMOTE_COMMANDS === 'true';

export const NotificationHandler = {
  setupForegroundHandler: async () => {
    if (isExpoGo) return;

    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  },
  listenToReceived: async () => {
    if (isExpoGo) return { remove: () => undefined };

    const Notifications = await import('expo-notifications');
    return Notifications.addNotificationReceivedListener(
      async (notification) => {
        const data = notification.request.content.data;
        if (data?.kind === 'command' && remoteCommandsEnabled) {
          await handleRemoteCommand(data);
        }
      },
    );
  },
  listenToClicks: async () => {
    if (isExpoGo) return { remove: () => undefined };

    const Notifications = await import('expo-notifications');
    return Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const data = response.notification.request.content.data;

        if (data?.kind === 'command' && remoteCommandsEnabled) {
          await handleRemoteCommand(data);
          return;
        }

        const destino =
          typeof data?.destino === 'string'
            ? resolveNotificationDestino(data.destino)
            : AppRoutes.notificacoes;
        const isAuthenticated = getAuthSessionUserId() !== null;
        const routeRequiresAuth =
          routeRequiresAuthentication(destino);

        if (!isAuthenticated && routeRequiresAuth) {
          router.push(AppRoutes.login);
          return;
        }

        router.push(destino as never);
      },
    );
  },
};
