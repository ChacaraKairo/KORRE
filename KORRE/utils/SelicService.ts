// src/services/SelicService.ts
import db from '../database/DatabaseInit';

const BCB_API_URL =
  'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json';

export const SelicService = {
  /**
   * Verifica e atualiza a Selic se for o dia 1 e ainda não tiver sido atualizada no mês
   */
  validarEAtualizarSelic: async () => {
    const hoje = new Date();
    const dia = hoje.getDate();
    const mesAnoAtual = `${hoje.getMonth() + 1}-${hoje.getFullYear()}`;

    // 1. Só tenta se for dia 1 (ou se você quiser garantir que ocorra na primeira vez do mês)
    if (dia !== 1) return;

    try {
      // 2. Verifica no banco se já atualizamos este mês (usando uma tabela de config)
      const config = await db.getFirstAsync<{
        valor: string;
      }>(
        "SELECT valor FROM configuracoes_app WHERE chave = 'ultima_atualizacao_selic'",
      );

      if (config?.valor === mesAnoAtual) {
        console.log('[Selic] Já atualizado este mês.');
        return;
      }

      // 3. Busca na API do Banco Central (Série 432 - Selic Meta)
      const response = await fetch(BCB_API_URL);
      const dados = await response.json();
      const novaTaxa = parseFloat(dados[0].valor);

      if (isNaN(novaTaxa)) return;

      // 4. Salva no banco (Upsert na tabela de config e log de histórico se desejar)
      await db.execAsync(`
        INSERT INTO configuracoes_app (chave, valor) VALUES ('taxa_selic_atual', '${novaTaxa}')
        ON CONFLICT(chave) DO UPDATE SET valor = '${novaTaxa}';
        
        INSERT INTO configuracoes_app (chave, valor) VALUES ('ultima_atualizacao_selic', '${mesAnoAtual}')
        ON CONFLICT(chave) DO UPDATE SET valor = '${mesAnoAtual}';
      `);

      console.log(`[Selic] Atualizada para ${novaTaxa}%`);
    } catch (error) {
      console.error('[Selic] Erro ao buscar taxa:', error);
    }
  },
};
