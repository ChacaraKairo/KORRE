// src/hooks/configuracoes/useExportarDados.ts
import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';

export function useExportarDados() {
  const [isExportando, setIsExportando] = useState(false);

  const exportarDados = async () => {
    setIsExportando(true);
    try {
      const tabelas = [
        'perfil_usuario',
        'veiculos',
        'parametros_financeiros',
        'categorias_financeiras',
        'transacoes_financeiras',
        'itens_manutencao',
        'historico_manutencao',
        'notificacoes',
      ];

      const backupData: any = {
        app: 'MeuCorre',
        data_exportacao: new Date().toISOString(),
        tabelas: {},
      };

      for (const tabela of tabelas) {
        const rows = await db.getAllAsync(
          `SELECT * FROM ${tabela}`,
        );
        backupData.tabelas[tabela] = rows;
      }

      const fileUri =
        FileSystem.documentDirectory +
        'MeuCorre_Backup.json';
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(backupData, null, 2),
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      showCustomAlert(
        'Erro',
        'Falha ao gerar arquivo de backup.',
      );
    } finally {
      setIsExportando(false);
    }
  };

  return { exportarDados, isExportando };
}
