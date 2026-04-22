// Arquivo: src/hooks/oficina/useOficina.ts
import { useOficinaData } from './useOficinaData';
import { useOficinaCalculos } from './useOficinaCalculos';
import { useOficinaMutacoes } from './useOficinaMutacoes';

export function useOficina() {
  // 1. Instancia o Hook de Dados (Busca no SQLite)
  const dados = useOficinaData();

  // 2. Instancia o Hook de Cálculos (Lógica de % e cores baseada no Util)
  const calculos = useOficinaCalculos(
    dados.veiculoConsultado,
    dados.itensVisiveis,
  );

  // 3. Instancia o Hook de Ações (Reset de manutenção e controle de visibilidade dos modais)
  // Agora está limpo, sem a lógica interna de cadastro de novo item
  const acoes = useOficinaMutacoes(
    dados.veiculoConsultado,
    dados.carregarDados,
  );

  // Retorna tudo unificado.
  // O componente OficinaScreen agora recebe uma interface muito mais enxuta.
  return {
    ...dados,
    ...calculos,
    ...acoes,
  };
}
