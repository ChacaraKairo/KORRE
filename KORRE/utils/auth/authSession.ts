let authSessionUserId: number | null = null;

export const setAuthSession = (userId: number) => {
  authSessionUserId = userId;
};

export const clearAuthSession = () => {
  authSessionUserId = null;
};

export const getAuthSessionUserId = () => authSessionUserId;
