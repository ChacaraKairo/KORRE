import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Activity,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useBalancoDre } from '../../hooks/relatorios/useBalancoDre';
import { styles } from '../../styles/telas/Relatorios/balancoDreStyles';

export default function BalancoDreScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const { loading, periodo, dadosDre, alterarPeriodo } =
    useBalancoDre();

  // Cores Temáticas
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  // Formatação de Moeda
  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
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
          Balanço Geral (DRE)
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* NAVEGAÇÃO DE PERÍODO */}
        <View style={styles.periodoContainer}>
          <TouchableOpacity
            onPress={() => alterarPeriodo('anterior')}
            style={styles.periodoBtn}
          >
            <ChevronLeft size={24} color={textColor} />
          </TouchableOpacity>
          <Text
            style={[
              styles.periodoTexto,
              { color: textColor },
            ]}
          >
            {periodo}
          </Text>
          <TouchableOpacity
            onPress={() => alterarPeriodo('proximo')}
            style={styles.periodoBtn}
          >
            <ChevronRight size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00C853"
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            {/* CARTÃO PRINCIPAL: LUCRO LÍQUIDO */}
            <View
              style={[
                styles.cardPrincipal,
                {
                  backgroundColor:
                    dadosDre.lucroLiquido >= 0
                      ? '#00C853'
                      : '#EF4444',
                  shadowColor:
                    dadosDre.lucroLiquido >= 0
                      ? '#00C853'
                      : '#EF4444',
                },
              ]}
            >
              <Text
                style={[
                  styles.labelPrincipal,
                  { color: '#FFFFFF' },
                ]}
              >
                Lucro Líquido
              </Text>
              <Text
                style={[
                  styles.valorPrincipal,
                  { color: '#FFFFFF' },
                ]}
              >
                {formatarMoeda(dadosDre.lucroLiquido)}
              </Text>

              <View style={styles.margemContainer}>
                <Activity size={14} color="#FFF" />
                <Text style={styles.margemTexto}>
                  Margem Real:{' '}
                  {dadosDre.margemLucro.toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* CARDS SECUNDÁRIOS: RECEITAS VS DESPESAS */}
            <View style={styles.linhaCards}>
              {/* Receitas */}
              <View
                style={[
                  styles.cardDetalhe,
                  {
                    backgroundColor: cardColor,
                    borderColor,
                  },
                ]}
              >
                <View style={styles.cardDetalheHeader}>
                  <TrendingUp size={16} color="#00C853" />
                  <Text
                    style={[
                      styles.cardDetalheLabel,
                      { color: textMuted },
                    ]}
                  >
                    Receita Bruta
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardDetalheValor,
                    { color: textColor },
                  ]}
                >
                  {formatarMoeda(dadosDre.receitaBruta)}
                </Text>
              </View>

              {/* Despesas Totais */}
              <View
                style={[
                  styles.cardDetalhe,
                  {
                    backgroundColor: cardColor,
                    borderColor,
                  },
                ]}
              >
                <View style={styles.cardDetalheHeader}>
                  <TrendingDown size={16} color="#EF4444" />
                  <Text
                    style={[
                      styles.cardDetalheLabel,
                      { color: textMuted },
                    ]}
                  >
                    Custo Total
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardDetalheValor,
                    { color: textColor },
                  ]}
                >
                  {formatarMoeda(
                    dadosDre.custosVariaveis +
                      dadosDre.custosFixos,
                  )}
                </Text>
              </View>
            </View>

            {/* DETALHAMENTO DOS CUSTOS (Breakdown) */}
            <View style={{ marginTop: 8 }}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: textColor },
                ]}
              >
                Detalhamento
              </Text>

              <View
                style={[
                  styles.linhaBreakdown,
                  { borderBottomColor: borderColor },
                ]}
              >
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: textMuted },
                  ]}
                >
                  Ganhos Totais (Faturamento)
                </Text>
                <Text
                  style={[
                    styles.breakdownValor,
                    { color: '#00C853' },
                  ]}
                >
                  {formatarMoeda(dadosDre.receitaBruta)}
                </Text>
              </View>

              <View
                style={[
                  styles.linhaBreakdown,
                  { borderBottomColor: borderColor },
                ]}
              >
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: textMuted },
                  ]}
                >
                  (-) Custos Variáveis (Combustível,
                  Oficina)
                </Text>
                <Text
                  style={[
                    styles.breakdownValor,
                    { color: '#EF4444' },
                  ]}
                >
                  -{' '}
                  {formatarMoeda(dadosDre.custosVariaveis)}
                </Text>
              </View>

              <View
                style={[
                  styles.linhaBreakdown,
                  { borderBottomColor: borderColor },
                ]}
              >
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: textMuted },
                  ]}
                >
                  (-) Custos Fixos (Seguro, Net, MEI)
                </Text>
                <Text
                  style={[
                    styles.breakdownValor,
                    { color: '#EF4444' },
                  ]}
                >
                  - {formatarMoeda(dadosDre.custosFixos)}
                </Text>
              </View>

              <View
                style={[
                  styles.linhaBreakdown,
                  {
                    borderBottomColor: 'transparent',
                    marginTop: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.breakdownLabel,
                    {
                      color: textColor,
                      fontWeight: 'bold',
                      fontSize: 16,
                    },
                  ]}
                >
                  (=) Resultado Final
                </Text>
                <Text
                  style={[
                    styles.breakdownValor,
                    { color: textColor, fontSize: 18 },
                  ]}
                >
                  {formatarMoeda(dadosDre.lucroLiquido)}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
