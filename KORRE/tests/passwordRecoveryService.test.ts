import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isValidBrazilianPlate,
  normalizePlate,
  recoverPasswordWithLocalData,
} from '../modules/auth/PasswordRecoveryService';

type QueryCall = {
  query: string;
  params?: unknown[];
};

function createFakeDb(userId: number | null = 1) {
  const calls: QueryCall[] = [];
  let savedPassword: string | null = null;

  return {
    calls,
    get savedPassword() {
      return savedPassword;
    },
    async getFirstAsync<T>(query: string, params?: unknown[]) {
      calls.push({ query, params });
      return (userId ? { id: userId } : null) as T | null;
    },
    async runAsync(query: string, params?: unknown[]) {
      calls.push({ query, params });
      savedPassword = String(params?.[0] ?? '');
      return {};
    },
  };
}

const validInput = {
  email: 'MOTORISTA@KORRE.APP',
  cpf: '529.982.247-25',
  plate: 'abc-1d23',
  newPassword: 'Senha123',
  confirmPassword: 'Senha123',
};

const fakeHashPassword = async (password: string) => `HASHED:${password}`;

test('recupera senha com dados corretos e salva hash', async () => {
  const db = createFakeDb(7);

  const result = await recoverPasswordWithLocalData(
    validInput,
    db,
    fakeHashPassword,
  );

  assert.deepEqual(result, { ok: true, userId: 7 });
  assert.equal(db.savedPassword, 'HASHED:Senha123');
  assert.notEqual(db.savedPassword, validInput.newPassword);
});

test('recuperacao falha com dados que nao conferem', async () => {
  const db = createFakeDb(null);

  const result = await recoverPasswordWithLocalData(
    validInput,
    db,
    fakeHashPassword,
  );

  assert.deepEqual(result, { ok: false, reason: 'validation_failed' });
  assert.equal(db.savedPassword, null);
});

test('recuperacao falha quando senha e confirmacao diferem', async () => {
  const result = await recoverPasswordWithLocalData(
    { ...validInput, confirmPassword: 'Outra123' },
    createFakeDb(),
    fakeHashPassword,
  );

  assert.deepEqual(result, { ok: false, reason: 'password_mismatch' });
});

test('recuperacao valida email e CPF antes de consultar o banco', async () => {
  const dbEmail = createFakeDb();
  const invalidEmail = await recoverPasswordWithLocalData(
    { ...validInput, email: 'email-invalido' },
    dbEmail,
    fakeHashPassword,
  );

  assert.deepEqual(invalidEmail, { ok: false, reason: 'invalid_email' });
  assert.equal(dbEmail.calls.length, 0);

  const dbCpf = createFakeDb();
  const invalidCpf = await recoverPasswordWithLocalData(
    { ...validInput, cpf: '111.111.111-11' },
    dbCpf,
    fakeHashPassword,
  );

  assert.deepEqual(invalidCpf, { ok: false, reason: 'invalid_cpf' });
  assert.equal(dbCpf.calls.length, 0);
});

test('normaliza e valida placas brasileiras antigas e Mercosul', async () => {
  assert.equal(normalizePlate(' abc-1234 '), 'ABC1234');
  assert.equal(normalizePlate('abc 1d23'), 'ABC1D23');
  assert.equal(isValidBrazilianPlate('ABC-1234'), true);
  assert.equal(isValidBrazilianPlate('ABC1D23'), true);
  assert.equal(isValidBrazilianPlate('AB-123'), false);

  const db = createFakeDb(3);
  await recoverPasswordWithLocalData(validInput, db, fakeHashPassword);

  assert.deepEqual(db.calls[0].params, [
    'motorista@korre.app',
    '52998224725',
    'ABC1D23',
  ]);
});
