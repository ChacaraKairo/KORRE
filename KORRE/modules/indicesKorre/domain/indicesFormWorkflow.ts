import type { FormularioViabilidade } from './types';

export type IndicesFormMode = 'simple' | 'advanced';
export type IndicesFormStep = 'intro' | 'mode' | 'basic' | 'advanced' | 'review';

export function getIndicesSteps(mode: IndicesFormMode): IndicesFormStep[] {
  return mode === 'advanced'
    ? ['intro', 'mode', 'basic', 'advanced', 'review']
    : ['intro', 'mode', 'basic', 'review'];
}

export function validateIndicesStep(
  step: IndicesFormStep,
  form: Partial<FormularioViabilidade>,
): string[] {
  const errors: string[] = [];

  if (step === 'basic') {
    requirePositive(errors, form.km_estimado_mes, 'km_estimado_mes');
    requirePositive(
      errors,
      form.rendimento_energia_unidade,
      'rendimento_energia_unidade',
    );
    requirePositive(errors, form.preco_energia_unidade, 'preco_energia_unidade');
  }

  if (step === 'advanced') {
    requirePositive(
      errors,
      form.salario_liquido_mensal_desejado,
      'salario_liquido_mensal_desejado',
    );
    requirePositive(errors, form.dias_trabalhados_semana, 'dias_trabalhados_semana');
    requirePositive(errors, form.horas_por_dia, 'horas_por_dia');
  }

  return errors;
}

export function hasNegativeIndexValue(form: Partial<FormularioViabilidade>) {
  return Object.values(form).some((value) => {
    if (typeof value === 'number') return value < 0;
    if (typeof value === 'string' && value.trim()) return Number(value) < 0;
    return false;
  });
}

function requirePositive(errors: string[], value: unknown, field: string) {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    errors.push(field);
  }
}
