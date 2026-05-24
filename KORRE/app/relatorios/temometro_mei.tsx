import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../../styles/generated/app/relatorios/temometro_meiStyles';
// Verifique se o caminho do componente está exatamente assim na sua estrutura
import { TermometroMEI } from '../../components/telas/Relatorios/temometro_mei';

/**
 * Executa a função de relatorios screen.
 */
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


