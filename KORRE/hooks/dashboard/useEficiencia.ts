// hooks/dashboard/useEficiencia.ts
import { useMemo } from 'react';

export const useEficiencia = (
  ganhos: number,
  gastos: number,
  kmRodados: number,
  meta: number,
) => {
  return useMemo(() => {
    const lucroReal = ganhos - gastos;
    const progressoMeta = meta > 0 ? ganhos / meta : 0;
    const custoPorKm =
      kmRodados > 0 ? gastos / kmRodados : 0;
    const lucroPorKm =
      kmRodados > 0 ? lucroReal / kmRodados : 0;

    return {
      lucroReal,
      progressoMeta: Math.min(progressoMeta, 1), // Clampa em 100%
      percentualTexto: `${(progressoMeta * 100).toFixed(0)}%`,
      custoPorKm,
      lucroPorKm,
      status: lucroReal > 0 ? 'lucro' : 'prejuizo',
    };
  }, [ganhos, gastos, kmRodados, meta]);
};
