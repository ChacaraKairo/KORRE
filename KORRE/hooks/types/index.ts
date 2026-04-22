// src/types/index.ts
import { TipoVeiculo as TV } from '../../type/typeVeiculos';

export type TipoVeiculo = TV;

export interface Veiculo {
  id: number;
  tipo: TipoVeiculo;
  modelo: string;
  marca?: string;
  ano?: number;
  placa: string;
  km_atual: number;
  ativo: number; // 0 ou 1
}

export interface Manutencao {
  id: number;
  veiculo_id: number;
  item_nome: string;
  intervalo_km: number;
  alerta_km: number;
  km_ultimo_reset: number;
  data_ultimo_reset: string;
  valor_ultimo_gasto?: number;
  prioridade: 'baixa' | 'media' | 'alta';
}
