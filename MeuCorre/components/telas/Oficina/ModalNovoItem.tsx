import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { IconeServico } from './ItemManutencaoCard';
import { useTema } from '../../../hooks/modo_tema';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  nome: string;
  setNome: (t: string) => void;
  intervalo: string;
  setIntervalo: (t: string) => void;
  tempo: string;
  setTempo: (t: string) => void;
  ultimaTrocaKm: string;
  setUltimaTrocaKm: (t: string) => void;
  ultimaTrocaData: string;
  setUltimaTrocaData: (t: string) => void;
  icone: string;
  setIcone: (t: string) => void;
}

const ICONES_DISPONIVEIS = [
  'wrench',
  'droplets',
  'circle-dot',
  'disc',
  'cog',
  'zap',
  'activity',
  'fuel',
];

export const ModalNovoItem = ({
  visible,
  onClose,
  onSave,
  nome,
  setNome,
  intervalo,
  setIntervalo,
  tempo,
  setTempo,
  ultimaTrocaKm,
  setUltimaTrocaKm,
  ultimaTrocaData,
  setUltimaTrocaData,
  icone,
  setIcone,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Função para formatar a data automaticamente com barras (DD/MM/AAAA)
  const handleDateChange = (text: string) => {
    let formatted = text.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted =
        formatted.substring(0, 2) +
        '/' +
        formatted.substring(2);
    }
    if (formatted.length > 5) {
      formatted =
        formatted.substring(0, 5) +
        '/' +
        formatted.substring(5, 9);
    }
    setUltimaTrocaData(formatted);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <View style={styles.overlay}>
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
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: isDark ? '#FFF' : '#000' },
                ]}
              >
                Nova Manutenção
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.closeBtn,
                  {
                    backgroundColor: isDark
                      ? '#222'
                      : '#F5F5F5',
                  },
                ]}
              >
                <X
                  size={20}
                  color={isDark ? '#888' : '#555'}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={[
                  styles.label,
                  { color: isDark ? '#888' : '#555' },
                ]}
              >
                NOME DO SERVIÇO
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark
                      ? '#0A0A0A'
                      : '#F5F5F5',
                    borderColor: isDark
                      ? '#333'
                      : '#E0E0E0',
                    color: isDark ? '#FFF' : '#000',
                  },
                ]}
                placeholder="Ex: Troca de Óleo, Pastilhas..."
                placeholderTextColor={
                  isDark ? '#666' : '#999'
                }
                value={nome}
                onChangeText={setNome}
              />

              <View
                style={{ flexDirection: 'row', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    INTERVALO (KM)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                        borderColor: isDark
                          ? '#333'
                          : '#E0E0E0',
                        color: isDark ? '#FFF' : '#000',
                      },
                    ]}
                    placeholder="Ex: 5000"
                    placeholderTextColor={
                      isDark ? '#666' : '#999'
                    }
                    value={intervalo}
                    onChangeText={setIntervalo}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    OU TEMPO (MESES)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                        borderColor: isDark
                          ? '#333'
                          : '#E0E0E0',
                        color: isDark ? '#FFF' : '#000',
                      },
                    ]}
                    placeholder="Ex: 6"
                    placeholderTextColor={
                      isDark ? '#666' : '#999'
                    }
                    value={tempo}
                    onChangeText={setTempo}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isDark ? '#888' : '#555',
                        marginTop: 0,
                      },
                    ]}
                  >
                    KM DA ÚLTIMA TROCA
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                        borderColor: isDark
                          ? '#333'
                          : '#E0E0E0',
                        color: isDark ? '#FFF' : '#000',
                      },
                    ]}
                    placeholder="Ex: 12500"
                    placeholderTextColor={
                      isDark ? '#666' : '#999'
                    }
                    value={ultimaTrocaKm}
                    onChangeText={setUltimaTrocaKm}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isDark ? '#888' : '#555',
                        marginTop: 0,
                      },
                    ]}
                  >
                    DATA DA TROCA
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                        borderColor: isDark
                          ? '#333'
                          : '#E0E0E0',
                        color: isDark ? '#FFF' : '#000',
                      },
                    ]}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor={
                      isDark ? '#666' : '#999'
                    }
                    value={ultimaTrocaData}
                    onChangeText={handleDateChange}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: '#888',
                  marginTop: 8,
                  marginBottom: 8,
                  fontStyle: 'italic',
                }}
              >
                * Deixe em branco se a manutenção acabou de
                ser feita agora.
              </Text>

              <Text
                style={[
                  styles.label,
                  { color: isDark ? '#888' : '#555' },
                ]}
              >
                ÍCONE DA LISTA
              </Text>
              <View style={styles.iconGrid}>
                {ICONES_DISPONIVEIS.map((id) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.iconWrapper,
                      {
                        backgroundColor:
                          icone === id
                            ? 'rgba(0,200,83,0.1)'
                            : isDark
                              ? '#0A0A0A'
                              : '#F5F5F5',
                        borderColor:
                          icone === id
                            ? '#00C853'
                            : isDark
                              ? '#333'
                              : '#E0E0E0',
                      },
                    ]}
                    onPress={() => setIcone(id)}
                  >
                    <IconeServico
                      id={id}
                      color={
                        icone === id
                          ? '#00C853'
                          : isDark
                            ? '#666'
                            : '#999'
                      }
                      size={24}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.btnSave,
                  {
                    opacity:
                      nome && (intervalo || tempo)
                        ? 1
                        : 0.5,
                  },
                ]}
                disabled={!nome || (!intervalo && !tempo)}
                onPress={onSave}
              >
                <Check
                  size={20}
                  color="#0A0A0A"
                  strokeWidth={3}
                />
                <Text style={styles.btnSaveText}>
                  SALVAR MANUTENÇÃO
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '900' },
  closeBtn: { padding: 8, borderRadius: 12 },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  btnSave: {
    backgroundColor: '#00C853',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
  },
  btnSaveText: {
    color: '#0A0A0A',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
