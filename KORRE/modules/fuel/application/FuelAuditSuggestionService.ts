import type { SugestaoCampo } from '../../indicesKorre/suggestions';

export const FuelAuditSuggestionService = {
  async gerarSugestoes(veiculoId: number): Promise<SugestaoCampo[]> {
    const db = (await import('../../../database/DatabaseInit')).default;
    const resumo = await db.getFirstAsync<{
      consumo_km_l: number | null;
      confianca_calculo: 'alta' | 'media' | 'baixa' | null;
    }>(
      `SELECT consumo_km_l, confianca_calculo
       FROM consumo_veiculo_periodo
       WHERE veiculo_id = ?
       ORDER BY data_calculo DESC, id DESC
       LIMIT 1`,
      [veiculoId],
    );
    const preco = await db.getFirstAsync<{ media: number | null }>(
      `SELECT AVG(preco_unitario) as media
       FROM abastecimentos
       WHERE veiculo_id = ? AND preco_unitario IS NOT NULL`,
      [veiculoId],
    );

    const sugestoes: SugestaoCampo[] = [];
    if (Number(resumo?.consumo_km_l || 0) > 0) {
      sugestoes.push({
        campo: 'rendimento_energia_unidade',
        valor: Number(Number(resumo?.consumo_km_l || 0).toFixed(2)),
        fonte: 'historico_abastecimento',
        confianca: resumo?.confianca_calculo ?? 'baixa',
        explicacao:
          'Consumo real sugerido com base nos ultimos abastecimentos.',
        aplicadoAutomaticamente: false,
      });
    }
    if (Number(preco?.media || 0) > 0) {
      sugestoes.push({
        campo: 'preco_energia_unidade',
        valor: Number(Number(preco?.media || 0).toFixed(3)),
        fonte: 'historico_abastecimento',
        confianca: 'media',
        explicacao:
          'Preco medio sugerido com base no historico de abastecimento.',
        aplicadoAutomaticamente: false,
      });
    }
    return sugestoes;
  },
};
