// --- Arquivo: src/types/veiculosData.ts ---

export const VEICULOS_DATABASE = {
  moto: {
    HONDA: {
      'CG TITAN': ['160 CC', '150 CC', '125 CC'],
      'CG FAN': ['160 CC', '150 CC', '125 CC'],
      'CG START': ['160 CC', '150 CC'],
      'CB TWISTER': ['300F', '250 CC', '250 CC (CBX)'],
      'CB 300R': ['300 CC'],
      'CB 600F HORNET': ['600 CC'],
      XRE: ['300 CC', '190 CC'],
      'NXR BROS': ['160 CC', '150 CC', '125 CC'],
      BIZ: ['125 CC', '110i CC', '100 CC'],
      PCX: ['160 CC', '150 CC'],
      'NX 400 FALCON': ['400 CC'],
      ADV: ['150 CC'],
      POP: ['110i CC', '100 CC'],
    },
    YAMAHA: {
      FAZER: ['250 CC', '150 CC'],
      FACTOR: ['150 CC', '125 CC'],
      LANDER: ['250 CC'],
      TENERE: ['250 CC', '660 CC'],
      'XT 660R': ['660 CC'],
      CROSSER: ['150 CC'],
      NMAX: ['160 CC'],
      XMAX: ['250 CC'],
      MT: ['03', '07', '09'],
      R15: ['150 CC'],
      NEO: ['125 CC', '115 CC'],
    },
    SUZUKI: {
      YES: ['125 CC'],
      INTRUDER: ['125 CC', '250 CC'],
      'V-STROM': ['650 CC', '1000 CC'],
      BANDIT: ['650 CC', '1250 CC'],
      BURGMAN: ['125 CC', '400 CC'],
    },
    BAJAJ: {
      DOMINAR: ['400 CC', '250 CC', '200 CC', '160 CC'],
    },
    MOTTU: {
      SPORT: ['110 CC'],
      ELECTRIC: ['REVE CC'],
    },
    SHINERAY: {
      XY: ['50 CC'],
      SHI: ['175 CC'],
      WORK: ['125 CC'],
      JET: ['50 CC', '125 CC'],
    },
  },
  carro: {
    CHEVROLET: {
      ONIX: ['1.0 TURBO', '1.0 ASPIRADO', '1.4 FLEX'],
      CELTA: ['1.0 VHC', '1.4 MPFI'],
      CORSA: ['1.0', '1.4', '1.8'],
      ASTRA: ['2.0'],
      PRISMA: ['1.0', '1.4'],
      CRUZE: ['1.4 TURBO', '1.8'],
      TRACKER: ['1.0 TURBO', '1.2 TURBO', '1.8', '2.0'],
      MONTANA: ['1.2 TURBO', '1.4', '1.8'],
      S10: ['2.8 DIESEL', '2.4 FLEX', '2.5 FLEX'],
      VECTRA: ['2.0', '2.4'],
    },
    FIAT: {
      UNO: ['1.0 FIRE', '1.0 EVO', '1.3'],
      PALIO: ['1.0', '1.4', '1.6', '1.8'],
      STRADA: ['1.3', '1.4', '1.8', '1.0 TURBO'],
      ARGO: ['1.0', '1.3', '1.8'],
      PULSE: ['1.0 TURBO', '1.3'],
      FASTBACK: ['1.3 TURBO', '1.0 TURBO'],
      TORO: ['1.3 TURBO', '1.8', '2.0 DIESEL'],
      SIENA: ['1.0', '1.4', '1.6'],
      PUNTO: ['1.4', '1.6', '1.8'],
      MOBI: ['1.0'],
    },
    VOLKSWAGEN: {
      GOL: ['1.0', '1.6', '1.8'],
      FOX: ['1.0', '1.6'],
      POLO: ['1.0 TSI', '1.0 ASPIRADO', '1.6', '2.0'],
      GOLF: ['1.4 TSI', '1.6', '2.0'],
      SAVEIRO: ['1.6'],
      JETTA: ['1.4 TSI', '2.0 TSI', '2.5'],
      VOYAGE: ['1.0', '1.6'],
      'T-CROSS': ['1.0 TSI', '1.4 TSI'],
      NIVUS: ['1.0 TSI'],
    },
    TOYOTA: {
      COROLLA: ['1.8', '2.0', '1.8 HÍBRIDO'],
      ETIOS: ['1.3', '1.5'],
      YARIS: ['1.3', '1.5'],
      HILUX: ['2.8 DIESEL', '3.0 DIESEL', '2.7 FLEX'],
      'COROLLA CROSS': ['2.0', '1.8 HÍBRIDO'],
    },
    HYUNDAI: {
      HB20: ['1.0 TURBO', '1.0 ASPIRADO', '1.6'],
      CRETA: ['1.0 TURBO', '1.6', '2.0'],
      TUCSON: ['1.6 TURBO', '2.0'],
      I30: ['1.8', '2.0'],
    },
    FORD: {
      FIESTA: ['1.0', '1.6'],
      KA: ['1.0', '1.5'],
      ECOSPORT: ['1.5', '1.6', '2.0'],
      RANGER: [
        '2.0 DIESEL',
        '2.2 DIESEL',
        '3.0 DIESEL',
        '3.2 DIESEL',
      ],
    },
    RENAULT: {
      SANDERO: ['1.0', '1.6', '2.0'],
      LOGAN: ['1.0', '1.6'],
      DUSTER: ['1.3 TURBO', '1.6', '2.0'],
      KWID: ['1.0'],
      CLIO: ['1.0', '1.6'],
    },
    HONDA: {
      CIVIC: ['1.5 TURBO', '1.7', '1.8', '2.0', 'HÍBRIDO'],
      FIT: ['1.4', '1.5'],
      CITY: ['1.5'],
      'HR-V': ['1.5 TURBO', '1.8'],
    },
    BYD: {
      DOLPHIN: ['MINI', '95 CV', 'PLUS'],
      'SONG PLUS': ['DM-I'],
      SEAL: ['AWD'],
      'YUAN PLUS': ['EV'],
    },
    GWM: {
      HAVAL: ['H6 HEV', 'H6 PHEV', 'H6 GT'],
      ORA: ['03'],
    },
  },
  van: {
    FIAT: {
      DUCATO: ['2.3 DIESEL', '2.8 DIESEL'],
      FIORINO: ['1.3', '1.4'],
      DOBLO: ['1.3', '1.4', '1.8'],
    },
    RENAULT: {
      MASTER: ['2.3 DIESEL', '2.5 DIESEL'],
      KANGOO: ['1.6'],
    },
    MERCEDES: {
      SPRINTER: ['311', '313', '415', '515'],
    },
  },
  bicicleta: {
    CALOI: {
      MTB: ['ARO 29', 'ARO 26'],
      URBANA: ['700'],
    },
    OGGI: {
      MTB: ['BIG WHEEL', 'HACKER'],
    },
  },
  eletrico: {
    CARRO: {
      BYD: ['DOLPHIN', 'SEAL'],
      GWM: ['ORA 03'],
      VOLVO: ['XC40', 'C40'],
    },
    MOTO: {
      VOLTZ: ['EVS', 'EV1'],
      SHINERAY: ['SHE S'],
      MOTTU: ['REVE CC'],
    },
  },
} as const;

// --- TIPAGEM AVANÇADA ---

export type TipoVeiculoKey = keyof typeof VEICULOS_DATABASE;

export type MarcasPorTipo<T extends TipoVeiculoKey> =
  keyof (typeof VEICULOS_DATABASE)[T];

export type ModelosPorMarca<
  T extends TipoVeiculoKey,
  M extends MarcasPorTipo<T>,
> = keyof (typeof VEICULOS_DATABASE)[T][M];

export type VersoesPorModelo<
  T extends TipoVeiculoKey,
  M extends MarcasPorTipo<T>,
  Mod extends ModelosPorMarca<T, M>,
> = (typeof VEICULOS_DATABASE)[T][M][Mod] extends readonly string[]
  ? (typeof VEICULOS_DATABASE)[T][M][Mod][number]
  : never;
