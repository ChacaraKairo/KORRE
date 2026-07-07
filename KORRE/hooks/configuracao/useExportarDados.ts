import { useState } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';
import {
  BACKUP_APP_NAME,
  BACKUP_EXPORT_COLUMNS,
  BACKUP_SCHEMA_VERSION,
  BACKUP_TABLES,
} from '../../constants/backupSchema';
import {
  hideAppLoading,
  showAppLoadingAsync,
} from '../ui/useAppLoading';
import { logger } from '../../utils/logger';
import { criarNotificacao } from '../../notifications/NotificationService';
import { AppRoutes } from '../../constants/routes';

const BACKUP_MIME = 'application/octet-stream';
const BACKUP_EXTENSION = 'korrebackup';

export function useExportarDados() {
  const { t } = useTranslation();
  const [isExportando, setIsExportando] = useState(false);

  const montarBackup = async () => {
    const backupData: any = {
      app: BACKUP_APP_NAME,
      data_exportacao: new Date().toISOString(),
      versao_banco: BACKUP_SCHEMA_VERSION,
      tabelas: {},
    };

    for (const tabela of BACKUP_TABLES) {
      const tableInfo = await db.getAllAsync<{ name: string }>(
        `PRAGMA table_info(${tabela});`,
      );
      const colunasExistentes = new Set(
        tableInfo.map((column) => column.name),
      );
      const colunas = BACKUP_EXPORT_COLUMNS[tabela].filter(
        (column) => colunasExistentes.has(column),
      );

      if (colunas.length === 0) {
        backupData.tabelas[tabela] = [];
        continue;
      }

      backupData.tabelas[tabela] = await db.getAllAsync(
        `SELECT ${colunas.join(', ')} FROM ${tabela}`,
      );
    }

    return backupData;
  };

  const registrarBackupExportado = async () => {
    await db.runAsync(
      'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
      ['ultimo_backup_exportado_em', new Date().toISOString()],
    );
  };

  const exportarDados = async () => {
    if (isExportando) return;

    setIsExportando(true);
    await showAppLoadingAsync(t('configuracoes.gerando_backup'));

    try {
      const backupData = await montarBackup();
      const backupContent = JSON.stringify(backupData, null, 2);
      const nomeArquivo = `KORRE_Backup_v${BACKUP_SCHEMA_VERSION}.${BACKUP_EXTENSION}`;
      const fileUri = FileSystem.documentDirectory + nomeArquivo;

      await FileSystem.writeAsStringAsync(fileUri, backupContent);

      if (
        Platform.OS === 'android' &&
        FileSystem.StorageAccessFramework
      ) {
        hideAppLoading();
        const permission =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permission.granted) {
          await showAppLoadingAsync(t('configuracoes.salvando_backup'));
          const destinationUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              permission.directoryUri,
              nomeArquivo,
              BACKUP_MIME,
            );
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            destinationUri,
            backupContent,
          );
          await registrarBackupExportado();
          await criarNotificacao({
            titulo: t('notifications.backup.export_success_title'),
            mensagem: t('notifications.backup.export_saved_body'),
            tipo: 'backup',
            prioridade: 'baixa',
            destino: AppRoutes.configuracoes,
            canal: 'historico',
            grupoPreferencia: 'backup',
            dedupKey: `backup_exportado:${Date.now()}`,
          });
          hideAppLoading();
          showCustomAlert(
            t('configuracoes.backup_salvo'),
            t('configuracoes.backup_salvo_msg'),
          );
          return;
        }
      }

      if (await Sharing.isAvailableAsync()) {
        await showAppLoadingAsync(
          t('configuracoes.abrindo_compartilhamento'),
        );
        await Sharing.shareAsync(fileUri, {
          mimeType: BACKUP_MIME,
          dialogTitle: t('configuracoes.exportar_backup_titulo'),
          UTI: 'public.data',
        });
        await registrarBackupExportado();
        await criarNotificacao({
          titulo: t('notifications.backup.export_success_title'),
          mensagem: t('notifications.backup.export_success_body'),
          tipo: 'backup',
          prioridade: 'baixa',
          destino: AppRoutes.configuracoes,
          canal: 'historico',
          grupoPreferencia: 'backup',
          dedupKey: `backup_exportado:${Date.now()}`,
        });
        hideAppLoading();
        showCustomAlert(
          t('configuracoes.backup_pronto'),
          t('configuracoes.backup_pronto_msg'),
        );
      } else {
        hideAppLoading();
        showCustomAlert(
          t('configuracoes.backup_gerado'),
          t('configuracoes.backup_compartilhamento_indisponivel'),
        );
      }
    } catch (error) {
      hideAppLoading();
      logger.error('[Backup] Falha ao exportar:', error);
      showCustomAlert(
        t('configuracoes.erro_backup'),
        t('configuracoes.erro_backup_msg'),
      );
      await criarNotificacao({
        titulo: t('notifications.backup.export_failed_title'),
        mensagem: t('notifications.backup.export_failed_body'),
        tipo: 'backup',
        prioridade: 'alta',
        destino: AppRoutes.configuracoes,
        canal: 'historico',
        grupoPreferencia: 'backup',
        dedupKey: `backup_falhou:${new Date().toISOString().slice(0, 10)}`,
      });
    } finally {
      setIsExportando(false);
    }
  };

  return {
    exportarDados,
    isExportando,
  };
}
