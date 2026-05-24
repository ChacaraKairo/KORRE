import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../../constants/routes';
import db from '../../database/DatabaseInit';
import { BackupRestoreService } from '../../services/BackupRestoreService';
import { logger } from '../../utils/logger';
import {
  decryptJson,
  isEncryptedPayload,
} from '../../utils/security/encryption';
import { setAuthSession } from '../../utils/auth/authSession';
import { showCustomAlert } from '../alert/useCustomAlert';

const mostrarAviso = (titulo: string, mensagem: string) => {
  Alert.alert(titulo, mensagem);
  showCustomAlert(titulo, mensagem);
};

export function useRestaurarBackup() {
  const router = useRouter();
  const { t } = useTranslation();
  const [carregando, setCarregando] = useState(false);

  const solicitarSenhaBackup = () =>
    new Promise<string | null>((resolve) => {
      Alert.prompt(
        t('configuracoes.senha_backup_label'),
        t('configuracoes.senha_backup_restaurar_msg'),
        [
          {
            text: t('common.cancelar'),
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: t('common.salvar'),
            onPress: (passphrase?: string) =>
              resolve(passphrase ?? ''),
          },
        ],
        'secure-text',
      );
    });

  const executarRestauracao = async (data: unknown) => {
    setCarregando(true);

    try {
      await BackupRestoreService.restaurarBackup(data);
      const restoredUser = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );
      if (restoredUser?.id) {
        setAuthSession(restoredUser.id);
      }

      Alert.alert(
        t('configuracoes.backup_restaurado'),
        t('cadastro.backup_restaurado_boas_vindas'),
        [
          {
            text: t('cadastro.ir_dashboard'),
            onPress: () => router.replace(AppRoutes.dashboard),
          },
        ],
      );
    } catch (error) {
      logger.error('[RESTORE][FATAL]', error);
      mostrarAviso(
        t('configuracoes.falha_restaurar_backup'),
        t('configuracoes.falha_restaurar_backup_msg'),
      );
    } finally {
      setCarregando(false);
    }
  };

  const selecionarArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'application/octet-stream', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (!result.assets?.[0]?.uri) {
        mostrarAviso(
          t('configuracoes.backup_nao_selecionado'),
          t('configuracoes.backup_nao_selecionado_msg'),
        );
        return;
      }

      const asset = result.assets[0];
      const conteudo = await FileSystem.readAsStringAsync(
        asset.uri,
      );

      if (!conteudo) {
        mostrarAviso(
          t('cadastro.arquivo_vazio'),
          t('cadastro.arquivo_vazio_msg'),
        );
        return;
      }

      const pareceCriptografado = isEncryptedPayload(conteudo);
      let dados: unknown;

      try {
        dados = JSON.parse(conteudo);
      } catch (error) {
        logger.error('[PICKER] JSON invalido:', error);

        if (pareceCriptografado) {
          const passphrase = await solicitarSenhaBackup();

          if (passphrase === null) return;

          try {
            dados = decryptJson(conteudo, passphrase);
          } catch (decryptError) {
            logger.error(
              '[PICKER] Falha ao descriptografar backup:',
              decryptError,
            );
            mostrarAviso(
              t('common.erro'),
              t('configuracoes.senha_backup_incorreta'),
            );
            return;
          }
        } else {
          mostrarAviso(
            t('cadastro.arquivo_invalido'),
            t('cadastro.arquivo_invalido_msg'),
          );
          return;
        }
      }

      Alert.alert(
        t('configuracoes.restaurar_dados'),
        t('cadastro.confirmar_importacao_backup', {
          nome: asset.name,
        }),
        [
          { text: t('common.cancelar'), style: 'cancel' },
          {
            text: t('cadastro.sim_restaurar'),
            onPress: () => {
              void executarRestauracao(dados);
            },
          },
        ],
      );
    } catch (error) {
      logger.error('[PICKER][ERRO CRITICO]', error);
      mostrarAviso(
        t('configuracoes.falha_ler_backup'),
        t('configuracoes.falha_ler_backup_msg'),
      );
    }
  };

  return { selecionarArquivo, carregando };
}
