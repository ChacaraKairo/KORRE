// database/repositories/CalculadoraRepository.ts
import db from '../DatabaseInit';

/**
 * 1. Definição de Interface Completa
 * Reflete exatamente os campos da tabela parametros_financeiros
 */
export interface ParametrosFinanceiros {
  veiculo_id: number;
  estado_uf: string;
  tipo_aquisicao: string;
  valor_veiculo_fipe: number;
  depreciacao_real_estimada: number;
  custo_oportunidade_selic: number;
  juros_financiamento_mensal: number;
  diaria_aluguel: number;
  caucao_aluguel_mensalizado: number;
  taxa_administracao_consorcio: number;
  custo_reparacao_emprestimo: number;
  ipva_anual: number;
  licenciamento_detran_anual: number;
  imposto_mei_mensal: number;
  imposto_renda_mensal: number;
  taxa_vistoria_gnv_anual: number;
  taxas_alvaras_municipais_anual: number;
  seguro_comercial_anual: number;
  rastreador_telemetria_mensal: number;
  plano_dados_mensal: number;
  rendimento_energia_unidade: number;
  preco_energia_unidade: number;
  valor_oleo_filtros: number;
  intervalo_oleo_filtros_km: number;
  valor_jogo_pneus: number;
  durabilidade_pneus_km: number;
  valor_manutencao_freios: number;
  intervalo_freios_km: number;
  valor_kit_transmissao: number;
  durabilidade_transmissao_km: number;
  fundo_depreciacao_bateria_por_km: number;
  manutencao_imprevista_mensal: number;
  limpeza_higienizacao_mensal: number;
  alimentacao_diaria: number;
  consumo_apoio_diario: number;
  plano_saude_mensal: number;
  fundo_emergencia_percentual: number;
  provisao_ferias_mensal: number;
  provisao_decimo_terceiro_mensal: number;
  salario_liquido_mensal_desejado: number;
  valor_smartphone: number;
  vida_util_smartphone_meses: number;
  custo_powerbanks_cabos_mensal: number;
  custo_suportes_capas_mensal: number;
  custo_bag_mochila_mensal: number;
  custo_vestuario_protecao_mensal: number;
  percentual_dead_miles: number;
  tempo_espera_medio_minutos: number;
  taxas_saque_antecipacao_mensal: number;
  provisao_multas_mensal: number;
  dias_trabalhados_semana: number;
  horas_por_dia: number;
  km_por_dia: number;
  [key: string]: any;
}

export interface DadosOficina {
  valorOleo: number | null;
  kmOleo: number | null;
  valorPneu: number | null;
  kmPneu: number | null;
}

export const CalculadoraRepository = {
  /**
   * Puxa o veículo marcado como ativo no sistema
   */
  getVeiculoAtivo: async () => {
    return await db.getFirstAsync<any>(
      'SELECT * FROM veiculos WHERE ativo = 1 LIMIT 1',
    );
  },

  /**
   * Busca os parâmetros financeiros de um veículo específico
   */
  getParametrosSalvos: async (
    veiculoId: number,
  ): Promise<ParametrosFinanceiros | null> => {
    return await db.getFirstAsync<ParametrosFinanceiros>(
      'SELECT * FROM parametros_financeiros WHERE veiculo_id = ?',
      [veiculoId],
    );
  },

  /**
   * Puxa dados reais da oficina para preenchimento automático/base
   * Utiliza subqueries para buscar o último histórico de valor e intervalo cadastrado
   */
  getDadosDaOficina: async (
    veiculoId: number,
  ): Promise<DadosOficina> => {
    const query = `
      SELECT 
        (SELECT h.valor FROM itens_manutencao i 
         LEFT JOIN historico_manutencao h ON h.item_id = i.id 
         WHERE i.veiculo_id = ? AND (i.nome LIKE '%óleo%' OR i.nome LIKE '%oleo%') 
         ORDER BY h.data_servico DESC, h.id DESC LIMIT 1) as valorOleo,
        (SELECT i.intervalo_km FROM itens_manutencao i 
         WHERE i.veiculo_id = ? AND (i.nome LIKE '%óleo%' OR i.nome LIKE '%oleo%') LIMIT 1) as kmOleo,
        (SELECT h.valor FROM itens_manutencao i 
         LEFT JOIN historico_manutencao h ON h.item_id = i.id 
         WHERE i.veiculo_id = ? AND i.nome LIKE '%pneu%' 
         ORDER BY h.data_servico DESC, h.id DESC LIMIT 1) as valorPneu,
        (SELECT i.intervalo_km FROM itens_manutencao i 
         WHERE i.veiculo_id = ? AND i.nome LIKE '%pneu%' LIMIT 1) as kmPneu
    `;

    const result = await db.getFirstAsync<any>(query, [
      veiculoId,
      veiculoId,
      veiculoId,
      veiculoId,
    ]);

    return {
      valorOleo: result?.valorOleo ?? null,
      kmOleo: result?.kmOleo ?? null,
      valorPneu: result?.valorPneu ?? null,
      kmPneu: result?.kmPneu ?? null,
    };
  },

  /**
   * Salva ou Atualiza os parâmetros financeiros usando UPSERT
   */
  salvarParametros: async (
    veiculoId: number,
    form: Partial<ParametrosFinanceiros>,
  ) => {
    // 1. Unificamos os dados garantindo a tipagem
    const data: ParametrosFinanceiros = {
      ...(form as ParametrosFinanceiros), // Cast seguro para garantir preenchimento
      veiculo_id: veiculoId,
    };

    // 2. Extraímos as chaves tipadas como chaves de ParametrosFinanceiros
    // Isso evita o erro de "string can't be used to index..."
    const campos = (
      Object.keys(data) as Array<
        keyof ParametrosFinanceiros
      >
    ).filter((key) => key !== 'id');

    const placeholders = campos.map(() => '?').join(', ');

    const updates = campos
      .filter((campo) => campo !== 'veiculo_id')
      .map(
        (campo) =>
          `${String(campo)} = EXCLUDED.${String(campo)}`,
      )
      .join(', ');

    const sql = `
      INSERT INTO parametros_financeiros (${campos.join(', ')})
      VALUES (${placeholders})
      ON CONFLICT(veiculo_id) DO UPDATE SET
      ${updates}
    `;

    // 3. O mapeamento agora é seguro pois 'campo' é 'keyof ParametrosFinanceiros'
    const valores = campos.map((campo) => data[campo]);

    try {
      await db.runAsync(sql, valores);
    } catch (error) {
      console.error(
        '[CalculadoraRepository] Erro no UPSERT:',
        error,
      );
      throw error;
    }
  },

  /**
   * Persiste os resultados finais (Índices Mágicos) na tabela de veículos
   * Isso alimenta o Dashboard e o Semáforo de Viabilidade de forma instantânea
   */
  salvarIndicesNoVeiculo: async (
    veiculoId: number,
    ikm: number,
    iminCusto: number,
    iminMeta: number,
    completude: number,
  ) => {
    const sql = `
      UPDATE veiculos SET 
        custo_km_calculado = ?, 
        custo_minuto_calculado = ?, 
        meta_ganho_minuto_calculado = ?, 
        taxa_completude = ? 
      WHERE id = ?
    `;

    try {
      await db.runAsync(sql, [
        ikm,
        iminCusto,
        iminMeta,
        completude,
        veiculoId,
      ]);
    } catch (error) {
      console.error(
        '[CalculadoraRepository] Erro ao salvar índices no veículo:',
        error,
      );
      throw error;
    }
  },
};
