import { validarCPF } from '../../utils/validacaoCpf';
import { validarRegrasSenha } from '../../utils/validacaoSenha';

export type PasswordRecoveryResult =
  | { ok: true; userId: number }
  | {
      ok: false;
      reason:
        | 'invalid_email'
        | 'invalid_cpf'
        | 'invalid_plate'
        | 'password_invalid'
        | 'password_mismatch'
        | 'validation_failed';
    };

type PasswordRecoveryDb = {
  getFirstAsync<T>(query: string, params: any[]): Promise<T | null>;
  runAsync(query: string, params: any[]): Promise<unknown>;
};

type HashPasswordFn = (password: string) => Promise<string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OLD_PLATE_REGEX = /^[A-Z]{3}\d{4}$/;
const MERCOSUL_PLATE_REGEX = /^[A-Z]{3}\d[A-Z]\d{2}$/;

export const normalizeCpf = (value: string) => value.replace(/\D/g, '');

export const normalizePlate = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

export const isValidEmail = (value: string) =>
  EMAIL_REGEX.test(value.trim().toLowerCase());

export const isValidBrazilianPlate = (value: string) => {
  const plate = normalizePlate(value);
  return OLD_PLATE_REGEX.test(plate) || MERCOSUL_PLATE_REGEX.test(plate);
};

export async function recoverPasswordWithLocalData(
  input: {
    email: string;
    cpf: string;
    plate: string;
    newPassword: string;
    confirmPassword: string;
  },
  database: PasswordRecoveryDb,
  hashPasswordFn: HashPasswordFn,
): Promise<PasswordRecoveryResult> {
  const email = input.email.trim().toLowerCase();
  const cpf = normalizeCpf(input.cpf);
  const plate = normalizePlate(input.plate);
  const newPassword = input.newPassword.trim();
  const confirmPassword = input.confirmPassword.trim();

  if (!isValidEmail(email)) {
    return { ok: false, reason: 'invalid_email' };
  }

  if (!validarCPF(cpf).valida) {
    return { ok: false, reason: 'invalid_cpf' };
  }

  if (!isValidBrazilianPlate(plate)) {
    return { ok: false, reason: 'invalid_plate' };
  }

  const passwordValidation = validarRegrasSenha(newPassword);
  if (!passwordValidation.valida) {
    return { ok: false, reason: 'password_invalid' };
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, reason: 'password_mismatch' };
  }

  const usuario = await database.getFirstAsync<{ id: number }>(
    `SELECT p.id
     FROM perfil_usuario p
     INNER JOIN veiculos v ON v.id_user = p.id
     WHERE LOWER(p.email) = ?
       AND REPLACE(REPLACE(REPLACE(p.cpf, '.', ''), '-', ''), ' ', '') = ?
       AND UPPER(REPLACE(REPLACE(v.placa, '-', ''), ' ', '')) = ?
     LIMIT 1`,
    [email, cpf, plate],
  );

  if (!usuario?.id) {
    return { ok: false, reason: 'validation_failed' };
  }

  const passwordHash = await hashPasswordFn(newPassword);
  await database.runAsync('UPDATE perfil_usuario SET senha = ? WHERE id = ?', [
    passwordHash,
    usuario.id,
  ]);

  return { ok: true, userId: usuario.id };
}
