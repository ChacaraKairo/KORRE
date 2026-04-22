import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export const NotificationHandler = {
  setupForegroundHandler: () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  },
  listenToClicks: () => {
    return Notifications.addNotificationResponseReceivedListener(
      (response) => {
        router.push('/notificacoes');
      },
    );
  },
};
