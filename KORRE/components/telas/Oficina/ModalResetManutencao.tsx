import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { IconeServico } from './ItemManutencaoCard';

import { styles } from '../../../styles/generated/components/telas/Oficina/ModalResetManutencaoStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/Oficina/ModalResetManutencaoInlineStyles';
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

  /**
   * Executa a função de handle value change.
   */
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

  /**
   * Executa a função de handle confirm.
   */
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
        style={inlineStyles.inline1}
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
                style={inlineStyles.inline2}
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
                style={inlineStyles.inline3}
              >
                <View style={inlineStyles.inline4}>
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
                <View style={inlineStyles.inline5}>
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
                  style={inlineStyles.inline6}
                >
                  <Text
                    style={inlineStyles.inline7}
                  >
                    Primeira Vez: Confere os intervalos
                    desta manutenção para a tua máquina.
                    Podes alterá-los à vontade!
                  </Text>
                </View>
              )}

              <View
                style={inlineStyles.inline8}
              >
                <View style={inlineStyles.inline9}>
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
                <View style={inlineStyles.inline10}>
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
                  style={inlineStyles.inline11}
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


