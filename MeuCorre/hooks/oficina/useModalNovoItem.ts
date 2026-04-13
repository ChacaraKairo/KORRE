// src/hooks/oficina/useModalNovoItem.ts
import { useState } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

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

  const salvarManutencao = async () => {
    if (!nome || (!intervalo && !tempo)) {
      showCustomAlert(
        'Atenção',
        'Preencha o nome e um intervalo.',
      );
      return;
    }

    try {
      let dataFormatada = null;
      if (ultimaTrocaData.length === 10) {
        const [d, m, a] = ultimaTrocaData.split('/');
        dataFormatada = `${a}-${m}-${d}`;
      }

      // 1. Salva o item de manutenção
      const result: any = await db.runAsync(
        `INSERT INTO itens_manutencao 
        (veiculo_id, nome, icone, intervalo_km, intervalo_meses, ultima_troca_km, ultima_troca_data, criticidade) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          veiculoId,
          nome,
          icone,
          parseInt(intervalo) || null,
          parseInt(tempo) || null,
          parseInt(ultimaTrocaKm) || null,
          dataFormatada,
          'media',
        ],
      );

      const novoItemId = result.lastInsertRowId;
      const valorNumerico =
        parseFloat(preco.replace(',', '.')) || 0;

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
