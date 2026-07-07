import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { AppRoutes } from '../../constants/routes';
import { useTema } from '../../hooks/modo_tema';
import { styles } from '../../styles/telas/Termos/termosStyles';
import { BackButton } from '../../components/ui/BackButton';

export default function PoliticaPrivacidadeScreen() {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#AAA' : '#555';

  const sections = [
    {
      title: t('politica.secao_coleta_titulo'),
      body: t('politica.secao_coleta_texto'),
    },
    {
      title: t('politica.secao_abastecimento_titulo'),
      body: t('politica.secao_abastecimento_texto'),
    },
    {
      title: t('politica.secao_nunca_titulo'),
      body: t('politica.secao_nunca_texto'),
    },
    {
      title: t('politica.secao_desativar_titulo'),
      body: t('politica.secao_desativar_texto'),
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
          <BackButton fallback={AppRoutes.configuracoes} isDark={isDark} />
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t('politica.titulo')}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={48} color="#00C853" />
        </View>
        <Text style={[styles.mainTitle, { color: textColor }]}>{t('politica.titulo')}</Text>
        <Text style={[styles.lastUpdate, { color: textMuted }]}>{t('politica.ultima_atualizacao')}</Text>
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
