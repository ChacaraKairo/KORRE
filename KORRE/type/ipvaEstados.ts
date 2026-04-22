/**
 * REGRAS_IPVA_ESTADOS - Atualizado Exercício 2026
 * Mapeamento incluindo Vans e Veículos Utilitários de Carga (VUC) para integração no motor MeuCorre.
 */

/**
 * Siglas oficiais de todos os estados brasileiros + DF.
 * Garante que o sistema só aceita siglas válidas.
 */
export type SiglaEstado =
  | 'AC'
  | 'AL'
  | 'AM'
  | 'AP'
  | 'BA'
  | 'CE'
  | 'DF'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MG'
  | 'MS'
  | 'MT'
  | 'PA'
  | 'PB'
  | 'PE'
  | 'PI'
  | 'PR'
  | 'RJ'
  | 'RN'
  | 'RO'
  | 'RR'
  | 'RS'
  | 'SC'
  | 'SE'
  | 'SP'
  | 'TO';

/**
 * Estrutura das regras tributárias para automação do IPVA.
 */
export interface RegraIPVAEstado {
  aliquota_carro: number; // Carros de passeio Flex/Gasolina (ex: 0.04)
  aliquota_moto: number; // Motocicletas
  aliquota_van: number; // Vans, Micro-ônibus e Utilitários de Carga
  aliquota_eletrico: number; // Incentivos para propulsão elétrica
  anos_isencao_idade: number; // Tempo em anos para isenção (999 se não houver)
  isencao_moto_cc: number; // Limite de cilindradas para isenção de motos (0 se não houver)
}

/**
 * Mapa completo ligando a sigla do estado às suas regras.
 */
export type MapaRegrasIPVA = Record<
  SiglaEstado,
  RegraIPVAEstado
>;

/**
 * BASE DE DADOS DE TRIBUTAÇÃO DE VEÍCULOS
 * Usada para calcular e sugerir automaticamente o valor do IPVA
 * na Auditoria Financeira do motorista.
 */
export const REGRAS_IPVA_ESTADOS: MapaRegrasIPVA = {
  AC: {
    aliquota_carro: 0.02,
    aliquota_moto: 0.01,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 20,
    isencao_moto_cc: 170,
  },
  AL: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.01,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
  AM: {
    aliquota_carro: 0.015,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0075,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  AP: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.015,
    aliquota_van: 0.03,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  BA: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.01,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  CE: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.02,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  DF: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  ES: {
    aliquota_carro: 0.02,
    aliquota_moto: 0.01,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.02,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  GO: {
    aliquota_carro: 0.0375,
    aliquota_moto: 0.03,
    aliquota_van: 0.0125,
    aliquota_eletrico: 0.0375,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  MA: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  MG: {
    aliquota_carro: 0.04,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
  MS: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.015,
    aliquota_eletrico: 0.009,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
  MT: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.0275,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.03,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
  PA: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.01,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  PB: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.01,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 15,
    isencao_moto_cc: 170,
  },
  PE: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
  PI: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.01,
    anos_isencao_idade: 15,
    isencao_moto_cc: 170,
  },
  PR: {
    aliquota_carro: 0.019,
    aliquota_moto: 0.01,
    aliquota_van: 0.019,
    aliquota_eletrico: 0.019,
    anos_isencao_idade: 20,
    isencao_moto_cc: 170,
  },
  RJ: {
    aliquota_carro: 0.04,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.005,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  RN: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 10,
    isencao_moto_cc: 0,
  },
  RO: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.03,
    anos_isencao_idade: 15,
    isencao_moto_cc: 170,
  },
  RR: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.03,
    anos_isencao_idade: 15,
    isencao_moto_cc: 0,
  },
  RS: {
    aliquota_carro: 0.03,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
  SC: {
    aliquota_carro: 0.02,
    aliquota_moto: 0.01,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.02,
    anos_isencao_idade: 20,
    isencao_moto_cc: 200,
  },
  SE: {
    aliquota_carro: 0.025,
    aliquota_moto: 0.02,
    aliquota_van: 0.01,
    aliquota_eletrico: 0.025,
    anos_isencao_idade: 15,
    isencao_moto_cc: 165,
  },
  SP: {
    aliquota_carro: 0.04,
    aliquota_moto: 0.02,
    aliquota_van: 0.015,
    aliquota_eletrico: 0.04,
    anos_isencao_idade: 20,
    isencao_moto_cc: 180,
  },
  TO: {
    aliquota_carro: 0.02,
    aliquota_moto: 0.02,
    aliquota_van: 0.0125,
    aliquota_eletrico: 0.0,
    anos_isencao_idade: 20,
    isencao_moto_cc: 0,
  },
};
