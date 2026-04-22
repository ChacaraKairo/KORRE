import React from 'react';
import { useRouter } from 'expo-router';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

// Hooks, Estilos e Componentes Separados
import { useCarneLeao } from '../../hooks/relatorios/useCarneLeao';
import { styles } from '../../styles/telas/Relatorios/carneLeaoStyles';
import { ImpostoCard } from '../../components/telas/Relatorios/ImpostoCard';
import { LivroCaixaCard } from '../../components/telas/Relatorios/LivroCaixaCard';

export default function CarneLeaoScreen() {
  const router = useRouter();
  const {
    loading,
    mesLabel,
    mudarMes,
    pago,
    marcarComoPago,
    dadosFiscais,
  } = useCarneLeao();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A0A0A"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#666"
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Carnê-Leão
            </Text>
            <Text style={styles.headerSubtitle}>
              Segurança Fiscal
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* MONTH SELECTOR */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => mudarMes(-1)}
            style={styles.monthArrow}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color="#444"
            />
          </TouchableOpacity>

          <View style={styles.monthLabel}>
            <Ionicons
              name="calendar"
              size={18}
              color="#2196F3"
            />
            <Text style={styles.monthText}>
              {mesLabel.toUpperCase()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => mudarMes(1)}
            style={styles.monthArrow}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#444"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2196F3"
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            {/* IMPOSTO CARD */}
            <ImpostoCard
              pago={pago}
              impostoDevido={dadosFiscais.impostoDevido}
            />

            {/* LIVRO CAIXA */}
            <LivroCaixaCard dadosFiscais={dadosFiscais} />

            {/* DICA FISCAL */}
            <View style={styles.dicaBox}>
              <Ionicons
                name="information-circle"
                size={24}
                color="#2196F3"
                style={{ flexShrink: 0 }}
              />
              <Text style={styles.dicaText}>
                Dica: Guarde todos os recibos de{' '}
                <Text style={styles.dicaHighlight}>
                  combustível e mecânico
                </Text>
                . Eles foram usados para reduzir a sua base
                de cálculo em{' '}
                <Text style={styles.dicaHighlight}>
                  R${' '}
                  {dadosFiscais.despesasDedutiveis.toFixed(
                    0,
                  )}
                </Text>{' '}
                este mês.
              </Text>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    'Exportar',
                    'Gerando Relatório CSV para o Portal e-CAC...',
                  )
                }
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons
                    name="document-text"
                    size={20}
                    color="#2196F3"
                  />
                  <Text style={styles.actionBtnText}>
                    Exportar para o e-CAC
                  </Text>
                </View>
                <Ionicons
                  name="download-outline"
                  size={18}
                  color="#333"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() =>
                  Linking.openURL(
                    'https://www.gov.br/receitafederal',
                  )
                }
              >
                <View style={styles.actionBtnLeft}>
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color="#2196F3"
                  />
                  <Text style={styles.actionBtnText}>
                    Aceder Portal Gov.br
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Bottom padding to account for fixed footer */}
        <View style={{ height: pago ? 32 : 120 }} />
      </ScrollView>

      {/* FIXED FOOTER */}
      {!pago && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerBtn}
            activeOpacity={0.9}
            onPress={marcarComoPago}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={24}
              color="#fff"
            />
            <Text style={styles.footerBtnText}>
              Marcar como Pago
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
