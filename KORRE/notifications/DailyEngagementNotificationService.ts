import Constants from 'expo-constants';
import type { NotificationTriggerInput } from 'expo-notifications';
import { AppRoutes } from '../constants/routes';
import db from '../database/DatabaseInit';
import i18n, { i18nReady } from '../locales/i18n';
import { solicitarPermissaoNotificacoes } from './NotificationService';
import { NotificationPreferencesService } from './NotificationPreferencesService';

type ExpoNotifications = typeof import('expo-notifications');

const isExpoGo = Constants.appOwnership === 'expo';
const DAILY_NOTIFICATION_ID_KEY =
  'notificacao_diaria_engajamento_id';
const DAILY_NOTIFICATION_LANGUAGE_KEY =
  'notificacao_diaria_engajamento_idioma';
const DAILY_HOUR = 12;
const DAILY_MINUTE = 30;

const carregarNotifications =
  async (): Promise<ExpoNotifications | null> => {
    if (isExpoGo) return null;
    return import('expo-notifications');
  };

const getConfig = async (key: string) => {
  const row = await db.getFirstAsync<{ valor: string }>(
    'SELECT valor FROM configuracoes_app WHERE chave = ? LIMIT 1',
    [key],
  );
  return row?.valor ?? null;
};

const setConfig = async (key: string, value: string) => {
  await db.runAsync(
    'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
    [key, value],
  );
};

async function cancelarAgendamentoExistente(
  Notifications: ExpoNotifications,
) {
  const scheduledId = await getConfig(DAILY_NOTIFICATION_ID_KEY);
  if (!scheduledId) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(scheduledId);
  } catch {
    // O agendamento pode ter sido removido pelo sistema; basta recriar.
  }
}

export async function configurarNotificacaoDiaria() {
  const Notifications = await carregarNotifications();
  if (!Notifications) return;

  const usoAppAtivo =
    await NotificationPreferencesService.isGroupEnabled('uso_app');
  if (!usoAppAtivo) {
    await cancelarAgendamentoExistente(Notifications);
    await setConfig(DAILY_NOTIFICATION_ID_KEY, '');
    return;
  }

  const podeNotificar = await solicitarPermissaoNotificacoes();
  if (!podeNotificar) return;

  await i18nReady;
  await cancelarAgendamentoExistente(Notifications);

  const trigger: NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: DAILY_HOUR,
    minute: DAILY_MINUTE,
  };

  const scheduledId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.daily.title'),
        body: i18n.t('notifications.daily.body'),
        data: {
          tipo: 'uso_app',
          prioridade: 'baixa',
          canal: 'local',
          origem: 'local',
          destino: AppRoutes.dashboard,
          dedupKey: 'daily_engagement',
        },
        sound: true,
      },
      trigger,
    });

  await setConfig(DAILY_NOTIFICATION_ID_KEY, scheduledId);
  await setConfig(
    DAILY_NOTIFICATION_LANGUAGE_KEY,
    i18n.language ?? 'pt',
  );
}
