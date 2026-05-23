// src/modules/calculator/core/utils.ts

/**
 * Converte qualquer valor (string com vírgula, null, undefined) para um número válido.
 * Evita que o app quebre se o usuário digitar textos nos inputs.
 */
export const toNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;

  let str = String(val).trim();

  if (str.includes('.') && str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',')) {
    str = str.replace(',', '.');
  } else if (str.split('.').length > 2) {
    str = str.replace(/\./g, '');
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Garante que nenhuma divisão por zero aconteça, retornando 0 ao invés de Infinity ou NaN.
 */
export const divisaoSegura = (
  dividendo: number,
  divisor: number,
): number => {
  if (divisor === 0) return 0;
  return dividendo / divisor;
};
