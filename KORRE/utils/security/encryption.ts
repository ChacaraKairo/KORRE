import CryptoJS from 'crypto-js';

const PBKDF2_ITERATIONS = 120000;
const KEY_SIZE_WORDS = 256 / 32;

const parseEncryptedPayload = (payload: string) => {
  const parts = payload.trim().split(':');

  if (parts.length === 2) {
    const [salt, cipher] = parts;
    return { salt, cipher, iv: salt };
  }

  if (parts.length === 3) {
    const [salt, iv, cipher] = parts;
    return { salt, iv, cipher };
  }

  throw new Error('Formato de backup criptografado invalido.');
};

export const isEncryptedPayload = (payload: string) =>
  payload.trim().includes(':');

export const decryptJson = <T = unknown>(
  payload: string,
  passphrase: string,
): T => {
  const { salt, iv, cipher } = parseEncryptedPayload(payload);

  if (!passphrase.trim()) {
    throw new Error('Senha de backup vazia.');
  }

  const key = CryptoJS.PBKDF2(passphrase, salt, {
    keySize: KEY_SIZE_WORDS,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });

  const decrypted = CryptoJS.AES.decrypt(cipher, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const json = decrypted.toString(CryptoJS.enc.Utf8);

  if (!json) {
    throw new Error('Senha incorreta ou arquivo invalido.');
  }

  return JSON.parse(json) as T;
};
