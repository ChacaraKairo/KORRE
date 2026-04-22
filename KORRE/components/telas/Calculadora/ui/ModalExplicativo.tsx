import { Info, X } from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTema } from '../../../../hooks/modo_tema';

interface ModalExplicativoProps {
  visible: boolean;
  onClose: () => void;
  titulo: string;
  textoExplicativo: string;
}

export const ModalExplicativo: React.FC<
  ModalExplicativoProps
> = ({ visible, onClose, titulo, textoExplicativo }) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#333' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#AAA' : '#555';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            { backgroundColor: cardColor, borderColor },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Info size={20} color="#00C853" />
              <Text
                style={[styles.title, { color: textColor }]}
              >
                {titulo}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: isDark
                    ? '#222'
                    : '#F5F5F5',
                },
              ]}
            >
              <X size={20} color={textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[styles.text, { color: textMuted }]}
            >
              {textoExplicativo}
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.btnOk}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOkText}>ENTENDI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: '900', flexShrink: 1 },
  closeButton: { padding: 8, borderRadius: 12 },
  body: { marginBottom: 20 },
  text: { fontSize: 14, lineHeight: 22 },
  btnOk: {
    backgroundColor: '#00C853',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnOkText: {
    color: '#0A0A0A',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
