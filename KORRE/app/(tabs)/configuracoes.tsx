// src/app/(telas)/configuracoes.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Globe,
  Moon,
  Sun,
  HelpCircle,
  FileText,
  ShieldCheck,
  DownloadCloud,
  UploadCloud,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTema } from '../../hooks/modo_tema';
import { useExportarDados } from '../../hooks/configuracao/useExportarDados';
import { useGerenciarDados } from '../../hooks/configuracao/useGerenciarDados';
import { useNotificationPreferences } from '../../hooks/configuracao/useNotificationPreferences';
import { DataConsentService } from '../../modules/privacy/DataConsentService';
import { styles } from '../../styles/telas/Configuracoes/configuracoesStyles';
import {
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from '../../locales/i18n';

import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/configuracoesInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/(tabs)/configuracoesDynamicStyles';
import { SettingItem } from '../../components/telas/Configuracoes/SettingItem';
import { HeaderConfiguracoes } from '../../components/telas/Configuracoes/HeaderConfiguracoes';
import { ModalIdioma } from '../../components/telas/Configuracoes/ModalIdioma';
import { BackupPasswordModal } from '../../components/telas/Configuracoes/BackupPasswordModal';

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const { tema, setTema } = useTema();
  const isDark = tema === 'escuro';

  const {
    exportarDados,
    isExportando,
  } = useExportarDados();
  const {
    importarBackup,
    importandoBackup,
    limparTodosOsDados,
    backupPasswordPrompt: restorePasswordPrompt,
    submitBackupPassword: submitRestorePassword,
    cancelBackupPassword: cancelRestorePassword,
  } = useGerenciarDados();

  const [modalIdiomaVisible, setModalIdiomaVisible] =
    useState(false);
  const { prefs, setPref } = useNotificationPreferences();
  const [consentAnonData, setConsentAnonData] = useState(false);

  React.useEffect(() => {
    DataConsentService.getConsent().then(setConsentAnonData);
  }, []);

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#666' : '#888';
  const idiomaAtual =
    SUPPORTED_LANGUAGES.find(
      (language) =>
        language.code === normalizeLanguage(i18n.language),
    ) ?? SUPPORTED_LANGUAGES[0];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      <HeaderConfiguracoes
        isDark={isDark}
        cardColor={cardColor}
        borderColor={borderColor}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { gap: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            {t('configuracoes.aparencia')}
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              icon={isDark ? Moon : Sun}
              title={t('configuracoes.tema_escuro')}
              action="toggle"
              value={{
                current: isDark,
                setter: () =>
                  setTema!(isDark ? 'claro' : 'escuro'),
              }}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={Bell}
              title={t('configuracoes.notificacoes')}
              action="toggle"
              value={{
                current: true,
                setter: () => undefined,
              }}
            />
          </View>
        </View>

        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            {t('configuracoes.notificacoes')}
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.manutencao')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_manutencao_ativas),
                setter: (v) =>
                  void setPref('notificacoes_manutencao_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.financeiro')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_financeiro_ativas),
                setter: (v) =>
                  void setPref('notificacoes_financeiro_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.backup')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_backup_ativas),
                setter: (v) =>
                  void setPref('notificacoes_backup_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.indices')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_indices_ativas),
                setter: (v) =>
                  void setPref('notificacoes_indices_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.corrida')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_corrida_ativas),
                setter: (v) =>
                  void setPref('notificacoes_corrida_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={ShieldCheck}
              title={t('notificacoes.pref.seguranca')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_seguranca_ativas),
                setter: (v) =>
                  void setPref('notificacoes_seguranca_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.mei')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_mei_ativas),
                setter: (v) =>
                  void setPref('notificacoes_mei_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={Bell}
              title={t('notificacoes.pref.uso_app')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_uso_app_ativas),
                setter: (v) =>
                  void setPref('notificacoes_uso_app_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              icon={ShieldCheck}
              title={t('notificacoes.pref.privacidade')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_privacidade_ativas),
                setter: (v) =>
                  void setPref('notificacoes_privacidade_ativas', v),
              }}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={Bell}
              title={t('notificacoes.pref.sistema')}
              action="toggle"
              value={{
                current: Boolean(prefs?.notificacoes_sistema_ativas),
                setter: (v) =>
                  void setPref('notificacoes_sistema_ativas', v),
              }}
            />
          </View>
        </View>

        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            {t('configuracoes.preferencias')}
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={Globe}
              title={t('configuracoes.idioma')}
              value={{ label: idiomaAtual.label }}
              onClick={() => setModalIdiomaVisible(true)}
            />
          </View>
        </View>

        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            {t('configuracoes.seguranca_dados')}
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              icon={UploadCloud}
              title={
                isExportando
                  ? t('configuracoes.exportando_backup')
                  : t('configuracoes.exportar_backup')
              }
              onClick={exportarDados}
            />
            <SettingItem
              isDark={isDark}
              icon={DownloadCloud}
              title={
                importandoBackup
                  ? t('configuracoes.restaurando_dados')
                  : t('configuracoes.restaurar_dados')
              }
              onClick={importarBackup}
            />
            <SettingItem
              isDark={isDark}
              isLast={false}
              icon={Trash2}
              title={t('configuracoes.zerar_app')}
              onClick={limparTodosOsDados}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={ShieldCheck}
              title={t('privacidade.allow_anonymous_data')}
              subtitle={t('privacidade.allow_anonymous_data_sub')}
              action="toggle"
              value={{
                current: consentAnonData,
                setter: (v) => {
                  setConsentAnonData(v);
                  void DataConsentService.setConsent(v);
                },
              }}
            />
          </View>
        </View>

        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            {t('configuracoes.suporte')}
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              icon={HelpCircle}
              title={t('configuracoes.central_ajuda')}
              onClick={() => router.push('/(tabs)/suporte')}
            />
            <SettingItem
              isDark={isDark}
              icon={FileText}
              title={t('configuracoes.termos')}
              onClick={() => router.push('/(auth)/termos')}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={ShieldCheck}
              title={t('configuracoes.politica_privacidade')}
              onClick={() =>
                router.push('/(auth)/politica-privacidade' as never)
              }
            />
          </View>
        </View>

        <View style={inlineStyles.inline1}>
          <Text
            style={dynamicInlineStyles.inline1({ textMuted })}
          >
            KORRE v1.3.2
          </Text>
        </View>
      </ScrollView>

      <ModalIdioma
        visible={modalIdiomaVisible}
        onClose={() => setModalIdiomaVisible(false)}
        idiomas={SUPPORTED_LANGUAGES}
        isDark={isDark}
        cardColor={cardColor}
        borderColor={borderColor}
      />
      <BackupPasswordModal
        visible={restorePasswordPrompt.visible}
        title={restorePasswordPrompt.title}
        message={restorePasswordPrompt.message}
        isDark={isDark}
        cardColor={cardColor}
        borderColor={borderColor}
        onCancel={cancelRestorePassword}
        onSubmit={submitRestorePassword}
      />
    </SafeAreaView>
  );
}
