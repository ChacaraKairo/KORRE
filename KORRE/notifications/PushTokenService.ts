import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import db, { DATABASE_VERSION } from '../database/DatabaseInit';
import { solicitarPermissaoNotificacoes } from './NotificationService';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_KORRE_API_BASE_URL ?? '';
const isExpoGo = Constants.appOwnership === 'expo';

/**
 * Executa a função de obter expo push token.
 */
export async function obterExpoPushToken() {
  if (isExpoGo) return null;

  const permitido = await solicitarPermissaoNotificacoes();
  if (!permitido) return null;

  const Notifications = await import('expo-notifications');
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  const token = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );

  await db.runAsync(
    'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
    ['expo_push_token', token.data],
  );

  return token.data;
}

/**
 * Executa a função de registrar dispositivo no servidor.
 */
export async function registrarDispositivoNoServidor() {
  const expoPushToken = await obterExpoPushToken();
  if (!expoPushToken || !API_BASE_URL) return;

  const deviceId = await getOrCreateDeviceId();
  const payload = {
    deviceId,
    expoPushToken,
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    databaseVersion: DATABASE_VERSION,
    platform: Platform.OS,
  };

  await fetch(`${API_BASE_URL}/mobile/devices/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Executa a função de get or create device id.
 */
const getOrCreateDeviceId = async () => {
  const existing = await db.getFirstAsync<{ valor: string }>(
    'SELECT valor FROM configuracoes_app WHERE chave = ?',
    ['device_id'],
  );

  if (existing?.valor) return existing.valor;

  const deviceId = Crypto.randomUUID();
  await db.runAsync(
    'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
    ['device_id', deviceId],
  );

  return deviceId;
};
