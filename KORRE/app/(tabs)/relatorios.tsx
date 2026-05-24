import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  AlertCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';

import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/relatoriosInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/(tabs)/relatoriosDynamicStyles';
// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useRelatorios } from '../../hooks/relatorios/useRelatorios';
import { styles } from '../../styles/telas/Relatorios/relatoriosStyles';
import { safeBack } from '../../utils/navigation/safeBack';

// Componentes
import { RelatorioItem } from '../../components/telas/Relatorios/RelatorioItem';

/**
 * Executa a função de relatorios screen.
 */
export default function RelatoriosScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Destruturação da lógica com os 4 Pilares
  const {
    relatoriosFinanceiros,
    relatoriosOperacionais,
    relatoriosVeiculo,
    relatoriosImpostos,
  } = useRelatorios();

  // Variáveis de Cor (Tema Dinâmico)
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  // Função centralizada de clique
  const handleAbrirRelatorio = (rota: string) => {
    if (rota) {
      const href = rota.startsWith('/') ? rota : `/${rota}`;
      router.push(href as Href);
    } else {
      showCustomAlert(
        t('relatorios.indisponivel_titulo'),
        t('relatorios.indisponivel_msg'),
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { borderBottomColor: borderColor },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.btnVoltar,
            { backgroundColor: cardColor, borderColor },
          ]}
          onPress={() => safeBack(router)}
        >
          <ArrowLeft size={20} color={textColor} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: textColor }]}
        >
          {t('relatorios.titulo')}
        </Text>
        <View style={inlineStyles.inline1} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PILAR 1: SAÚDE FINANCEIRA */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: textColor },
            ]}
          >
            {t('relatorios.saude_financeira')}
          </Text>
          <View style={styles.listContainer}>
            {relatoriosFinanceiros.map((item) => (
              <RelatorioItem
                key={item.id}
                item={item}
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                textMuted={textMuted}
                isDark={isDark}
                onPress={() =>
                  handleAbrirRelatorio(item.rota)
                }
              />
            ))}
          </View>
        </View>

        {/* PILAR 2: INTELIGÊNCIA DE PISTA */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: textColor },
            ]}
          >
            {t('relatorios.inteligencia_operacional')}
          </Text>
          <View style={styles.listContainer}>
            {relatoriosOperacionais.map((item) => (
              <RelatorioItem
                key={item.id}
                item={item}
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                textMuted={textMuted}
                isDark={isDark}
                onPress={() =>
                  handleAbrirRelatorio(item.rota)
                }
              />
            ))}
          </View>
        </View>

        {/* PILAR 3: A MÁQUINA */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: textColor },
            ]}
          >
            {t('relatorios.veiculo_manutencao')}
          </Text>
          <View style={styles.listContainer}>
            {relatoriosVeiculo.map((item) => (
              <RelatorioItem
                key={item.id}
                item={item}
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                textMuted={textMuted}
                isDark={isDark}
                onPress={() =>
                  handleAbrirRelatorio(item.rota)
                }
              />
            ))}
          </View>
        </View>

        {/* PILAR 4: FISCO E BUROCRACIA */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: textColor },
            ]}
          >
            {t('relatorios.fisco')}
          </Text>
          <View style={styles.listContainer}>
            {relatoriosImpostos.map((item) => (
              <RelatorioItem
                key={item.id}
                item={item}
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                textMuted={textMuted}
                isDark={isDark}
                onPress={() =>
                  handleAbrirRelatorio(item.rota)
                }
              />
            ))}
          </View>
        </View>

        {/* DICA PRO */}
        <View
          style={[
            styles.tipContainer,
            {
              backgroundColor: isDark
                ? 'rgba(249, 115, 22, 0.1)'
                : '#FFF3E0',
              borderColor: isDark
                ? 'rgba(249, 115, 22, 0.2)'
                : '#FFE0B2',
            },
          ]}
        >
          <AlertCircle size={24} color="#F97316" />
          <Text
            style={[
              styles.tipText,
              { color: isDark ? '#DDD' : '#555' },
            ]}
          >
            {t('relatorios.dica_1')}
            <Text
              style={dynamicInlineStyles.inline1({ isDark })}
            >
              {t('relatorios.termometro_mei')}
            </Text>{' '}
            {t('relatorios.dica_2')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
