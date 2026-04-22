// Arquivo: src/services/veiculoService.ts
import db from '../../database/DatabaseInit';

export interface DadosNovoVeiculo {
  tipo: string;
  marca: string;
  modelo: string;
  ano: string | number;
  motor: string;
  placa: string;
  km_atual: number;
  ativo?: number;
  id_user: number;
}

export const VeiculoService = {
  inserirVeiculo: async (dados: DadosNovoVeiculo) => {
    try {
      console.log(
        '[VeiculoService] Recebendo dados para inserção:',
        dados,
      );

      const result = await db.runAsync(
        `INSERT INTO veiculos (tipo, marca, modelo, ano, motor, placa, km_atual, ativo, id_user) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          dados.tipo,
          dados.marca || '',
          dados.modelo,
          parseInt(dados.ano as string) || 0,
          dados.motor || '',
          (dados.placa || '').toUpperCase().trim(),
          dados.km_atual || 0,
          dados.ativo !== undefined ? dados.ativo : 0,
          dados.id_user, // Aqui garantimos que a chave estrangeira será salva!
        ],
      );

      return result.lastInsertRowId;
    } catch (error) {
      console.error(
        '[VeiculoService] Erro crítico ao inserir veículo:',
        error,
      );
      throw error;
    }
  },
};
