import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useCustomAlert } from '../../hooks/alert/useCustomAlert';
import { useTema } from '../../hooks/modo_tema';

import { styles } from '../../styles/generated/components/ui/CustomAlertStyles';
/**
 * Executa a função de custom alert.
 */
export const CustomAlert = () => {
  const { visible, title, message, buttons, hideAlert } =
    useCustomAlert();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.alertBox,
            {
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderColor: isDark ? '#333' : '#E0E0E0',
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.message,
              { color: isDark ? '#888' : '#555' },
            ]}
          >
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive =
                btn.style === 'destructive';

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={[
                    styles.button,
                    isCancel && {
                      backgroundColor: isDark
                        ? '#222'
                        : '#F5F5F5',
                      borderWidth: 1,
                      borderColor: isDark
                        ? '#333'
                        : '#E0E0E0',
                    },
                    isDestructive && {
                      backgroundColor: '#EF4444',
                    },
                    !isCancel &&
                      !isDestructive && {
                        backgroundColor: '#00C853',
                      },
                  ]}
                  onPress={() => {
                    hideAlert(); // Fecha o alerta sempre que um botão for clicado
                    if (btn.onPress) btn.onPress();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isCancel && {
                        color: isDark ? '#FFF' : '#000',
                      },
                      (isDestructive ||
                        (!isCancel && !isDestructive)) && {
                        color: isDark ? '#0A0A0A' : '#FFF',
                      },
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};


