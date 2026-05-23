import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { X, Edit3, Trash2 } from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Historico/historicoStyles';
import { translateCategoryName } from '../../../utils/i18n/translateDomainValue';

import { inlineStyles } from '../../../styles/generated-inline/components/telas/historico/ModalOpcoesRegistroInlineStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/historico/ModalOpcoesRegistroDynamicStyles';
export function ModalOpcoesRegistro({
  visible,
  item,
  onClose,
  onEdit,
  onDelete,
}: any) {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  if (!item) return null;

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
              {t('historico.gerenciar_registro')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.btnModalClose,
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

          <View
            style={inlineStyles.inline1}
          >
            <Text
              style={dynamicInlineStyles.inline1({ textMuted })}
            >
              {translateCategoryName(t, item.categoria)}
            </Text>
            <Text
              style={dynamicInlineStyles.inline2({ item })}
            >
              R$ {item.valor.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.btnAcaoModal,
              {
                backgroundColor: isDark
                  ? '#222'
                  : '#F5F5F5',
                borderColor,
              },
            ]}
            onPress={onEdit}
          >
            <Edit3 size={22} color={textColor} />
            <Text
              style={[
                styles.btnAcaoTexto,
                { color: textColor },
              ]}
            >
              {t('historico.editar_valor')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnAcaoModal,
              {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              },
            ]}
            onPress={onDelete}
          >
            <Trash2 size={22} color="#EF4444" />
            <Text
              style={[
                styles.btnAcaoTexto,
                { color: '#EF4444' },
              ]}
            >
              {t('historico.apagar_definitivamente')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
