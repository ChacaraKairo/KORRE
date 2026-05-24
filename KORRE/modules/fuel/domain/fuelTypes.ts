export type TipoCombustivel =
  | 'gasolina'
  | 'etanol'
  | 'diesel'
  | 'gnv'
  | 'energia'
  | 'flex_outro';

export interface FuelEntryInput {
  veiculoId?: number | null;
  usuarioLocalId?: number | null;
  dataAbastecimento?: string;
  kmAtual?: number | null;
  tipoCombustivel: TipoCombustivel;
  litros?: number | null;
  valorTotal: number;
  precoUnitario?: number | null;
  tanqueCheio?: boolean;
  cidade?: string | null;
  estadoUf?: string | null;
  origem?: 'calculadora_flex' | 'financeiro' | 'manual' | 'importacao';
  observacao?: string | null;
  criadoSemLogin?: boolean;
  vinculadoAposCadastro?: boolean;
  registrarNoFinanceiro?: boolean;
}

export interface FuelEntryRecord {
  id: number;
  veiculo_id: number | null;
  usuario_local_id: number | null;
  data_abastecimento: string;
  km_atual: number | null;
  tipo_combustivel: TipoCombustivel;
  litros: number | null;
  valor_total: number;
  preco_unitario: number | null;
  tanque_cheio: number;
  cidade: string | null;
  estado_uf: string | null;
  origem: string;
  sincronizado: number;
  elegivel_estatistica: number;
  observacao: string | null;
  criado_sem_login: number;
  vinculado_apos_cadastro: number;
}

export interface FuelConsumptionSummary {
  kmRodados: number;
  litrosConsumidos: number;
  consumoKmL: number;
  custoCombustivelTotal: number;
  custoCombustivelKm: number;
  ticketMedio: number;
  frequenciaDias: number;
  confianca: 'alta' | 'media' | 'baixa';
}
