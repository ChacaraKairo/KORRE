// src/components/telas/Cadastro/CustomAlert.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// Importe a store correta
import { useCustomAlert } from '../../../hooks/alert/useCustomAlert';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Um pouco mais escuro para destaque
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#1E1E1E', // Tom mais próximo do seu app
    padding: 24,
    borderRadius: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    color: '#00C853', // Verde padrão do app
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: '#00C853',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonDestructive: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonTextCancel: {
    color: '#999',
  },
});
