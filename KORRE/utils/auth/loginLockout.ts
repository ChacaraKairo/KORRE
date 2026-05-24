import db from '../../database/DatabaseInit';

export const LOGIN_FAILED_ATTEMPTS = 'login_failed_attempts';
export const LOGIN_LOCKED_UNTIL = 'login_locked_until';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

/**
 * Executa a função de get login lockout value.
 */
export const getLoginLockoutValue = async (chave: string) => {
  const row = await db.getFirstAsync<{ valor: string }>(
    'SELECT valor FROM configuracoes_app WHERE chave = ?',
    [chave],
  );
  const value = Number(row?.valor ?? 0);
  return Number.isFinite(value) ? value : 0;
};

export const setLoginLockoutValue = async (
  chave: string,
  valor: string,
) => {
  await db.runAsync(
    'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
    [chave, valor],
  );
};

/**
 * Executa a função de registrar falha login.
 */
export const registrarFalhaLogin = async () => {
  const failedAttempts =
    (await getLoginLockoutValue(LOGIN_FAILED_ATTEMPTS)) + 1;

  await setLoginLockoutValue(
    LOGIN_FAILED_ATTEMPTS,
    String(failedAttempts),
  );

  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    await setLoginLockoutValue(
      LOGIN_LOCKED_UNTIL,
      String(Date.now() + LOCKOUT_MS),
    );
    await setLoginLockoutValue(LOGIN_FAILED_ATTEMPTS, '0');
  }
};

/**
 * Executa a função de resetar tentativas login.
 */
export const resetarTentativasLogin = async () => {
  await setLoginLockoutValue(LOGIN_FAILED_ATTEMPTS, '0');
  await setLoginLockoutValue(LOGIN_LOCKED_UNTIL, '0');
};
