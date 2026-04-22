// MeuCorre/hooks/oficina/useOficinaCalculos.ts
import { useCallback, useMemo } from 'react';
import { calcularDesgasteItem } from '../../utils/calculoManutencao';

export function useOficinaCalculos(
  veiculoConsultado: any,
  itensVisiveis: any[],
) {
  // Memoizamos a lista de itens já processados com o status para evitar re-renders pesados
  const itensProcessados = useMemo(() => {
    if (!veiculoConsultado || !itensVisiveis.length)
      return [];

    return itensVisiveis.map((item) => {
      const resultado = calcularDesgasteItem(
        item,
        veiculoConsultado.km_atual,
      );
      return {
        ...item,
        // Herdamos automaticamente as propriedades reais vindas do utilitário (ex: progresso, restante)
        ...resultado,
        status: resultado.status,
        // Fallback de segurança para não quebrar a UI caso ela ainda espere os nomes antigos
        porcentagem:
          (resultado as any).porcentagem ??
          (resultado as any).progresso,
        kmRestante:
          (resultado as any).kmRestante ??
          (resultado as any).restante,
      };
    });
  }, [veiculoConsultado?.km_atual, itensVisiveis]);

  // Flag de urgência para o Dashboard
  const temUrgenciaCritica = useMemo(
    () =>
      itensProcessados.some((i) => i.status === 'Crítico'),
    [itensProcessados],
  );

  const calcularProgresso = useCallback(
    (item: any, currentKmOverride?: number) => {
      // Define qual KM usar (o passado por parâmetro ou o do veículo atual)
      const kmAtual =
        currentKmOverride !== undefined
          ? currentKmOverride
          : veiculoConsultado?.km_atual;

      // Chama o nosso utilitário puro para fazer a matemática
      return calcularDesgasteItem(item, kmAtual);
    },
    [veiculoConsultado],
  );

  const getStatusResumo = useCallback(() => {
    // Filtra quantos itens estão fora do padrão OK ou Inicial
    const pendentes = itensVisiveis.filter((item: any) => {
      const status = calcularProgresso(item).status;
      return status !== 'OK' && status !== 'Inicial';
    }).length;

    if (pendentes === 0) {
      return {
        texto: 'Tudo OK',
        cor: '#00C853',
        bg: 'rgba(0, 200, 83, 0.1)',
      };
    }

    return {
      texto: `${pendentes} ${pendentes === 1 ? 'item requer atenção' : 'itens requerem atenção'}`,
      cor: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    };
  }, [itensVisiveis, calcularProgresso]);

  return {
    itensProcessados,
    temUrgenciaCritica,
    calcularProgresso,
    getStatusResumo,
  };
}
