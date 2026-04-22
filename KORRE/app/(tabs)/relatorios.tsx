import React from 'react';
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
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';

// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useRelatorios } from '../../hooks/relatorios/useRelatorios';
import { styles } from '../../styles/telas/Relatorios/relatoriosStyles';

// Componentes
import { RelatorioItem } from '../../components/telas/Relatorios/RelatorioItem';

export default function RelatoriosScreen() {
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
      router.push(
        rota.startsWith('/')
          ? (rota as any)
          : (`/${rota}` as any),
      );
    } else {
      showCustomAlert(
        'Em Breve',
        'Este relatório estará disponível numa próxima atualização!',
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
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={textColor} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: textColor }]}
        >
          Meus Relatórios
        </Text>
        <View style={{ width: 36 }} />
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
            Saúde Financeira
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
            Inteligência Operacional
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
            Veículo & Manutenção
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
            Fisco & Burocracia
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
            Dica: Aceda ao relatório{' '}
            <Text
              style={{
                fontWeight: 'bold',
                color: isDark ? '#FFF' : '#000',
              }}
            >
              Termômetro MEI
            </Text>{' '}
            periodicamente para garantir que não ultrapassa
            o seu limite de faturação anual.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
