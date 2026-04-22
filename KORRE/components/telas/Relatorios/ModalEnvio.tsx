import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  X,
  MessageCircle,
  Mail,
  Download,
} from 'lucide-react-native';
import { styles } from '../../../styles/telas/Relatorios/relatoriosStyles';

interface ModalEnvioProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
  cardColor: string;
  borderColor: string;
  textColor: string;
  textMuted: string;
}

export function ModalEnvio({
  visible,
  onClose,
  isDark,
  cardColor,
  borderColor,
  textColor,
  textMuted,
}: ModalEnvioProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: cardColor, borderColor },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: textColor },
              ]}
            >
              Exportar Relatórios
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.btnFecharModal,
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

          <Text
            style={[
              styles.modalSubtitle,
              { color: textMuted },
            ]}
          >
            Como deseja partilhar os dados da sua operação
            com o contador?
          </Text>

          <TouchableOpacity
            style={[
              styles.modalOption,
              {
                backgroundColor: isDark
                  ? '#222'
                  : '#F5F5F5',
                borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    'rgba(37, 211, 102, 0.1)',
                },
              ]}
            >
              <MessageCircle size={22} color="#25D366" />
            </View>
            <Text
              style={[
                styles.modalOptionText,
                { color: textColor },
              ]}
            >
              Enviar por WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalOption,
              {
                backgroundColor: isDark
                  ? '#222'
                  : '#F5F5F5',
                borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    'rgba(59, 130, 246, 0.1)',
                },
              ]}
            >
              <Mail size={22} color="#3B82F6" />
            </View>
            <Text
              style={[
                styles.modalOptionText,
                { color: textColor },
              ]}
            >
              Enviar por E-mail
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalOption,
              {
                backgroundColor: isDark
                  ? '#222'
                  : '#F5F5F5',
                borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    'rgba(168, 85, 247, 0.1)',
                },
              ]}
            >
              <Download size={22} color="#A855F7" />
            </View>
            <Text
              style={[
                styles.modalOptionText,
                { color: textColor },
              ]}
            >
              Guardar em PDF (Download)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
