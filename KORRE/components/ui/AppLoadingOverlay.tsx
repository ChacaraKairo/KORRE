import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppLoading } from '../../hooks/ui/useAppLoading';

/**
 * Executa a função de app loading overlay.
 */
export const AppLoadingOverlay = () => {
  const { visible, message } = useAppLoading();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={styles.root}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#00C853" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(35, 35, 35, 0.58)',
  },
  box: {
    minWidth: 210,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#111111',
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
