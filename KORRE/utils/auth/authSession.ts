let authSessionUserId: number | null = null;

/**
 * Executa a função de set auth session.
 */
export const setAuthSession = (userId: number) => {
  authSessionUserId = userId;
};

/**
 * Executa a função de clear auth session.
 */
export const clearAuthSession = () => {
  authSessionUserId = null;
};

/**
 * Executa a função de get auth session user id.
 */
export const getAuthSessionUserId = () => authSessionUserId;
