import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DATA_CONSENT_KEYS,
  DataConsentService,
} from '../modules/privacy/DataConsentService';

describe('DataConsentService', () => {
  it('exponhe as chaves esperadas', () => {
    assert.equal(
      DATA_CONSENT_KEYS.CONSENT_KEY,
      'uso_dados_anonimos_estatisticas',
    );
    assert.equal(
      DATA_CONSENT_KEYS.CONSENT_UPDATED_AT_KEY,
      'uso_dados_anonimos_estatisticas_atualizado_em',
    );
  });

  it('elegibilidade depende do consentimento', async () => {
    const original = DataConsentService.getConsent;
    (DataConsentService as any).getConsent = async () => true;
    try {
      const can = await DataConsentService.canBeEligibleForStats();
      assert.equal(can, true);
    } finally {
      (DataConsentService as any).getConsent = original;
    }
  });
});
