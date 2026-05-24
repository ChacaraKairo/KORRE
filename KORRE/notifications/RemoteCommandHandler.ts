import Constants from 'expo-constants';
import db, { DATABASE_VERSION } from '../database/DatabaseInit';
import { AppRoutes } from '../constants/routes';
import { criarNotificacao } from './NotificationService';
import type {
  CriarNotificacaoInput,
  TipoNotificacao,
} from './NotificationTypes';
import {
  parseRemoteCommandPayload,
  type RemoteCommandPayload,
} from './RemoteCommandValidation';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_KORRE_API_BASE_URL ?? '';

export async function handleRemoteCommand(payload: unknown) {
  let commandPayload: RemoteCommandPayload;

  try {
    commandPayload = parseRemoteCommandPayload(payload);
  } catch (error) {
    const fallback = getUnsafeLogFields(payload);
    const message =
      error instanceof Error ? error.message : 'Payload invalido';

    if (fallback.requestId && fallback.command) {
      await logRemoteCommand({
        requestId: fallback.requestId,
        command: fallback.command,
        status: 'rejected',
        resposta: { error: message },
      });
      await enviarRespostaComandoServidor({
        requestId: fallback.requestId,
        command: fallback.command,
        success: false,
        error: message,
      });
    }
    return;
  }

  try {
    const data = await executeCommand(commandPayload);
    await criarNotificacao({
      titulo: 'Comando remoto recebido',
      mensagem: `Comando ${commandPayload.command} processado com seguranca.`,
      tipo: 'servidor',
      prioridade: 'media',
      origem: 'servidor',
      canal: 'historico',
      destino: AppRoutes.notificacoes,
      grupoPreferencia: 'sistema',
      dedupKey: `comando_remoto:${commandPayload.requestId}`,
    });
    await logRemoteCommand({
      requestId: commandPayload.requestId,
      command: commandPayload.command,
      status: 'success',
      resposta: data,
    });
    await enviarRespostaComandoServidor({
      requestId: commandPayload.requestId,
      command: commandPayload.command,
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido';
    await logRemoteCommand({
      requestId: commandPayload.requestId,
      command: commandPayload.command,
      status: 'error',
      resposta: { error: message },
    });
    await enviarRespostaComandoServidor({
      requestId: commandPayload.requestId,
      command: commandPayload.command,
      success: false,
      error: message,
    });
  }
}

export async function enviarRespostaComandoServidor(params: {
  requestId: string;
  command: string;
  success: boolean;
  data?: unknown;
  error?: string;
}) {
  if (!API_BASE_URL) return;

  try {
    await fetch(`${API_BASE_URL}/mobile/commands/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch (error) {
    console.error('[REMOTE_COMMAND] Falha ao enviar resposta:', error);
  }
}

const executeCommand = async (
  commandPayload: RemoteCommandPayload,
) => {
  switch (commandPayload.command) {
    case 'GET_APP_STATUS':
      return getAppStatus();
    case 'GET_DASHBOARD_SUMMARY':
      return getDashboardSummary();
    case 'GET_MAINTENANCE_SUMMARY':
      return getMaintenanceSummary();
    case 'CREATE_NOTIFICATION':
      return createRemoteNotification(commandPayload.payload ?? {});
    case 'SYNC_REMOTE_CONFIG':
      return syncRemoteConfig(commandPayload.payload ?? {});
    case 'REQUEST_BACKUP_EXPORT':
      return requestBackupExport(commandPayload.requestId);
    default:
      throw new Error('Comando remoto nao tratado.');
  }
};

const getAppStatus = async () => {
  const user = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) as total FROM perfil_usuario',
  );
  const vehicles = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) as total FROM veiculos',
  );

  return {
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    databaseVersion: DATABASE_VERSION,
    hasUser: Boolean(user?.total),
    vehicleCount: vehicles?.total ?? 0,
  };
};

const getDashboardSummary = async () => {
  const hoje = new Date().toISOString().split('T')[0];
  const [ganhos, gastos, user] = await Promise.all([
    db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(valor), 0) as total
       FROM transacoes_financeiras
       WHERE tipo = 'ganho' AND date(data_transacao) = ?`,
      [hoje],
    ),
    db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(valor), 0) as total
       FROM transacoes_financeiras
       WHERE tipo = 'despesa' AND date(data_transacao) = ?`,
      [hoje],
    ),
    db.getFirstAsync<{ meta_diaria: number }>(
      'SELECT meta_diaria FROM perfil_usuario LIMIT 1',
    ),
  ]);

  const ganhosHoje = ganhos?.total ?? 0;
  const gastosHoje = gastos?.total ?? 0;
  const meta = user?.meta_diaria ?? 0;

  return {
    ganhosHoje,
    gastosHoje,
    lucroEstimado: ganhosHoje - gastosHoje,
    metaBatida: meta > 0 && ganhosHoje >= meta,
  };
};

const getMaintenanceSummary = async () => {
  const rows = await getMaintenanceRows();
  return {
    manutencoesVencidas: rows.filter((row) => row.kmRestante <= 0)
      .length,
    manutencoesProximas: rows.filter(
      (row) => row.kmRestante > 0 && row.kmRestante <= 500,
    ).length,
  };
};

const createRemoteNotification = async (
  payload: Record<string, unknown>,
) => {
  if (
    typeof payload.titulo !== 'string' ||
    typeof payload.mensagem !== 'string'
  ) {
    throw new Error('Notificacao remota invalida.');
  }

  const tipo = isTipoNotificacao(payload.tipo)
    ? payload.tipo
    : 'servidor';

  const input: CriarNotificacaoInput = {
    titulo: payload.titulo,
    mensagem: payload.mensagem,
    tipo,
    prioridade: 'media',
    origem: 'servidor',
    canal: 'local',
    destino:
      typeof payload.destino === 'string'
        ? payload.destino
        : undefined,
    dados:
      payload.dados && typeof payload.dados === 'object'
        ? (payload.dados as Record<string, unknown>)
        : undefined,
    dedupKey:
      typeof payload.dedupKey === 'string'
        ? payload.dedupKey
        : undefined,
    grupoPreferencia: 'sistema',
  };

  await criarNotificacao(input);
  return { created: true };
};

const syncRemoteConfig = async (
  payload: Record<string, unknown>,
) => {
  const flags =
    payload.flags && typeof payload.flags === 'object'
      ? (payload.flags as Record<string, unknown>)
      : {};

  for (const [key, value] of Object.entries(flags)) {
    if (!/^remote_config_[a-zA-Z0-9_]+$/.test(key)) continue;
    await db.runAsync(
      'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
      [key, JSON.stringify(value)],
    );
  }

  return { synced: true };
};

const requestBackupExport = async (requestId: string) => {
  await criarNotificacao({
    titulo: 'Backup solicitado',
    mensagem:
      'O servidor solicitou um backup. Exporte manualmente em Configuracoes.',
    tipo: 'backup',
    prioridade: 'media',
    origem: 'servidor',
    canal: 'historico',
    destino: AppRoutes.configuracoes,
    grupoPreferencia: 'backup',
    dedupKey: `remote_backup_request:${requestId}`,
  });

  return { userActionRequired: true };
};

const getMaintenanceRows = async () => {
  const rows = await db.getAllAsync<{
    id: number;
    km_atual: number;
    ultima_troca_km: number;
    intervalo_km: number | null;
  }>(
    `SELECT im.id, v.km_atual, im.ultima_troca_km, im.intervalo_km
     FROM itens_manutencao im
     INNER JOIN veiculos v ON v.id = im.veiculo_id
     WHERE v.ativo = 1 AND im.intervalo_km IS NOT NULL`,
  );

  return rows.map((row) => {
    const limiteKm =
      Number(row.ultima_troca_km || 0) +
      Number(row.intervalo_km || 0);
    return {
      ...row,
      kmRestante: limiteKm - Number(row.km_atual || 0),
    };
  });
};

const logRemoteCommand = async (params: {
  requestId: string;
  command: string;
  status: string;
  resposta: unknown;
}) => {
  await db.runAsync(
    `INSERT OR REPLACE INTO remote_command_logs
      (request_id, command, status, resposta_json)
      VALUES (?, ?, ?, ?)`,
    [
      params.requestId,
      params.command,
      params.status,
      JSON.stringify(params.resposta),
    ],
  );
};

const getUnsafeLogFields = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const data = payload as Record<string, unknown>;
  return {
    requestId:
      typeof data.requestId === 'string'
        ? data.requestId
        : undefined,
    command:
      typeof data.command === 'string'
        ? data.command
        : undefined,
  };
};

const isTipoNotificacao = (
  tipo: unknown,
): tipo is TipoNotificacao =>
  typeof tipo === 'string' &&
  [
    'info',
    'alerta',
    'sucesso',
    'sistema',
    'servidor',
    'manutencao',
    'financeiro',
    'backup',
    'seguranca',
    'indices',
    'corrida',
    'auditoria',
    'oficina',
    'garagem',
    'meta',
    'mei',
    'uso_app',
    'privacidade',
    'suporte',
  ].includes(tipo);
