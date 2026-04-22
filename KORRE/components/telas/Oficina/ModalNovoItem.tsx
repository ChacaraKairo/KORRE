// Arquivo: src/components/telas/Oficina/ModalNovoItem.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, Check, Landmark } from 'lucide-react-native';
import { IconeServico } from './ItemManutencaoCard';
import { useTema } from '../../../hooks/modo_tema';
import { useModalNovoItem } from '../../../hooks/oficina/useModalNovoItem';

interface Props {
  visible: boolean;
  onClose: () => void;
  veiculoId: number;
  onRefresh: () => void;
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
  veiculoId,
  onRefresh,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Define uma cor de placeholder visível para cada tema
  const placeholderColor = isDark ? '#666666' : '#999999';

  const {
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
    preco,
    setPreco,
    salvarNoFinanceiro,
    setSalvarNoFinanceiro,
    salvarManutencao,
  } = useModalNovoItem(veiculoId, () => {
    onRefresh();
    onClose();
  });

  const handleDateChange = (text: string) => {
    let formatted = text.replace(/\D/g, '');
    if (formatted.length > 2)
      formatted =
        formatted.substring(0, 2) +
        '/' +
        formatted.substring(2);
    if (formatted.length > 5)
      formatted =
        formatted.substring(0, 5) +
        '/' +
        formatted.substring(5, 9);
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
                  : '#FFF',
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
                placeholder="Ex: Troca de Óleo"
                placeholderTextColor={placeholderColor}
                value={nome}
                onChangeText={setNome}
              />

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
                    placeholder="5000"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    value={intervalo}
                    onChangeText={setIntervalo}
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
                    placeholder="6"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    value={tempo}
                    onChangeText={setTempo}
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
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    KM ÚLTIMA TROCA
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
                    placeholder="12500"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    value={ultimaTrocaKm}
                    onChangeText={setUltimaTrocaKm}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
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
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    maxLength={10}
                    value={ultimaTrocaData}
                    onChangeText={handleDateChange}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginTop: 16,
                  alignItems: 'flex-end',
                }}
              >
                <View style={{ flex: 1.2 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    PREÇO (R$)
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
                    placeholder="0,00"
                    placeholderTextColor={placeholderColor}
                    keyboardType="decimal-pad"
                    value={preco}
                    onChangeText={setPreco}
                  />
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setSalvarNoFinanceiro(
                      !salvarNoFinanceiro,
                    )
                  }
                  style={[
                    styles.financeToggle,
                    {
                      backgroundColor: salvarNoFinanceiro
                        ? 'rgba(0, 200, 83, 0.1)'
                        : isDark
                          ? '#222'
                          : '#EEE',
                      borderColor: salvarNoFinanceiro
                        ? '#00C853'
                        : 'transparent',
                    },
                  ]}
                >
                  <Landmark
                    size={16}
                    color={
                      salvarNoFinanceiro
                        ? '#00C853'
                        : '#888'
                    }
                  />
                  <Text
                    style={[
                      styles.financeText,
                      {
                        color: salvarNoFinanceiro
                          ? '#00C853'
                          : '#888',
                      },
                    ]}
                  >
                    {salvarNoFinanceiro
                      ? 'NO FINANCEIRO'
                      : 'SÓ OFICINA'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.label,
                  {
                    color: isDark ? '#888' : '#555',
                    marginTop: 16,
                  },
                ]}
              >
                ÍCONE
              </Text>
              <View style={styles.iconGrid}>
                {ICONES_DISPONIVEIS.map((id) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.iconWrapper,
                      {
                        borderColor:
                          icone === id
                            ? '#00C853'
                            : isDark
                              ? '#333'
                              : '#E0E0E0',
                        backgroundColor:
                          icone === id
                            ? 'rgba(0,200,83,0.1)'
                            : 'transparent',
                      },
                    ]}
                    onPress={() => setIcone(id)}
                  >
                    <IconeServico
                      id={id}
                      color={
                        icone === id ? '#00C853' : '#888'
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
                onPress={salvarManutencao}
                disabled={!nome || (!intervalo && !tempo)}
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  financeToggle: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  financeText: { fontSize: 9, fontWeight: '900' },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
