import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import db from '../../database/DatabaseInit';

export const useExplore = () => {
  const [tabelas, setTabelas] = useState<string[]>([]);
  const [tabelaSelecionada, setTabelaSelecionada] =
    useState<string | null>(null);
  const [dados, setDados] = useState<any[]>([]);
  const [colunas, setColunas] = useState<string[]>([]);

  useEffect(() => {
    carregarTabelas();
  }, []);

  useEffect(() => {
    if (tabelaSelecionada) {
      carregarDadosTabela(tabelaSelecionada);
    }
  }, [tabelaSelecionada]);

  const carregarTabelas = async () => {
    try {
      const resultado: any[] = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence' AND name != 'android_metadata'",
      );
      setTabelas(resultado.map((item) => item.name));
      if (resultado.length > 0 && !tabelaSelecionada) {
        setTabelaSelecionada(resultado[0].name);
      }
    } catch (error) {
      console.error('Erro ao listar tabelas:', error);
    }
  };

  const carregarDadosTabela = async (
    nomeTabela: string,
  ) => {
    try {
      const resultado: any[] = await db.getAllAsync(
        `SELECT * FROM ${nomeTabela}`,
      );
      setDados(resultado);
      setColunas(
        resultado.length > 0
          ? Object.keys(resultado[0])
          : [],
      );
    } catch (error) {
      console.error(
        `Erro ao ler tabela ${nomeTabela}:`,
        error,
      );
      setDados([]);
    }
  };

  const limparTabela = async () => {
    if (!tabelaSelecionada) return;
    Alert.alert(
      'Limpar Tabela',
      `Tem certeza que deseja apagar todos os dados de ${tabelaSelecionada}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await db.runAsync(
              `DELETE FROM ${tabelaSelecionada}`,
            );
            carregarDadosTabela(tabelaSelecionada);
          },
        },
      ],
    );
  };

  return {
    tabelas,
    tabelaSelecionada,
    setTabelaSelecionada,
    dados,
    colunas,
    carregarDadosTabela,
    limparTabela,
  };
};
