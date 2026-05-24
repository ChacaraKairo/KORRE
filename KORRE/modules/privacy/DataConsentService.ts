const CONSENT_KEY = 'uso_dados_anonimos_estatisticas';
const CONSENT_UPDATED_AT_KEY =
  'uso_dados_anonimos_estatisticas_atualizado_em';

export const DataConsentService = {
  async getConsent(): Promise<boolean> {
    const db = (await import('../../database/DatabaseInit')).default;
    const row = await db.getFirstAsync<{ valor: string }>(
      'SELECT valor FROM configuracoes_app WHERE chave = ?',
      [CONSENT_KEY],
    );
    return row?.valor === 'true';
  },

  async hasResponded(): Promise<boolean> {
    const db = (await import('../../database/DatabaseInit')).default;
    const row = await db.getFirstAsync<{ valor: string }>(
      'SELECT valor FROM configuracoes_app WHERE chave = ?',
      [CONSENT_KEY],
    );
    return typeof row?.valor === 'string';
  },

  async setConsent(value: boolean) {
    const db = (await import('../../database/DatabaseInit')).default;
    await db.runAsync(
      'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
      [CONSENT_KEY, value ? 'true' : 'false'],
    );
    await db.runAsync(
      'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
      [CONSENT_UPDATED_AT_KEY, new Date().toISOString()],
    );
  },

  async canBeEligibleForStats(): Promise<boolean> {
    return this.getConsent();
  },
};

export const DATA_CONSENT_KEYS = {
  CONSENT_KEY,
  CONSENT_UPDATED_AT_KEY,
} as const;
