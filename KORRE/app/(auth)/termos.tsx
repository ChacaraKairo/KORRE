import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppRoutes } from '../../constants/routes';
import { useTema } from '../../hooks/modo_tema';
import { styles } from '../../styles/telas/Termos/termosStyles';
import { safeBack } from '../../utils/navigation/safeBack';

/**
 * Executa a função de termos screen.
 */
export default function TermosScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#AAA' : '#555';

  const sections = [
    {
      title: t('termos.secao_servico_titulo'),
      body: t('termos.secao_servico_texto'),
    },
    {
      title: t('termos.secao_dados_titulo'),
      body: t('termos.secao_dados_texto'),
    },
    {
      title: t('termos.uso_dados_anonimos_titulo'),
      body: t('termos.uso_dados_anonimos_texto'),
    },
    {
      title: t('termos.secao_desativar_titulo'),
      body: t('termos.secao_desativar_texto'),
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => safeBack(router, AppRoutes.cadastro)}
            style={[styles.btnVoltar, { backgroundColor: cardColor }]}
          >
            <ArrowLeft size={20} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t('termos.titulo')}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={48} color="#00C853" />
        </View>
        <Text style={[styles.mainTitle, { color: textColor }]}>{t('termos.titulo')}</Text>
        <Text style={[styles.lastUpdate, { color: textMuted }]}>{t('termos.ultima_atualizacao')}</Text>
        {sections.map((section) => (
          <View key={section.title}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>{section.title}</Text>
            <Text style={[styles.paragraph, { color: textMuted }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
