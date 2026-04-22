import {
  Bike,
  Motorbike,
  Car,
  Bus,
  Zap,
} from 'lucide-react-native';

// 1. Definimos o Tipo
export type TipoVeiculo =
  | 'moto'
  | 'carro'
  | 'bicicleta'
  | 'van'
  | 'carro_eletrico';

// 2. Estrutura que dita as regras de um Veículo no sistema
export interface VeiculoConfig {
  id: TipoVeiculo;
  label: string;
  icone: any; // Armazena a referência do componente Lucide
  requerPlaca: boolean;
  requerOdometro: boolean;
  requerMotor: boolean;
  placeholders: {
    marca: string;
    modelo: string;
    motor: string;
    placa: string;
  };
}

// 3. Dicionário de Configurações
export const VEICULOS_CONFIG: Record<
  TipoVeiculo,
  VeiculoConfig
> = {
  moto: {
    id: 'moto',
    label: 'MOTO',
    icone: Motorbike,
    requerPlaca: true,
    requerOdometro: true,
    requerMotor: true,
    placeholders: {
      marca: 'Ex: Honda',
      modelo: 'Ex: CG Titan',
      motor: 'Ex: 160cc',
      placa: 'ABC-1D23',
    },
  },
  carro: {
    id: 'carro',
    label: 'CARRO',
    icone: Car,
    requerPlaca: true,
    requerOdometro: true,
    requerMotor: true,
    placeholders: {
      marca: 'Ex: Fiat',
      modelo: 'Ex: Toro',
      motor: 'Ex: 2.0 Flex',
      placa: 'ABC-1D23',
    },
  },
  bicicleta: {
    id: 'bicicleta',
    label: 'BICICLETA',
    icone: Bike,
    requerPlaca: false, // Bicicletas não precisam de placa
    requerOdometro: false, // Opcional, ou não precisam de KM (podes mudar aqui e afeta todo o app)
    requerMotor: false,
    placeholders: {
      marca: 'Ex: Caloi / Oggi',
      modelo: 'Ex: Vulcan',
      motor: '',
      placa: '',
    },
  },
  van: {
    id: 'van',
    label: 'VAN',
    icone: Bus,
    requerPlaca: true,
    requerOdometro: true,
    requerMotor: true,
    placeholders: {
      marca: 'Ex: Mercedes',
      modelo: 'Ex: Sprinter',
      motor: 'Ex: 2.2 Turbo',
      placa: 'ABC-1D23',
    },
  },
  carro_eletrico: {
    id: 'carro_eletrico',
    label: 'ELÉTRICO',
    icone: Zap,
    requerPlaca: true,
    requerOdometro: true,
    requerMotor: true, // Motor elétrico / Potência
    placeholders: {
      marca: 'Ex: BYD / Tesla',
      modelo: 'Ex: Dolphin',
      motor: 'Ex: 204 cv',
      placa: 'ABC-1D23',
    },
  },
};

// 4. Lista em Array (Útil para mapear opções no Modal)
export const VEICULOS_LISTA =
  Object.values(VEICULOS_CONFIG);
