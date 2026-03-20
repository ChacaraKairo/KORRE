import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useCustomAlert } from '../../hooks/alert/useCustomAlert';
import { useTema } from '../../hooks/modo_tema';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
