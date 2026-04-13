// src/app/(telas)/configuracoes.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Globe,
  ArrowLeft,
  Moon,
  Sun,
  HelpCircle,
  FileText,
  DownloadCloud,
  UploadCloud,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTema } from '../../hooks/modo_tema';
import { useExportarDados } from '../../hooks/configuracao/useExportarDados';
import { useGerenciarDados } from '../../hooks/configuracao/useGerenciarDados';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';
import { styles } from '../../styles/telas/Configuracoes/configuracoesStyles';

// Importando os componentes
import { SettingItem } from '../../components/telas/Configuracoes/SettingItem';
import { HeaderConfiguracoes } from '../../components/telas/Configuracoes/HeaderConfiguracoes';

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tema, setTema } = useTema();
  const isDark = tema === 'escuro';

  const { exportarDados } = useExportarDados();
  const { importarBackup, limparTodosOsDados } =
    useGerenciarDados();

  const [notificacoes, setNotificacoes] = useState(true);

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#666' : '#888';

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
        {/* SEÇÃO: APARÊNCIA */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            APARÊNCIA
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
              title="Tema Escuro"
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
              title="Notificações"
              action="toggle"
              value={{
                current: notificacoes,
                setter: setNotificacoes,
              }}
            />
          </View>
        </View>

        {/* SEÇÃO: PREFERÊNCIAS */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            PREFERÊNCIAS
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
              title="Idioma do aplicativo"
              value={{ label: 'Português (PT)' }}
              onClick={() =>
                showCustomAlert(
                  'Em breve',
                  'A seleção de novos idiomas será implementada em atualizações futuras.',
                )
              }
            />
          </View>
        </View>

        {/* SEÇÃO: DADOS */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            SEGURANÇA E DADOS
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
              title="Exportar Backup"
              onClick={exportarDados}
            />
            <SettingItem
              isDark={isDark}
              icon={DownloadCloud}
              title="Restaurar Dados"
              onClick={importarBackup}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={Trash2}
              title="Zerar Aplicativo"
              onClick={limparTodosOsDados}
            />
          </View>
        </View>

        {/* SEÇÃO: SUPORTE */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            SUPORTE
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
              title="Central de Ajuda"
              onClick={() => router.push('/suporte')}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={FileText}
              title="Termos de Uso"
              onClick={() => router.push('/termos')}
            />
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: textMuted,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            MEUCORRE v1.0.4
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
