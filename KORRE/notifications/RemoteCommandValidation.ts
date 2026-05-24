export type RemoteCommand =
  | 'GET_APP_STATUS'
  | 'GET_DASHBOARD_SUMMARY'
  | 'GET_MAINTENANCE_SUMMARY'
  | 'CREATE_NOTIFICATION'
  | 'SYNC_REMOTE_CONFIG'
  | 'REQUEST_BACKUP_EXPORT'
  | 'REQUEST_DATA_SYNC'
  | 'REQUEST_CONSENT_STATUS';

export interface RemoteCommandPayload {
  kind: 'command';
  command: RemoteCommand;
  requestId: string;
  payload?: Record<string, unknown>;
}

const ALLOWED_COMMANDS = new Set<RemoteCommand>([
  'GET_APP_STATUS',
  'GET_DASHBOARD_SUMMARY',
  'GET_MAINTENANCE_SUMMARY',
  'CREATE_NOTIFICATION',
  'SYNC_REMOTE_CONFIG',
  'REQUEST_BACKUP_EXPORT',
  'REQUEST_DATA_SYNC',
  'REQUEST_CONSENT_STATUS',
]);

/**
 * Executa a função de parse remote command payload.
 */
export function parseRemoteCommandPayload(
  payload: unknown,
): RemoteCommandPayload {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload remoto invalido.');
  }

  const data = payload as Record<string, unknown>;
  if (data.kind !== 'command') {
    throw new Error('Payload remoto nao e um comando.');
  }

  if (
    typeof data.requestId !== 'string' ||
    data.requestId.trim().length === 0
  ) {
    throw new Error('requestId obrigatorio.');
  }

  if (!isAllowedCommand(data.command)) {
    throw new Error('Comando remoto nao permitido.');
  }

  if (containsSqlLikeInput(data.payload)) {
    throw new Error('Payload remoto contem instrucao nao permitida.');
  }

  return {
    kind: 'command',
    command: data.command,
    requestId: data.requestId,
    payload:
      data.payload && typeof data.payload === 'object'
        ? (data.payload as Record<string, unknown>)
        : {},
  };
}

export const containsSqlLikeInput = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|PRAGMA|ATTACH|DETACH|REPLACE|TRUNCATE)\b/i.test(
      value,
    );
  }

  if (Array.isArray(value)) {
    return value.some(containsSqlLikeInput);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some(containsSqlLikeInput);
  }

  return false;
};

const isAllowedCommand = (
  command: unknown,
): command is RemoteCommand =>
  typeof command === 'string' &&
  ALLOWED_COMMANDS.has(command as RemoteCommand);
