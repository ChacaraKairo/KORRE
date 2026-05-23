import type { FormularioViabilidade } from '../domain/types';

export type FonteSugestao =
  | 'usuario'
  | 'historico_oficina'
  | 'historico_financeiro'
  | 'pre_cadastro'
  | 'padrao_tipo_veiculo'
  | 'configuracao_app'
  | 'estimativa_korre';

export type ConfiancaSugestao = 'alta' | 'media' | 'baixa';

export type PerfilUsoKorre =
  | 'uso_leve'
  | 'uso_medio'
  | 'uso_intenso'
  | 'uso_profissional_pesado';

export interface SugestaoCampo {
  campo: keyof FormularioViabilidade;
  valor: number | string;
  fonte: FonteSugestao;
  confianca: ConfiancaSugestao;
  explicacao: string;
  aplicadoAutomaticamente: boolean;
}

export interface ResultadoSugestoes {
  perfilUso: PerfilUsoKorre;
  sugestoes: SugestaoCampo[];
}

export interface SugestoesIndicesInput {
  form: Partial<FormularioViabilidade>;
  perfilUso?: PerfilUsoKorre;
  tipoVeiculo?: string | null;
}

export interface AplicacaoSugestoesResultado {
  form: Partial<FormularioViabilidade>;
  aplicadas: SugestaoCampo[];
  ignoradas: SugestaoCampo[];
}

