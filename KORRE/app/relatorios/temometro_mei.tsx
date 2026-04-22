import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Verifique se o caminho do componente está exatamente assim na sua estrutura
import { TermometroMEI } from '../../components/telas/Relatorios/temometro_mei';

export default function RelatoriosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Configura a StatusBar para combinar com o fundo cinza claro */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F4F6"
      />

      <Stack.Screen
        options={{
          title: 'Central de Relatórios',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#F3F4F6' },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>
            Olá, Kairo! 👋
          </Text>
          <Text style={styles.subTitle}>
            Gerencie seu faturamento e mantenha seu MEI
            regularizado.
          </Text>
        </View>

        {/* Seção do Termômetro */}
        <TermometroMEI />

        {/* Dica Informativa Rápida */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Dica de PO:</Text>
          <Text style={styles.infoText}>
            O limite do MEI é baseado no faturamento bruto.
            Guarde sempre 20% para manutenções imprevistas
            da Titan.
          </Text>
        </View>

        {/* Espaço para futuros módulos */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            🚀 Relatório de Lucro Líquido (Em breve)
          </Text>
        </View>

        <View
          style={[
            styles.placeholderCard,
            { marginTop: 12 },
          ]}
        >
          <Text style={styles.placeholderText}>
            📊 Comparativo de Ganhos por App (Em breve)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  headerTextContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  subTitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#DBEAFE',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  placeholderCard: {
    padding: 25,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    marginTop: 20,
  },
  placeholderText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
});
