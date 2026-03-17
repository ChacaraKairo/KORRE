import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CarneLeaoScreen() {
  const router = useRouter();
  const [mesRef, setMesRef] = useState(new Date());
  const [pago, setPago] = useState(false);

  const dadosFiscais = {
    faturamentoBruto: 5200.0,
    despesasDedutiveis: 1850.4,
    baseCalculo: 3349.6,
    aliquota: 15,
    impostoDevido: 187.44,
  };

  const mudarMes = (direcao: number) => {
    const novoMes = new Date(mesRef);
    novoMes.setMonth(mesRef.getMonth() + direcao);
    setMesRef(novoMes);
    setPago(false);
  };

  const mesLabel = mesRef.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Carnê-Leão</Text>
            <Text style={styles.headerSubtitle}>Segurança Fiscal</Text>
          </View>

          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8}>
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
            <Ionicons name="chevron-back" size={20} color="#444" />
          </TouchableOpacity>

          <View style={styles.monthLabel}>
            <Ionicons name="calendar" size={18} color="#2196F3" />
            <Text style={styles.monthText}>{mesLabel.toUpperCase()}</Text>
          </View>

          <TouchableOpacity
            onPress={() => mudarMes(1)}
            style={styles.monthArrow}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={20} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        {/* IMPOSTO CARD */}
        <View
          style={[
            styles.impostoCard,
            pago ? styles.impostoCardPago : styles.impostoCardPendente,
          ]}
        >
          {/* Background icon */}
          <View style={styles.impostoCardBgIcon}>
            <MaterialCommunityIcons
              name="shield-check"
              size={120}
              color={pago ? "#00C853" : "#2196F3"}
            />
          </View>

          <View style={styles.impostoCardContent}>
            <View style={styles.impostoLabelRow}>
              <FontAwesome5
                name="receipt"
                size={12}
                color={pago ? "#00C853" : "#2196F3"}
              />
              <Text style={styles.impostoLabel}>Imposto a Pagar (DARF)</Text>
            </View>

            <Text style={styles.impostoValue}>
              R${" "}
              {dadosFiscais.impostoDevido.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </Text>

            <View style={styles.impostoStatusRow}>
              {pago ? (
                <View style={styles.badgePago}>
                  <Ionicons name="checkmark-circle" size={14} color="#0A0A0A" />
                  <Text style={styles.badgePagoText}>Quitado</Text>
                </View>
              ) : (
                <View style={styles.badgePendente}>
                  <Ionicons name="alert-circle" size={14} color="#F59E0B" />
                  <Text style={styles.badgePendenteText}>
                    Aguardando Pagamento
                  </Text>
                </View>
              )}
              <Text style={styles.vencimento}>Vencimento: 10/03/2026</Text>
            </View>
          </View>
        </View>

        {/* LIVRO CAIXA */}
        <View style={styles.livroCaixaCard}>
          <View style={styles.livroCaixaHeader}>
            <Text style={styles.livroCaixaTitle}>Cálculo Livro Caixa</Text>
            <Ionicons name="calculator" size={18} color="#444" />
          </View>

          {/* Rendimentos Brutos */}
          <View style={styles.livroCaixaRow}>
            <View>
              <Text style={styles.livroCaixaRowLabel}>Rendimentos Brutos</Text>
              <Text style={styles.livroCaixaRowValue}>
                R$ {dadosFiscais.faturamentoBruto.toFixed(2)}
              </Text>
            </View>
            <Ionicons name="trending-up" size={24} color="rgba(0,200,83,0.2)" />
          </View>

          {/* Despesas */}
          <View style={styles.livroCaixaRow}>
            <View>
              <Text style={styles.livroCaixaRowLabel}>
                Despesas Abatidas (-)
              </Text>
              <Text style={[styles.livroCaixaRowValue, { color: "#EF4444" }]}>
                R$ {dadosFiscais.despesasDedutiveis.toFixed(2)}
              </Text>
            </View>
            <Ionicons
              name="trending-down"
              size={24}
              color="rgba(239,68,68,0.2)"
            />
          </View>

          <View style={styles.divider} />

          {/* Base de Cálculo */}
          <View style={styles.livroCaixaRow}>
            <View>
              <Text style={[styles.livroCaixaRowLabel, { color: "#2196F3" }]}>
                Base de Cálculo Final
              </Text>
              <Text style={[styles.livroCaixaRowValue, { fontSize: 20 }]}>
                R$ {dadosFiscais.baseCalculo.toFixed(2)}
              </Text>
            </View>
            <View style={styles.aliquotaBadge}>
              <Text style={styles.aliquotaText}>
                {dadosFiscais.aliquota}% IRPF
              </Text>
            </View>
          </View>
        </View>

        {/* DICA FISCAL */}
        <View style={styles.dicaBox}>
          <Ionicons
            name="information-circle"
            size={24}
            color="#2196F3"
            style={{ flexShrink: 0 }}
          />
          <Text style={styles.dicaText}>
            Dica: Guarde todos os recibos de{" "}
            <Text style={styles.dicaHighlight}>combustível e mecânico</Text>.
            Eles foram usados para reduzir a sua base de cálculo em{" "}
            <Text style={styles.dicaHighlight}>
              R$ {dadosFiscais.despesasDedutiveis.toFixed(0)}
            </Text>{" "}
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
                "Exportar",
                "Gerando Relatório CSV para o Portal e-CAC...",
              )
            }
          >
            <View style={styles.actionBtnLeft}>
              <Ionicons name="document-text" size={20} color="#2196F3" />
              <Text style={styles.actionBtnText}>Exportar para o e-CAC</Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => Linking.openURL("https://www.gov.br/receitafederal")}
          >
            <View style={styles.actionBtnLeft}>
              <Ionicons name="open-outline" size={20} color="#2196F3" />
              <Text style={styles.actionBtnText}>Aceder Portal Gov.br</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Bottom padding to account for fixed footer */}
        <View style={{ height: pago ? 32 : 120 }} />
      </ScrollView>

      {/* FIXED FOOTER */}
      {!pago && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerBtn}
            activeOpacity={0.9}
            onPress={() => {
              setPago(true);
              Alert.alert("Sucesso", "Pagamento registado no MeuCorre!");
            }}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={24}
              color="#fff"
            />
            <Text style={styles.footerBtnText}>Marcar como Pago</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },

  // HEADER
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#161616",
    backgroundColor: "#0A0A0A",
    zIndex: 20,
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: {
    padding: 8,
    backgroundColor: "#161616",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#2196F3",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 8,
    fontWeight: "900",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 2,
  },

  // MONTH SELECTOR
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  monthArrow: {
    padding: 8,
  },
  monthLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  monthText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  // MAIN SCROLL
  main: {
    padding: 24,
    gap: 20,
  },

  // IMPOSTO CARD
  impostoCard: {
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  impostoCardPendente: {
    backgroundColor: "rgba(33,150,243,0.05)",
    borderColor: "rgba(33,150,243,0.2)",
  },
  impostoCardPago: {
    backgroundColor: "rgba(0,200,83,0.05)",
    borderColor: "rgba(0,200,83,0.2)",
  },
  impostoCardBgIcon: {
    position: "absolute",
    top: -24,
    right: -24,
    opacity: 0.03,
    transform: [{ rotate: "-12deg" }],
  },
  impostoCardContent: {
    gap: 8,
  },
  impostoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  impostoLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  impostoValue: {
    fontSize: 44,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 8,
  },
  impostoStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  badgePago: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#00C853",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgePagoText: {
    color: "#0A0A0A",
    fontWeight: "900",
    fontSize: 10,
    textTransform: "uppercase",
  },
  badgePendente: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.2)",
  },
  badgePendenteText: {
    color: "#F59E0B",
    fontWeight: "900",
    fontSize: 10,
    textTransform: "uppercase",
  },
  vencimento: {
    fontSize: 10,
    fontWeight: "700",
    color: "#444",
    textTransform: "uppercase",
  },

  // LIVRO CAIXA
  livroCaixaCard: {
    backgroundColor: "#161616",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "#222",
    gap: 20,
  },
  livroCaixaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  livroCaixaTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  livroCaixaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  livroCaixaRowLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  livroCaixaRowValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
  },
  aliquotaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(33,150,243,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
  },
  aliquotaText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#2196F3",
  },

  // DICA
  dicaBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 20,
    backgroundColor: "rgba(33,150,243,0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.1)",
  },
  dicaText: {
    flex: 1,
    fontSize: 11,
    color: "#555",
    lineHeight: 18,
  },
  dicaHighlight: {
    color: "#fff",
    fontWeight: "700",
  },

  // ACTIONS
  actionsSection: {
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 16,
  },
  actionBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
    backgroundColor: "rgba(10,10,10,0.97)",
    borderTopWidth: 1,
    borderTopColor: "#161616",
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 65,
    backgroundColor: "#2196F3",
    borderRadius: 18,
    gap: 12,
  },
  footerBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
