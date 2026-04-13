// Arquivo: src/hooks/oficina/useOficinaMutacoes.ts
import { useState } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useOficinaMutacoes(
  veiculoConsultado: any,
  atualizarDadosTela: () => Promise<void>,
) {
  // Controle do Modal de Novo Item (apenas visibilidade)
  const [modalNovoItem, setModalNovoItem] = useState(false);

  // Estado do Modal de Reset (Realizar Manutenção)
  const [modalReset, setModalReset] = useState<{
    visivel: boolean;
    item: any;
    ultimoValor: number;
  }>({ visivel: false, item: null, ultimoValor: 0 });

  /**
   * Helper para formatar data local (YYYY-MM-DD) e evitar erro de fuso horário
   */
  const formatarDataLocal = (d: Date) => {
    const pad = (n: number) =>
      n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  /**
   * Prepara os dados para abrir o modal de confirmação de manutenção realizada
   */
  const handleReset = async (item: any) => {
    if (!veiculoConsultado) return;
    try {
      let ultimoValor = 0;
      if (!item.isVirtual) {
        const historico: any = await db.getFirstAsync(
          'SELECT valor FROM historico_manutencao WHERE item_id = ? ORDER BY id DESC LIMIT 1',
          [item.id],
        );
        ultimoValor = historico?.valor || 0;
      }
      setModalReset({ visivel: true, item, ultimoValor });
    } catch (error) {
      setModalReset({
        visivel: true,
        item,
        ultimoValor: 0,
      });
    }
  };

  /**
   * Processa a renovação do ciclo da manutenção, salva no histórico e gera despesa financeira
   */
  const handleConfirmReset = async (
    valorPago: number,
    novoIntKm: number | null,
    novoIntMeses: number | null,
  ) => {
    const item = modalReset.item;
    if (!item || !veiculoConsultado) return;

    try {
      let itemIdToUse = item.id;
      // CORREÇÃO: Usar data local em vez de ISOString para evitar erro de fuso
      const agoraLocal = formatarDataLocal(new Date());

      // 1. Se o item era virtual (sugerido), primeiro transformamos em item real no banco
      if (item.isVirtual) {
        const result: any = await db.runAsync(
          `INSERT INTO itens_manutencao (veiculo_id, nome, icone, ultima_troca_km, intervalo_km, ultima_troca_data, intervalo_meses, criticidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            veiculoConsultado.id,
            item.nome,
            item.icone,
            veiculoConsultado.km_atual,
            novoIntKm,
            agoraLocal,
            novoIntMeses,
            item.criticidade || 'media',
          ],
        );
        itemIdToUse = result.lastInsertRowId;
      } else {
        // Se já era real, apenas atualizamos a data e KM da última troca
        await db.runAsync(
          'UPDATE itens_manutencao SET ultima_troca_km = ?, ultima_troca_data = ?, intervalo_km = ?, intervalo_meses = ? WHERE id = ?',
          [
            veiculoConsultado.km_atual,
            agoraLocal,
            novoIntKm,
            novoIntMeses,
            itemIdToUse,
          ],
        );
      }

      // 2. Registra no histórico de manutenções
      await db.runAsync(
        `INSERT INTO historico_manutencao (veiculo_id, item_id, descricao, valor, km_servico, data_servico) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          veiculoConsultado.id,
          itemIdToUse,
          `Manutenção: ${item.nome}`,
          valorPago,
          veiculoConsultado.km_atual,
          agoraLocal,
        ],
      );

      // 3. Gestão Financeira: Busca ou cria categoria e gera transação
      let categoriaId = null;
      const categoria: any = await db.getFirstAsync(
        "SELECT id FROM categorias_financeiras WHERE nome = ? AND tipo = 'despesa' LIMIT 1",
        [item.nome],
      );

      if (categoria) {
        categoriaId = categoria.id;
      } else {
        const iconeFormatado = item.icone
          ? item.icone
              .split('-')
              .map(
                (p: string) =>
                  p.charAt(0).toUpperCase() + p.slice(1),
              )
              .join('')
          : 'Wrench';

        // CORREÇÃO: Alterado de icone_id para icone
        const result: any = await db.runAsync(
          "INSERT INTO categorias_financeiras (nome, tipo, icone, cor) VALUES (?, 'despesa', ?, '#795548')",
          [item.nome, iconeFormatado],
        );
        categoriaId = result.lastInsertRowId;
      }

      await db.runAsync(
        `INSERT INTO transacoes_financeiras (veiculo_id, categoria_id, valor, tipo, data_transacao) VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
        [
          veiculoConsultado.id,
          categoriaId,
          valorPago,
          'despesa',
        ],
      );

      // 4. Finalização
      await atualizarDadosTela();
      setModalReset({
        visivel: false,
        item: null,
        ultimoValor: 0,
      });
      showCustomAlert(
        'Sucesso',
        'Manutenção registrada e ciclo renovado!',
      );
    } catch (error) {
      console.error('Erro ao resetar manutenção:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível registrar a manutenção.',
      );
    }
  };

  return {
    modalNovoItem,
    setModalNovoItem,
    modalReset,
    setModalReset,
    handleReset,
    handleConfirmReset,
  };
}
