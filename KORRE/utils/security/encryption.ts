import CryptoJS from 'crypto-js';

const PBKDF2_ITERATIONS = 120000;
const KEY_SIZE_WORDS = 256 / 32;
const SALT_BYTES = 16;
const IV_BYTES = 16;

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

const deriveKey = (passphrase: string, salt: string) =>
  CryptoJS.PBKDF2(passphrase, salt, {
    keySize: KEY_SIZE_WORDS,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });

const getRandomHex = (bytes: number) => {
  const random = new Uint8Array(bytes);

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(random);
  } else {
    for (let index = 0; index < bytes; index += 1) {
      random[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(random, (value) =>
    value.toString(16).padStart(2, '0'),
  ).join('');
};

export const encryptJson = (
  data: unknown,
  passphrase: string,
): string => {
  if (!passphrase.trim()) {
    throw new Error('Senha de backup vazia.');
  }

  const saltHex = getRandomHex(SALT_BYTES);
  const ivHex = getRandomHex(IV_BYTES);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const key = deriveKey(passphrase, saltHex);
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  return `${saltHex}:${ivHex}:${encrypted.toString()}`;
};

export const decryptJson = <T = unknown>(
  payload: string,
  passphrase: string,
): T => {
  const { salt, iv, cipher } = parseEncryptedPayload(payload);

  if (!passphrase.trim()) {
    throw new Error('Senha de backup vazia.');
  }

  const key = deriveKey(passphrase, salt);

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
