import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ModalAjuda({
  modalAjuda,
  setModalAjuda,
}: {
  modalAjuda: boolean;
  setModalAjuda: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal
      visible={modalAjuda}
      animationType="fade"
      transparent
      onRequestClose={() => setModalAjuda(false)}
    >
      <View style={styles.modalOverlay}>
        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setModalAjuda(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="calculator" size={40} color="#00C853" />
            </View>
            <Text style={styles.modalTitle}>Entenda a Matemática</Text>
            <Text style={styles.modalSubtitle}>
              Por que os 70% ficaram para trás?
            </Text>
          </View>

          {/* Tópico 1 */}
          <View style={styles.modalCard}>
            <View style={styles.modalCardHeader}>
              <MaterialCommunityIcons name="flask" size={20} color="#EAB308" />
              <Text style={[styles.modalCardTitle, { color: "#EAB308" }]}>
                A Nova Gasolina (E30)
              </Text>
            </View>
            <Text style={styles.modalCardText}>
              Desde agosto de 2025, a gasolina comum no Brasil passou a ter{" "}
              <Text style={styles.highlight}>30% de etanol anidro</Text> (antes
              era 27%). Isso significa que a gasolina ficou "menos pura" e rende
              menos quilómetros por litro, o que aproxima o custo-benefício dos
              dois combustíveis.
            </Text>
          </View>

          {/* Tópico 2 */}
          <View style={styles.modalCard}>
            <View style={styles.modalCardHeader}>
              <Ionicons name="flash" size={20} color="#00C853" />
              <Text style={[styles.modalCardTitle, { color: "#00C853" }]}>
                Motores Inteligentes
              </Text>
            </View>
            <Text style={styles.modalCardText}>
              Os carros flex fabricados nos últimos anos possuem sistemas de
              injeção e taxas de compressão muito mais eficientes com o
              combustível vegetal. O etanol agora rende mais do que rendia
              antigamente em relação à gasolina.
            </Text>
          </View>

          {/* Tópico 3 */}
          <View style={styles.modalCard}>
            <View style={styles.modalCardHeader}>
              <Ionicons name="speedometer" size={20} color="#3B82F6" />
              <Text style={[styles.modalCardTitle, { color: "#3B82F6" }]}>
                Seja Preciso
              </Text>
            </View>
            <Text style={[styles.modalCardText, { marginBottom: 12 }]}>
              A regra dos 75% é uma média nacional segura. Mas queres ser exato?
              Faz o seguinte:
            </Text>
            <View style={styles.stepsBox}>
              <Text style={styles.stepText}>
                1. Vê quanto o teu veículo faz por litro no Etanol (ex: 9km/l)
              </Text>
              <Text style={styles.stepText}>
                2. Vê quanto faz na Gasolina (ex: 12km/l)
              </Text>
              <Text style={styles.stepText}>
                3. Divide um pelo outro:{" "}
                <Text style={{ color: "#00C853" }}>9 ÷ 12 = 0,75</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.modalCta}
            onPress={() => setModalAjuda(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.modalCtaText}>Tudo certo, vamos rodar!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.97)",
  },
  modalContent: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 48,
    gap: 16,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 48,
    right: 24,
    padding: 12,
    backgroundColor: "#161616",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  modalIconWrap: {
    padding: 16,
    backgroundColor: "rgba(0,200,83,0.1)",
    borderRadius: 999,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#00C853",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 8,
    fontStyle: "italic",
  },
  modalCard: {
    backgroundColor: "#161616",
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#222",
    gap: 8,
  },
  modalCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalCardTitle: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalCardText: {
    color: "#888",
    fontSize: 12,
    lineHeight: 20,
  },
  highlight: {
    color: "#fff",
    fontWeight: "700",
  },
  stepsBox: {
    backgroundColor: "#0A0A0A",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    gap: 8,
  },
  stepText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
    fontStyle: "italic",
  },
  modalCta: {
    paddingVertical: 20,
    backgroundColor: "#00C853",
    borderRadius: 24,
    alignItems: "center",
    marginTop: 8,
  },
  modalCtaText: {
    color: "#0A0A0A",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
