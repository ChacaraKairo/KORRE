import * as Crypto from 'expo-crypto';
import {
  formatPasswordHash,
  HASH_ITERATIONS,
  parsePasswordHash,
  timingSafeEqual,
} from './passwordHashFormat';

/**
 * Executa a função de hash password.
 */
export const hashPassword = async (password: string) => {
  const salt = Crypto.randomUUID();
  const hash = await deriveHash(password, salt, HASH_ITERATIONS);
  return formatPasswordHash(HASH_ITERATIONS, salt, hash);
};

export const verifyPassword = async (
  password: string,
  storedHash?: string | null,
) => {
  if (!storedHash) return false;

  const parsed = parsePasswordHash(storedHash);
  if (parsed) {
    const actualHash = await deriveHash(
      password,
      parsed.salt,
      parsed.iterations,
    );
    return timingSafeEqual(actualHash, parsed.hash);
  }

  const legacyHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
  return timingSafeEqual(legacyHash, storedHash);
};

const deriveHash = async (
  password: string,
  salt: string,
  iterations: number,
) => {
  let hash = `${salt}:${password}`;

  for (let index = 0; index < iterations; index += 1) {
    hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${salt}:${index}:${hash}`,
    );
  }

  return hash;
};
