export const HASH_PREFIX = 'sha256i';
export const HASH_ITERATIONS = 5000;

export const formatPasswordHash = (
  iterations: number,
  salt: string,
  hash: string,
) => `${HASH_PREFIX}$${iterations}$${salt}$${hash}`;

/**
 * Executa a função de parse password hash.
 */
export const parsePasswordHash = (storedHash?: string | null) => {
  if (!storedHash) return null;

  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== HASH_PREFIX) {
    return null;
  }

  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return null;
  }

  return {
    iterations,
    salt: parts[2],
    hash: parts[3],
  };
};

/**
 * Executa a função de timing safe equal.
 */
export const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return diff === 0;
};
