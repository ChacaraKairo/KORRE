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
      // 1. Lista de todas as tabelas para garantir exportação total
      const tabelas = [
        'perfil_usuario',
        'veiculos',
        'parametros_financeiros', // Adicionado para salvar custos da calculadora
        'categorias_financeiras',
        'transacoes_financeiras',
        'itens_manutencao',
        'historico_manutencao',
        'notificacoes',
      ];

      const backupData: any = {};

      // 2. Busca dinâmica de dados para evitar repetição de código
      for (const tabela of tabelas) {
        const rows = await db.getAllAsync(
          `SELECT * FROM ${tabela}`,
        );
        backupData[tabela] = rows;
      }

      // 3. Montar o "Super Objeto" formatado
      const backupCompleto = {
        app: 'MeuCorre',
        data_exportacao: new Date().toISOString(),
        versao_banco: 1,
        tabelas: backupData,
      };

      const jsonString = JSON.stringify(
        backupCompleto,
        null,
        2,
      );

      // 4. Caminho do arquivo
      const fileUri =
        FileSystem.documentDirectory +
        'MeuCorre_Backup.json';

      // 5. Salvar o arquivo JSON temporariamente
      await FileSystem.writeAsStringAsync(
        fileUri,
        jsonString,
        {
          encoding: FileSystem.EncodingType.UTF8,
        },
      );

      // 6. Abrir compartilhamento nativo
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Backup do MeuCorre',
          UTI: 'public.json',
        });
      } else {
        showCustomAlert(
          'Erro',
          'A partilha não está disponível neste dispositivo.',
        );
      }
    } catch (error) {
      console.error('Erro ao exportar Backup:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível gerar o ficheiro de backup completo.',
      );
    } finally {
      setIsExportando(false);
    }
  };

  return { exportarDados, isExportando };
}
