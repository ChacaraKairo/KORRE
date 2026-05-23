import { TFunction } from 'i18next';

const CATEGORY_KEYS: Record<string, string> = {
  'Combustível': 'categorias.combustivel',
  Manutenção: 'categorias.manutencao',
  Alimentação: 'categorias.alimentacao',
  'Outros Ganhos': 'categorias.outros_ganhos',
  'Outras Despesas': 'categorias.outras_despesas',
  Outros: 'categorias.outros',
  'Outros Rendimentos': 'categorias.outros_rendimentos',
};

const INCOME_ORIGIN_GROUP_KEYS: Record<string, string> = {
  Delivery: 'origem_ganhos.categorias.delivery',
  Transporte: 'origem_ganhos.categorias.transporte',
  Logistica: 'origem_ganhos.categorias.logistica',
  Bebidas: 'origem_ganhos.categorias.bebidas',
  'Fixo / Extra': 'origem_ganhos.categorias.fixo_extra',
  Personalizado: 'origem_ganhos.categorias.personalizado',
};

export function translateCategoryName(t: TFunction, name?: string | null) {
  if (!name) return '';

  const key = CATEGORY_KEYS[name];
  return key ? t(key) : name;
}

export function translateIncomeOriginGroup(
  t: TFunction,
  name?: string | null,
) {
  if (!name) return '';

  const key = INCOME_ORIGIN_GROUP_KEYS[name];
  return key ? t(key) : name;
}
