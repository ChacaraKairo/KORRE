import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getIndicesSteps,
  hasNegativeIndexValue,
  validateIndicesStep,
} from '../modules/indicesKorre/domain/indicesFormWorkflow';

describe('indices form workflow', () => {
  it('modo simples pula a etapa avancada', () => {
    assert.deepEqual(getIndicesSteps('simple'), [
      'intro',
      'mode',
      'basic',
      'review',
    ]);
  });

  it('modo avancado inclui a etapa avancada antes da revisao', () => {
    assert.deepEqual(getIndicesSteps('advanced'), [
      'intro',
      'mode',
      'basic',
      'advanced',
      'review',
    ]);
  });

  it('valida campos obrigatorios da etapa basica', () => {
    assert.deepEqual(validateIndicesStep('basic', {}), [
      'km_estimado_mes',
      'rendimento_energia_unidade',
      'preco_energia_unidade',
    ]);

    assert.deepEqual(
      validateIndicesStep('basic', {
        km_estimado_mes: 1500,
        rendimento_energia_unidade: 32,
        preco_energia_unidade: 5.75,
      }),
      [],
    );
  });

  it('valida campos obrigatorios da etapa avancada', () => {
    assert.deepEqual(validateIndicesStep('advanced', {}), [
      'salario_liquido_mensal_desejado',
      'dias_trabalhados_semana',
      'horas_por_dia',
    ]);
  });

  it('bloqueia valores negativos no formulario', () => {
    assert.equal(hasNegativeIndexValue({ km_estimado_mes: -1 }), true);
    assert.equal(
      hasNegativeIndexValue({ km_estimado_mes: '1500' } as any),
      false,
    );
  });
});
