import db from '../../../database/DatabaseInit';
import type { RideDecisionResult } from '../domain/types';

export interface RideAnalysisRecord {
  id: number;
  veiculo_id: number | null;
  valor_oferecido: number;
  distancia_embarque_km: number;
  distancia_corrida_km: number;
  tempo_total_minutos: number;
  custo_estimado: number;
  lucro_estimado: number;
  lucro_por_hora: number;
  decisao: string;
  data_analise: string;
}

interface SaveRideAnalysisInput {
  veiculoId: number | null;
  valorOferta: number;
  kmAteEmbarque: number;
  kmViagem: number;
  tempoTotalMinutos: number;
  resultado: RideDecisionResult;
}

export const RideAnalysisRepository = {
  async salvar(input: SaveRideAnalysisInput) {
    await db.runAsync(
      `INSERT INTO analises_corrida (
        veiculo_id,
        valor_oferecido,
        distancia_embarque_km,
        distancia_corrida_km,
        tempo_total_minutos,
        custo_estimado,
        lucro_estimado,
        lucro_por_hora,
        decisao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.veiculoId,
        input.valorOferta,
        input.kmAteEmbarque,
        input.kmViagem,
        input.tempoTotalMinutos,
        input.resultado.custoTotal,
        input.resultado.lucroLiquido,
        input.resultado.lucroPorHora,
        input.resultado.decisao,
      ],
    );
  },

  async listarRecentes(limit = 5) {
    return db.getAllAsync<RideAnalysisRecord>(
      `SELECT *
       FROM analises_corrida
       ORDER BY data_analise DESC, id DESC
       LIMIT ?`,
      [limit],
    );
  },
};
