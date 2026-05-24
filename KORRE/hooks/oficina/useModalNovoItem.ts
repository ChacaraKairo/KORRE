// src/hooks/oficina/useModalNovoItem.ts
import { useState } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';
import {
  hideAppLoading,
  showAppLoadingAsync,
} from '../ui/useAppLoading';

/**
 * Executa a função de use modal novo item.
 */
export function useModalNovoItem(
  veiculoId: number,
  onSucesso: () => void,
) {
  const [nome, setNome] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [tempo, setTempo] = useState('');
  const [ultimaTrocaKm, setUltimaTrocaKm] = useState('');
  const [ultimaTrocaData, setUltimaTrocaData] =
    useState('');
  const [icone, setIcone] = useState('Wrench'); // Padronizado para CamelCase

  const [preco, setPreco] = useState('');
  const [salvarNoFinanceiro, setSalvarNoFinanceiro] =
    useState(true);

  /**
   * Executa a função de reset form.
   */
  const resetForm = () => {
    setNome('');
    setIntervalo('');
    setTempo('');
    setUltimaTrocaKm('');
    setUltimaTrocaData('');
    setIcone('Wrench');
    setPreco('');
    setSalvarNoFinanceiro(true);
  };

  /**
   * Executa a função de salvar manutencao.
   */
  const salvarManutencao = async () => {
    if (!nome || (!intervalo && !tempo)) {
      showCustomAlert(
        'Atenção',
        'Preencha o nome e um intervalo.',
      );
      return;
    }

    try {
      await showAppLoadingAsync('Salvando manutenção...');
      let dataFormatada = null;
      if (ultimaTrocaData.length === 10) {
        const [d, m, a] = ultimaTrocaData.split('/');
        dataFormatada = `${a}-${m}-${d}`;
      }

      // 1. Salva o item de manutenção
      const valorNumerico =
        parseFloat(preco.replace(',', '.')) || 0;

      const result: any = await db.runAsync(
        `INSERT INTO itens_manutencao 
        (veiculo_id, nome, icone, intervalo_km, intervalo_meses, ultima_troca_km, ultima_troca_data, criticidade, valor_previsto, origem, tem_historico_real, computar_no_custo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', ?, 1)`,
        [
          veiculoId,
          nome,
          icone,
          parseInt(intervalo) || null,
          parseInt(tempo) || null,
          parseInt(ultimaTrocaKm) || null,
          dataFormatada,
          'media',
          valorNumerico,
          salvarNoFinanceiro && valorNumerico > 0 ? 1 : 0,
        ],
      );

      const novoItemId = result.lastInsertRowId;

      // 2. Se o usuário quiser salvar no financeiro e houver um preço
      if (salvarNoFinanceiro && valorNumerico > 0) {
        // Criar registro no histórico de manutenção
        await db.runAsync(
          `INSERT INTO historico_manutencao (veiculo_id, item_id, descricao, valor, km_servico) VALUES (?, ?, ?, ?, ?)`,
          [
            veiculoId,
            novoItemId,
            `Cadastro Inicial: ${nome}`,
            valorNumerico,
            parseInt(ultimaTrocaKm) || 0,
          ],
        );

        // Lógica de categoria financeira (Busca ou Cria)
        let categoriaId = null;
        const categoria: any = await db.getFirstAsync(
          "SELECT id FROM categorias_financeiras WHERE nome = ? AND tipo = 'despesa' LIMIT 1",
          [nome],
        );

        if (categoria) {
          categoriaId = categoria.id;
        } else {
          // CORREÇÃO: Alterado 'icone_id' para 'icone' para bater com DatabaseInit.ts
          const resultCat: any = await db.runAsync(
            "INSERT INTO categorias_financeiras (nome, tipo, icone, cor) VALUES (?, 'despesa', 'Wrench', '#795548')",
            [nome],
          );
          categoriaId = resultCat.lastInsertRowId;
        }

        // Lança a transação financeira
        await db.runAsync(
          `INSERT INTO transacoes_financeiras (veiculo_id, categoria_id, valor, tipo, data_transacao) VALUES (?, ?, ?, ?, datetime('now', 'localtime'))`,
          [
            veiculoId,
            categoriaId,
            valorNumerico,
            'despesa',
          ],
        );
      }

      showCustomAlert('Sucesso', 'Manutenção configurada!');
      resetForm();
      onSucesso();
    } catch (error) {
      console.error(error);
      showCustomAlert(
        'Erro',
        'Falha ao salvar a manutenção.',
      );
    } finally {
      hideAppLoading();
    }
  };

  return {
    nome,
    setNome,
    intervalo,
    setIntervalo,
    tempo,
    setTempo,
    ultimaTrocaKm,
    setUltimaTrocaKm,
    ultimaTrocaData,
    setUltimaTrocaData,
    icone,
    setIcone,
    preco,
    setPreco,
    salvarNoFinanceiro,
    setSalvarNoFinanceiro,
    salvarManutencao,
  };
}
