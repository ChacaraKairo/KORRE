import { Alert } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';
import { BACKUP_TABLES } from '../../constants/backupSchema';
import { BackupRestoreService } from '../../services/BackupRestoreService';
import { logger } from '../../utils/logger';
import {
  hideAppLoading,
  showAppLoadingAsync,
} from '../ui/useAppLoading';
import {
  decryptJson,
  isEncryptedPayload,
} from '../../utils/security/encryption';
import { useBackupPasswordPrompt } from './useBackupPasswordPrompt';
import { AppRoutes } from '../../constants/routes';
import { criarNotificacao } from '../../notifications/NotificationService';

const BACKUP_PICKER_TYPES = [
  'application/json',
  'application/octet-stream',
  '*/*',
];

const mostrarErroBackup = (titulo: string, mensagem: string) => {
  Alert.alert(titulo, mensagem);
  showCustomAlert(titulo, mensagem);
};

export function useGerenciarDados() {
  const router = useRouter();
  const { t } = useTranslation();
  const [importandoBackup, setImportandoBackup] =
    useState(false);
  const {
    backupPasswordPrompt,
    requestPassword,
    submitPassword,
    cancelPassword,
  } = useBackupPasswordPrompt();

  const decodeBackupContent = async (content: string) => {
    try {
      return JSON.parse(content);
    } catch (error) {
      logger.warn('[Backup] Conteudo nao e JSON puro:', error);
    }

    if (!isEncryptedPayload(content)) {
      throw new Error('Backup nao e JSON nem payload criptografado.');
    }

    const passphrase = await requestPassword(
      t('configuracoes.senha_backup_label'),
      t('configuracoes.senha_backup_restaurar_msg'),
    );

    if (passphrase === null) return null;

    try {
      return decryptJson(content, passphrase);
    } catch (error) {
      logger.error('[Backup] Falha ao descriptografar:', error);
      mostrarErroBackup(
        t('common.erro'),
        t('configuracoes.senha_backup_incorreta'),
      );
      return null;
    }
  };

  const executarRestauracao = async (data: unknown) => {
    setImportandoBackup(true);
    await showAppLoadingAsync(t('configuracoes.restaurando_backup'));

    try {
      await BackupRestoreService.restaurarBackup(data, {
        onProgress: showAppLoadingAsync,
      });

      hideAppLoading();
      Alert.alert(
        t('configuracoes.backup_restaurado'),
        t('configuracoes.backup_restaurado_msg'),
        [
          {
            text: 'OK',
            onPress: () => router.replace(AppRoutes.dashboard),
          },
        ],
      );
      await criarNotificacao({
        titulo: 'Restauracao concluida',
        mensagem: 'O backup foi restaurado com sucesso.',
        tipo: 'backup',
        prioridade: 'media',
        destino: AppRoutes.dashboard,
        canal: 'historico',
        grupoPreferencia: 'backup',
        dedupKey: `restore_concluido:${Date.now()}`,
      });
    } catch (error) {
      logger.error('[Backup] Falha ao restaurar:', error);
      hideAppLoading();
      mostrarErroBackup(
        t('configuracoes.falha_restaurar_backup'),
        t('configuracoes.falha_restaurar_backup_msg'),
      );
      await criarNotificacao({
        titulo: 'Falha na restauracao',
        mensagem: 'Nao foi possivel restaurar o backup selecionado.',
        tipo: 'backup',
        prioridade: 'alta',
        destino: AppRoutes.configuracoes,
        canal: 'historico',
        grupoPreferencia: 'backup',
        dedupKey: `restore_falhou:${new Date().toISOString().slice(0, 10)}`,
      });
    } finally {
      hideAppLoading();
      setImportandoBackup(false);
    }
  };

  const importarBackup = async () => {
    if (importandoBackup) return;

    try {
      await showAppLoadingAsync(t('configuracoes.selecionando_backup'));
      const res = await DocumentPicker.getDocumentAsync({
        type: BACKUP_PICKER_TYPES,
        copyToCacheDirectory: true,
      });
      hideAppLoading();

      if (res.canceled) return;

      if (!res.assets?.[0]?.uri) {
        mostrarErroBackup(
          t('configuracoes.backup_nao_selecionado'),
          t('configuracoes.backup_nao_selecionado_msg'),
        );
        return;
      }

      await showAppLoadingAsync(t('configuracoes.lendo_backup'));
      const content = await FileSystem.readAsStringAsync(
        res.assets[0].uri,
      );
      hideAppLoading();

      const payload = await decodeBackupContent(content);
      if (!payload) return;

      await executarRestauracao(payload);
    } catch (error) {
      hideAppLoading();
      logger.error('[Backup] Falha ao ler arquivo:', error);
      mostrarErroBackup(
        t('configuracoes.falha_ler_backup'),
        t('configuracoes.falha_ler_backup_msg'),
      );
    }
  };

  const limparTodosOsDados = () => {
    Alert.alert(
      t('configuracoes.limpar_tudo_titulo'),
      t('configuracoes.limpar_tudo_msg'),
      [
        { text: t('common.cancelar'), style: 'cancel' },
        {
          text: t('configuracoes.apagar_tudo'),
          style: 'destructive',
          onPress: async () => {
            try {
              await showAppLoadingAsync(
                t('configuracoes.limpando_dados'),
              );
              await db.execAsync('PRAGMA foreign_keys = OFF;');

              for (const tabela of [...BACKUP_TABLES].reverse()) {
                await db.execAsync(`DELETE FROM ${tabela};`);
              }

              await db.execAsync('PRAGMA foreign_keys = ON;');
              router.replace(AppRoutes.cadastro);
            } catch (error) {
              try {
                await db.execAsync('PRAGMA foreign_keys = ON;');
              } catch {}

              logger.error('[Backup] Falha ao limpar dados:', error);
              mostrarErroBackup(
                t('configuracoes.falha_limpar_dados'),
                t('configuracoes.falha_limpar_dados_msg'),
              );
            } finally {
              hideAppLoading();
            }
          },
        },
      ],
    );
  };

  return {
    importarBackup,
    importandoBackup,
    limparTodosOsDados,
    backupPasswordPrompt,
    submitBackupPassword: submitPassword,
    cancelBackupPassword: cancelPassword,
  };
}
