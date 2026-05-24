// src/components/telas/Cadastro/CustomAlert.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../../styles/generated/components/telas/Cadastro/CustomAlertStyles';
// Importe a store correta
import { useCustomAlert } from '../../../hooks/alert/useCustomAlert';

/**
 * Executa a função de custom alert.
 */
export function CustomAlert() {
  // Conecta ao Zustand
  const { visible, title, message, buttons, hideAlert } =
    useCustomAlert();

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>
            {title || 'Alerta'}
          </Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn.style === 'cancel' &&
                    styles.buttonCancel,
                  btn.style === 'destructive' &&
                    styles.buttonDestructive,
                ]}
                onPress={() => {
                  if (btn.onPress) btn.onPress();
                  hideAlert();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.style === 'cancel' &&
                      styles.buttonTextCancel,
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}


