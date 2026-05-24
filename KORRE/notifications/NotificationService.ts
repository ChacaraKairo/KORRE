import Constants from 'expo-constants';
import type { NotificationTriggerInput } from 'expo-notifications';
import db from '../database/DatabaseInit';
import { AppRoutes } from '../constants/routes';
import type {
  CanalNotificacao,
  CriarNotificacaoInput,
  NotificacaoHistorico,
} from './NotificationTypes';
import { shouldCreateNotificationForDedup } from './notificationDedup';
import { NotificationPreferencesService } from './NotificationPreferencesService';

type ExpoNotifications = typeof import('expo-notifications');

const isExpoGo = Constants.appOwnership === 'expo';

const carregarNotifications =
  async (): Promise<ExpoNotifications | null> => {
    if (isExpoGo) return null;
    return import('expo-notifications');
  };

/**
 * Executa a função de solicitar permissao notificacoes.
 */
export async function solicitarPermissaoNotificacoes() {
  const Notifications = await carregarNotifications();
  if (!Notifications) return false;

  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;

  const result = await Notifications.requestPermissionsAsync();
  return result.status === 'granted';
}

/**
 * Executa a função de criar notificacao.
 */
export async function criarNotificacao(
  input: CriarNotificacaoInput,
) {
  const normalizada = normalizeInput(input);
  if (!(await shouldSendByPreferences(normalizada))) {
    return;
  }

  if (
    !shouldCreateNotificationForDedup(
      normalizada.dedupKey,
      normalizada.dedupKey
        ? await hasDedupKey(normalizada.dedupKey)
        : false,
    )
  ) {
    return;
  }

  const canal = normalizada.canal ?? 'local';
  const shouldPush = canal === 'push' || canal === 'local';

  if (shouldPush) {
    const Notifications = await carregarNotifications();
    if (Notifications) {
      const podeNotificar = await solicitarPermissaoNotificacoes();
      if (podeNotificar) {
        await Notifications.scheduleNotificationAsync({
          content: buildNotificationContent(normalizada),
          trigger: null,
        });
      }
    }
  }

  await salvarNotificacao(normalizada);
}

/**
 * Executa a função de criar notificacao agendada.
 */
export async function criarNotificacaoAgendada(
  input: CriarNotificacaoInput,
  trigger: NotificationTriggerInput,
) {
  const normalizada = normalizeInput(input);
  if (!(await shouldSendByPreferences(normalizada))) return;

  if (
    !shouldCreateNotificationForDedup(
      normalizada.dedupKey,
      normalizada.dedupKey
        ? await hasDedupKey(normalizada.dedupKey)
        : false,
    )
  ) {
    return;
  }

  const canal = normalizada.canal ?? 'local';
  const shouldPush = canal === 'push' || canal === 'local';
  if (!shouldPush) {
    await salvarNotificacao(normalizada);
    return;
  }

  const Notifications = await carregarNotifications();
  if (!Notifications) return;

  const podeNotificar = await solicitarPermissaoNotificacoes();
  if (!podeNotificar) return;

  await Notifications.scheduleNotificationAsync({
    content: buildNotificationContent(normalizada),
    trigger,
  });

  await salvarNotificacao(normalizada);
}

/**
 * Executa a função de listar notificacoes.
 */
export async function listarNotificacoes() {
  const rows = await db.getAllAsync<
    NotificacaoHistorico & { dados_json?: string | null }
  >('SELECT * FROM notificacoes ORDER BY id DESC');

  return rows.map((row) => ({
    ...row,
    dados: parseDadosJson(row.dados_json),
  }));
}

/**
 * Executa a função de marcar notificacao como lida.
 */
export async function marcarNotificacaoComoLida(id: number) {
  await db.runAsync(
    'UPDATE notificacoes SET lida = 1 WHERE id = ?',
    [id],
  );
}

/**
 * Executa a função de limpar historico notificacoes.
 */
