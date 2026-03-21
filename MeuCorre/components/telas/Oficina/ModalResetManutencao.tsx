import React, { useState, useEffect } from 'react';
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
import { useTema } from '../../../hooks/modo_tema';
import { IconeServico } from './ItemManutencaoCard';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (
    valor: number,
    novoIntKm: number | null,
    novoIntMeses: number | null,
  ) => void;
  itemNome: string;
  itemIcone: string;
  itemIntervaloKm: number | null;
  itemIntervaloMeses: number | null;
  kmAtual: number;
  ultimoValor: number;
  isVirtual?: boolean;
}

export const ModalResetManutencao = ({
  visible,
  onClose,
  onConfirm,
  itemNome,
  itemIcone,
  itemIntervaloKm,
  itemIntervaloMeses,
  kmAtual,
  ultimoValor,
  isVirtual,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const [valor, setValor] = useState('0,00');
  const [intervaloKm, setIntervaloKm] = useState('');
  const [intervaloMeses, setIntervaloMeses] = useState('');

  useEffect(() => {
    if (visible) {
      // Atualiza o valor para o do último histórico registado (ou 0 se não houver)
      if (ultimoValor > 0) {
        let formattedValue = ultimoValor.toFixed(2);
        formattedValue = formattedValue.replace('.', ',');
        formattedValue = formattedValue.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          '.',
        );
        setValor(formattedValue);
      } else {
        setValor('0,00');
      }

      setIntervaloKm(
        itemIntervaloKm ? itemIntervaloKm.toString() : '',
      );
      setIntervaloMeses(
        itemIntervaloMeses
          ? itemIntervaloMeses.toString()
          : '',
      );
    }
  }, [
    visible,
    ultimoValor,
    itemIntervaloKm,
    itemIntervaloMeses,
  ]);

  const handleValueChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    if (!cleanText) {
      setValor('0,00');
      return;
    }
    let formattedValue = (
      parseInt(cleanText, 10) / 100
    ).toFixed(2);
    formattedValue = formattedValue.replace('.', ',');
    formattedValue = formattedValue.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.',
    );
    setValor(formattedValue);
  };

  const handleConfirm = () => {
    const valorNumerico = parseFloat(
      valor.replace(/\./g, '').replace(',', '.') || '0',
    );
    const intKmNum = parseInt(
      intervaloKm.replace(/\D/g, ''),
      10,
    );
    const intMesesNum = parseInt(
      intervaloMeses.replace(/\D/g, ''),
      10,
    );

    onConfirm(
      valorNumerico,
      isNaN(intKmNum) ? null : intKmNum,
      isNaN(intMesesNum) ? null : intMesesNum,
    );
  };

  const dataAtual = new Date().toLocaleDateString('pt-BR');

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
                Realizar Manutenção
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
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor:
                        'rgba(0, 200, 83, 0.1)',
                    },
                  ]}
                >
                  <IconeServico
                    id={itemIcone}
                    size={32}
                    color="#00C853"
                  />
                </View>
                <Text
                  style={[
                    styles.itemNome,
                    { color: isDark ? '#FFF' : '#000' },
                  ]}
                >
                  {itemNome}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    DATA
                  </Text>
                  <View
                    style={[
                      styles.readOnlyBox,
                      {
                        backgroundColor: isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.readOnlyText,
                        { color: isDark ? '#FFF' : '#000' },
                      ]}
                    >
                      {dataAtual}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    KM ATUAL
                  </Text>
                  <View
                    style={[
                      styles.readOnlyBox,
                      {
                        backgroundColor: isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.readOnlyText,
                        { color: isDark ? '#FFF' : '#000' },
                      ]}
                    >
                      {kmAtual} km
                    </Text>
                  </View>
                </View>
              </View>

              {isVirtual && (
                <View
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    backgroundColor:
                      'rgba(255, 193, 7, 0.1)',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 193, 7, 0.3)',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFC107',
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Primeira Vez: Confere os intervalos
                    desta manutenção para a tua máquina.
                    Podes alterá-los à vontade!
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#888' : '#555' },
                    ]}
                  >
                    REFAZER A CADA (KM)
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
                        fontSize: 16,
                        padding: 12,
                      },
                    ]}
                    placeholder="Ex: 5000"
                    placeholderTextColor={
                      isDark ? '#666' : '#999'
                    }
                    value={intervaloKm}
                    onChangeText={setIntervaloKm}
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
                    REFAZER A CADA (MESES)
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
                        fontSize: 16,
                        padding: 12,
                      },
                    ]}
                    placeholder="Ex: 6"
                    placeholderTextColor={
                      isDark ? '#666' : '#999'
                    }
                    value={intervaloMeses}
                    onChangeText={setIntervaloMeses}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.label,
                  { color: isDark ? '#888' : '#555' },
                ]}
              >
                VALOR PAGO (R$)
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
                placeholderTextColor={
                  isDark ? '#666' : '#999'
                }
                value={valor}
                onChangeText={handleValueChange}
                keyboardType="numeric"
              />
              {ultimoValor > 0 && (
                <Text
                  style={{
                    fontSize: 12,
                    color: '#888',
                    marginTop: 8,
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                >
                  Último valor pago: R${' '}
                  {ultimoValor.toFixed(2).replace('.', ',')}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.btnSave, { marginTop: 32 }]}
                onPress={handleConfirm}
              >
                <Check
                  size={20}
                  color="#0A0A0A"
                  strokeWidth={3}
                />
                <Text style={styles.btnSaveText}>
                  CONFIRMAR MANUTENÇÃO
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
  iconWrap: {
    padding: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  itemNome: { fontSize: 18, fontWeight: 'bold' },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  readOnlyBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
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
