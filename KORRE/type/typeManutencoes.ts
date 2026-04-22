import { TipoVeiculo } from './typeVeiculos';

export interface ManutencaoPadrao {
  nome: string;
  icone: string; // Referência string para o componente Lucide, ex: 'Wrench', 'CircleDot'
  intervalo_km: number | null;
  intervalo_meses: number | null;
  criticidade: 'alta' | 'media' | 'baixa';
}

// Dicionário com os itens de manutenção base sugeridos para cada tipo de veículo
// Focado em uso severo (entregas / aplicativos)
export const MANUTENCOES_PADRAO: Record<
  TipoVeiculo,
  ManutencaoPadrao[]
> = {
  moto: [
    {
      nome: 'Óleo do Motor',
      icone: 'droplets',
      intervalo_km: 3000,
      intervalo_meses: 6,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Óleo/Centrífugo',
      icone: 'filter',
      intervalo_km: 6000,
      intervalo_meses: null,
      criticidade: 'media',
    },
    {
      nome: 'Filtro de Ar',
      icone: 'wind',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'media',
    },
    {
      nome: 'Relação (Kit)',
      icone: 'settings',
      intervalo_km: 15000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Pneus e Calibragem',
      icone: 'circle-dot',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Pastilhas / Lonas de Freio',
      icone: 'disc',
      intervalo_km: 5000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Fluido de Freio',
      icone: 'droplets',
      intervalo_km: 20000,
      intervalo_meses: 24,
      criticidade: 'alta',
    },
    {
      nome: 'Vela de Ignição',
      icone: 'zap',
      intervalo_km: 12000,
      intervalo_meses: null,
      criticidade: 'baixa',
    },
    {
      nome: 'Cabos (Acelerador/Embreagem)',
      icone: 'activity',
      intervalo_km: 15000,
      intervalo_meses: 12,
      criticidade: 'media',
    },
  ],
  carro: [
    {
      nome: 'Óleo do Motor',
      icone: 'droplets',
      intervalo_km: 10000,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Óleo',
      icone: 'filter',
      intervalo_km: 10000,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Ar do Motor',
      icone: 'wind',
      intervalo_km: 10000,
      intervalo_meses: 12,
      criticidade: 'media',
    },
    {
      nome: 'Filtro de Combustível',
      icone: 'fuel',
      intervalo_km: 10000,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
    {
      nome: 'Alinhamento e Balanceamento',
      icone: 'activity',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Rodízio de Pneus',
      icone: 'circle-dot',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'media',
    },
    {
      nome: 'Pastilhas de Freio',
      icone: 'disc',
      intervalo_km: 20000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Fluido de Arrefecimento',
      icone: 'thermometer',
      intervalo_km: 30000,
      intervalo_meses: 24,
      criticidade: 'alta',
    },
    {
      nome: 'Correia Dentada',
      icone: 'settings',
      intervalo_km: 60000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Velas de Ignição',
      icone: 'zap',
      intervalo_km: 40000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
  ],
  bicicleta: [
    {
      nome: 'Lubrificação de Corrente',
      icone: 'droplets',
      intervalo_km: 150,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Troca da Corrente',
      icone: 'link',
      intervalo_km: 2000,
      intervalo_meses: null,
      criticidade: 'media',
    },
    {
      nome: 'Pneus e Câmaras',
      icone: 'circle-dot',
      intervalo_km: 3000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Pastilhas / Sapatas',
      icone: 'disc',
      intervalo_km: 1000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Cabos (Freio/Marcha)',
      icone: 'activity',
      intervalo_km: 2000,
      intervalo_meses: 12,
      criticidade: 'media',
    },
    {
      nome: 'Movimento Central / Cubos',
      icone: 'settings',
      intervalo_km: 3000,
      intervalo_meses: 12,
      criticidade: 'media',
    },
    {
      nome: 'Revisão Geral',
      icone: 'wrench',
      intervalo_km: null,
      intervalo_meses: 6,
      criticidade: 'baixa',
    },
  ],
  van: [
    {
      nome: 'Óleo do Motor',
      icone: 'droplets',
      intervalo_km: 15000,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Óleo',
      icone: 'filter',
      intervalo_km: 15000,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Combustível (Diesel)',
      icone: 'fuel',
      intervalo_km: 15000,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Ar',
      icone: 'wind',
      intervalo_km: 15000,
      intervalo_meses: null,
      criticidade: 'media',
    },
    {
      nome: 'Alinhamento e Suspensão',
      icone: 'activity',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Pneus (Desgaste com Carga)',
      icone: 'circle-dot',
      intervalo_km: 40000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Pastilhas de Freio Dianteiras',
      icone: 'disc',
      intervalo_km: 25000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Discos de Freio',
      icone: 'disc',
      intervalo_km: 60000,
      intervalo_meses: null,
      criticidade: 'media',
    },
    {
      nome: 'Correia Dentada / Acessórios',
      icone: 'settings',
      intervalo_km: 80000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
  ],
  carro_eletrico: [
    {
      nome: 'Alinhamento e Balanceamento',
      icone: 'activity',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'alta',
    }, // Elétricos são pesados e comem pneu se desalinhados
    {
      nome: 'Rodízio de Pneus',
      icone: 'circle-dot',
      intervalo_km: 10000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Pneus',
      icone: 'circle-dot',
      intervalo_km: 35000,
      intervalo_meses: null,
      criticidade: 'alta',
    },
    {
      nome: 'Filtro de Cabine',
      icone: 'wind',
      intervalo_km: 20000,
      intervalo_meses: 12,
      criticidade: 'baixa',
    },
    {
      nome: 'Pastilhas de Freio',
      icone: 'disc',
      intervalo_km: 40000,
      intervalo_meses: null,
      criticidade: 'media',
    }, // Gastam menos devido ao freio regenerativo
    {
      nome: 'Fluido de Freio',
      icone: 'droplets',
      intervalo_km: 40000,
      intervalo_meses: 24,
      criticidade: 'alta',
    },
    {
      nome: 'Arrefecimento Bateria',
      icone: 'thermometer',
      intervalo_km: 80000,
      intervalo_meses: 48,
      criticidade: 'alta',
    },
    {
      nome: 'Revisão Elétrica',
      icone: 'zap',
      intervalo_km: null,
      intervalo_meses: 12,
      criticidade: 'alta',
    },
  ],
};
