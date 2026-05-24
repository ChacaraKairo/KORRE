import db from '../database/DatabaseInit';
import type { GrupoPreferenciaNotificacao } from './NotificationTypes';

export interface NotificationPreferences {
  notificacoes_manutencao_ativas: boolean;
  notificacoes_financeiro_ativas: boolean;
  notificacoes_backup_ativas: boolean;
  notificacoes_indices_ativas: boolean;
  notificacoes_corrida_ativas: boolean;
  notificacoes_seguranca_ativas: boolean;
  notificacoes_mei_ativas: boolean;
  notificacoes_uso_app_ativas: boolean;
  notificacoes_privacidade_ativas: boolean;
  notificacoes_sistema_ativas: boolean;
}

const DEFAULTS: NotificationPreferences = {
  notificacoes_manutencao_ativas: true,
  notificacoes_financeiro_ativas: true,
  notificacoes_backup_ativas: true,
  notificacoes_indices_ativas: true,
  notificacoes_corrida_ativas: true,
  notificacoes_seguranca_ativas: true,
  notificacoes_mei_ativas: false,
  notificacoes_uso_app_ativas: true,
  notificacoes_privacidade_ativas: true,
  notificacoes_sistema_ativas: true,
};

const GROUP_TO_KEY: Record<GrupoPreferenciaNotificacao, keyof NotificationPreferences> = {
  manutencao: 'notificacoes_manutencao_ativas',
  financeiro: 'notificacoes_financeiro_ativas',
  backup: 'notificacoes_backup_ativas',
  indices: 'notificacoes_indices_ativas',
  corrida: 'notificacoes_corrida_ativas',
  seguranca: 'notificacoes_seguranca_ativas',
  mei: 'notificacoes_mei_ativas',
  uso_app: 'notificacoes_uso_app_ativas',
  privacidade: 'notificacoes_privacidade_ativas',
  sistema: 'notificacoes_sistema_ativas',
};

function toBool(value: string | null | undefined, fallback: boolean) {
  if (value === undefined || value === null) return fallback;
  return value === '1' || value.toLowerCase() === 'true';
}

export const NotificationPreferencesService = {
  async ensureDefaults() {
    for (const [key, value] of Object.entries(DEFAULTS)) {
      await db.runAsync(
        `INSERT OR IGNORE INTO configuracoes_app (chave, valor) VALUES (?, ?)`,
        [key, value ? '1' : '0'],
      );
    }
  },

  async getPreferences(): Promise<NotificationPreferences> {
    await this.ensureDefaults();
    const rows = await db.getAllAsync<{ chave: string; valor: string }>(
      `SELECT chave, valor FROM configuracoes_app
       WHERE chave LIKE 'notificacoes_%_ativas'`,
    );
    const map = new Map(rows.map((row) => [row.chave, row.valor]));

    return {
      notificacoes_manutencao_ativas: toBool(
        map.get('notificacoes_manutencao_ativas'),
        DEFAULTS.notificacoes_manutencao_ativas,
      ),
      notificacoes_financeiro_ativas: toBool(
        map.get('notificacoes_financeiro_ativas'),
        DEFAULTS.notificacoes_financeiro_ativas,
      ),
      notificacoes_backup_ativas: toBool(
        map.get('notificacoes_backup_ativas'),
        DEFAULTS.notificacoes_backup_ativas,
      ),
      notificacoes_indices_ativas: toBool(
        map.get('notificacoes_indices_ativas'),
        DEFAULTS.notificacoes_indices_ativas,
      ),
      notificacoes_corrida_ativas: toBool(
        map.get('notificacoes_corrida_ativas'),
        DEFAULTS.notificacoes_corrida_ativas,
      ),
      notificacoes_seguranca_ativas: toBool(
        map.get('notificacoes_seguranca_ativas'),
        DEFAULTS.notificacoes_seguranca_ativas,
      ),
      notificacoes_mei_ativas: toBool(
        map.get('notificacoes_mei_ativas'),
        DEFAULTS.notificacoes_mei_ativas,
      ),
      notificacoes_uso_app_ativas: toBool(
        map.get('notificacoes_uso_app_ativas'),
        DEFAULTS.notificacoes_uso_app_ativas,
      ),
      notificacoes_privacidade_ativas: toBool(
        map.get('notificacoes_privacidade_ativas'),
        DEFAULTS.notificacoes_privacidade_ativas,
      ),
      notificacoes_sistema_ativas: toBool(
        map.get('notificacoes_sistema_ativas'),
        DEFAULTS.notificacoes_sistema_ativas,
      ),
    };
  },

  async setPreference(
    key: keyof NotificationPreferences,
    active: boolean,
  ) {
    const forcedActive =
      (key === 'notificacoes_seguranca_ativas' ||
        key === 'notificacoes_privacidade_ativas') &&
      !active;
    await db.runAsync(
      `INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)`,
      [key, forcedActive ? '1' : active ? '1' : '0'],
    );
  },

  async isGroupEnabled(group?: GrupoPreferenciaNotificacao) {
    if (!group) return true;
    const prefs = await this.getPreferences();
    return prefs[GROUP_TO_KEY[group]];
  },
};
