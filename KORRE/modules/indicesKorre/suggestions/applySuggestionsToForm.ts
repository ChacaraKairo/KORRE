import type { FormularioViabilidade } from '../domain/types';
import type {
  AplicacaoSugestoesResultado,
  SugestaoCampo,
} from './suggestionTypes';

/**
 * Executa a função de is campo vazio.
 */
export function isCampoVazio(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    value === 0 ||
    value === '0'
  );
}

/**
 * Executa a função de apply suggestions to form.
 */
export function applySuggestionsToForm(
  form: Partial<FormularioViabilidade>,
  sugestoes: SugestaoCampo[],
  options: { sobrescrever?: boolean } = {},
): AplicacaoSugestoesResultado {
  const novoForm: Partial<FormularioViabilidade> = { ...form };
  const aplicadas: SugestaoCampo[] = [];
  const ignoradas: SugestaoCampo[] = [];

  for (const sugestao of sugestoes) {
    const valorAtual = novoForm[sugestao.campo];
    const podeAplicar =
      options.sobrescrever === true || isCampoVazio(valorAtual);

    if (!podeAplicar) {
      ignoradas.push({
        ...sugestao,
        aplicadoAutomaticamente: false,
      });
      continue;
    }

    novoForm[sugestao.campo] = sugestao.valor as never;
    aplicadas.push({
      ...sugestao,
      aplicadoAutomaticamente: true,
    });
  }

  return {
    form: novoForm,
    aplicadas,
    ignoradas,
  };
}

