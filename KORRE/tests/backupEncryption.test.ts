import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  decryptJson,
  encryptJson,
  isEncryptedPayload,
} from '../utils/security/encryption';

describe('backup encryption', () => {
  it('criptografa e descriptografa JSON de backup', () => {
    const payload = {
      app: 'KORRE',
      versao_banco: 5,
      tabelas: {
        perfil_usuario: [{ id: 1, nome: 'Teste' }],
      },
    };

    const encrypted = encryptJson(payload, 'senha-forte');
    assert.equal(isEncryptedPayload(encrypted), true);
    assert.notEqual(encrypted.includes('"perfil_usuario"'), true);

    const decrypted = decryptJson<typeof payload>(
      encrypted,
      'senha-forte',
    );

    assert.deepEqual(decrypted, payload);
  });

  it('rejeita senha incorreta', () => {
    const encrypted = encryptJson({ ok: true }, 'senha-correta');

    assert.throws(() => {
      decryptJson(encrypted, 'senha-errada');
    });
  });
});
