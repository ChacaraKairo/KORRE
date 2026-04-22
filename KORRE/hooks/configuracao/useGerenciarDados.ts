// src/hooks/configuracoes/useGerenciarDados.ts
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useGerenciarDados() {
  const router = useRouter();

  const executarRestauracao = async (data: any) => {
    const tabelas_data = data.tabelas ?? data;
    try {
      await db.execAsync('PRAGMA foreign_keys = OFF;');
      await db.execAsync('BEGIN TRANSACTION;');

      const ordem = [
        'perfil_usuario',
        'veiculos',
        'parametros_financeiros',
        'categorias_financeiras',
        'transacoes_financeiras',
        'itens_manutencao',
        'historico_manutencao',
        'notificacoes',
      ];

      for (const tabela of ordem) {
        await db.execAsync(`DELETE FROM ${tabela};`);
        const rows = tabelas_data[tabela];
        if (rows && rows.length > 0) {
          const colunas = Object.keys(rows[0]);
          const placeholders = colunas
            .map(() => '?')
            .join(', ');
          for (const row of rows) {
            await db.runAsync(
              `INSERT OR REPLACE INTO ${tabela} (${colunas.join(', ')}) VALUES (${placeholders})`,
              colunas.map((c) => row[c]),
            );
          }
        }
      }

      await db.execAsync('COMMIT;');
      await db.execAsync('PRAGMA foreign_keys = ON;');

      Alert.alert(
        'Sucesso',
        'Backup restaurado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/cadastro'),
          },
        ],
      );
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      await db.execAsync('PRAGMA foreign_keys = ON;');
      showCustomAlert(
        'Erro',
        'Ficheiro de backup inválido.',
      );
    }
  };

  const importarBackup = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });
      if (!res.canceled) {
        const content = await FileSystem.readAsStringAsync(
          res.assets[0].uri,
        );
        executarRestauracao(JSON.parse(content));
      }
    } catch (e) {
      showCustomAlert(
        'Erro',
        'Não foi possível ler o arquivo.',
      );
    }
  };

  const limparTodosOsDados = () => {
    Alert.alert(
      'Limpar tudo?',
      'Isto apagará permanentemente seu perfil e histórico.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await db.execAsync(
              'PRAGMA foreign_keys = OFF;',
            );
            const tabelas = [
              'transacoes_financeiras',
              'veiculos',
              'perfil_usuario',
              'notificacoes',
              'parametros_financeiros',
            ];
            for (const t of tabelas)
              await db.execAsync(`DELETE FROM ${t};`);
            await db.execAsync('PRAGMA foreign_keys = ON;');
            router.replace('/cadastro');
          },
        },
      ],
    );
  };

  return { importarBackup, limparTodosOsDados };
}