export async function limparHistoricoNotificacoes() {
  await db.runAsync('DELETE FROM notificacoes');
}

/**
 * Executa a função de registrar dedup key.
 */
export async function registrarDedupKey(dedupKey: string) {
  await db.runAsync(
    'INSERT OR IGNORE INTO notificacao_dedup (chave) VALUES (?)',
    [dedupKey],
  );
}

/**
 * Executa a função de has dedup key.
 */
export async function hasDedupKey(dedupKey: string) {
  const row = await db.getFirstAsync<{ chave: string }>(
    'SELECT chave FROM notificacao_dedup WHERE chave = ? LIMIT 1',
    [dedupKey],
  );
  return Boolean(row);
}

const salvarNotificacao = async (
  input: CriarNotificacaoInput,
) => {
  if (input.dedupKey) {
    await registrarDedupKey(input.dedupKey);
  }

  await db.runAsync(
    `INSERT INTO notificacoes
      (titulo, mensagem, tipo, origem, destino, dados_json, dedup_key, prioridade, canal, grupo_preferencia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.titulo,
      input.mensagem,
      input.tipo,
      input.origem ?? 'local',
      input.destino ?? null,
      input.dados ? JSON.stringify(input.dados) : null,
      input.dedupKey ?? null,
      input.prioridade ?? 'media',
      input.canal ?? 'historico',
      input.grupoPreferencia ?? null,
    ],
  );
};

const buildNotificationContent = (
  input: CriarNotificacaoInput,
) => ({
  title: input.titulo,
  body: input.mensagem,
  data: {
    tipo: input.tipo,
    prioridade: input.prioridade ?? 'media',
    canal: input.canal ?? 'local',
    origem: input.origem ?? 'local',
    destino: isDestinoValido(input.destino)
      ? input.destino
      : AppRoutes.notificacoes,
    dedupKey: input.dedupKey,
    ...(input.dados ?? {}),
  },
});

/**
 * Executa a função de parse dados json.
 */
const parseDadosJson = (dadosJson?: string | null) => {
  if (!dadosJson) return undefined;

  try {
    return JSON.parse(dadosJson);
  } catch {
    return undefined;
  }
};

const SENSITIVE_KEYS = [
  'senha',
  'password',
  'hash',
  'cpf',
  'placa',
];

const sanitizeDados = (
  dados: Record<string, unknown> | undefined,
) => {
  if (!dados) return undefined;
  const entries = Object.entries(dados).filter(([key]) => {
    const normalized = key.toLowerCase();
    return !SENSITIVE_KEYS.some((word) =>
      normalized.includes(word),
    );
  });
  return Object.fromEntries(entries);
};

/**
 * Executa a função de sanitize message.
 */
const sanitizeMessage = (message: string) =>
  message
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '***')
    .replace(/\b[A-Z]{3,4}-?\d{3,4}\b/gi, '***');

const isDestinoValido = (destino: unknown): destino is string =>
  typeof destino === 'string' &&
  Object.values(AppRoutes).includes(destino as never);

const normalizeInput = (
  input: CriarNotificacaoInput,
): CriarNotificacaoInput => ({
  ...input,
  mensagem: sanitizeMessage(input.mensagem),
  dados: sanitizeDados(input.dados),
  prioridade: input.prioridade ?? 'media',
  origem: input.origem ?? 'local',
  canal: input.canal ?? 'historico',
  destino: isDestinoValido(input.destino)
    ? input.destino
    : AppRoutes.notificacoes,
});

const shouldSendByPreferences = async (
  input: CriarNotificacaoInput,
) => {
  const enabled =
    await NotificationPreferencesService.isGroupEnabled(
      input.grupoPreferencia,
    );
  if (enabled) return true;
  if (
    input.grupoPreferencia === 'seguranca' ||
    input.grupoPreferencia === 'privacidade'
  ) {
    return true;
  }
  return false;
};
