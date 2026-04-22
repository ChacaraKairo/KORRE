import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';

interface ModalUpdateKmProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  km: string;
  setKm: (km: string) => void;
}

export const ModalUpdateKm = ({
  visible,
  onClose,
  onSave,
  km,
  setKm,
}: ModalUpdateKmProps) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
        style={styles.overlay}
      >
        <View
          style={[
            styles.modalContainer,
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
            Atualizar KM
          </Text>

          <Text
            style={[
              styles.label,
              { color: isDark ? '#888' : '#555' },
            ]}
          >
            QUILOMETRAGEM ATUAL
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark
                  ? '#0A0A0A'
                  : '#F5F5F5',
                color: isDark ? '#FFF' : '#000',
              },
            ]}
            placeholder="Ex: 12500"
            placeholderTextColor="#666"
            value={km}
            onChangeText={setKm}
            keyboardType="numeric"
            autoFocus
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.btnCancel,
                {
                  backgroundColor: isDark
                    ? '#222'
                    : '#F5F5F5',
                },
              ]}
            >
              <Text
                style={[
                  styles.btnCancelText,
                  { color: isDark ? '#FFF' : '#000' },
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              style={[
                styles.btnSave,
                { opacity: km.trim() ? 1 : 0.5 },
              ]}
              disabled={!km.trim()}
            >
              <Text style={styles.btnSaveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#161616',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#888',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#00C853',
    borderRadius: 12,
    color: '#FFF',
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnSave: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#00C853',
    alignItems: 'center',
  },
  btnSaveText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
  },
});
