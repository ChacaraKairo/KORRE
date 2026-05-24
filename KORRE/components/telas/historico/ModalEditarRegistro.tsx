import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  X,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { styles } from '../../../styles/generated/components/telas/historico/ModalEditarRegistroStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/historico/ModalEditarRegistroDynamicStyles';
/**
 * Executa a função de modal editar registro.
 */
export function ModalEditarRegistro({
  visible,
  registro,
  onClose,
  onSave,
  isDark,
}: any) {
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible && registro) {
      setValor(registro.valor.toString());
      if (registro.dataOriginal) {
        // Garantindo formato ISO para evitar erros de fuso horário
        setData(
          new Date(registro.dataOriginal.replace(' ', 'T')),
        );
      }
      // Resetar o picker sempre que o modal abrir
      setShowPicker(false);
    }
  }, [visible, registro]);

  const onChangeDate = (
    event: any,
    selectedDate?: Date,
  ) => {
    // IMPORTANTE: Para Android, o fechamento deve ser imediato
    setShowPicker(false);

    if (selectedDate) {
      setData(selectedDate);
    }
  };

  /**
   * Executa a função de handle save.
   */
  const handleSave = () => {
    const num = parseFloat(valor.replace(',', '.'));
    if (!isNaN(num)) {
      onSave(registro.id, num, data);
      onClose();
    }
  };

  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const borderColor = isDark ? '#333' : '#DDD';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.content,
            { backgroundColor: bgColor, borderColor },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: textColor }]}
            >
              Editar Registo
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Valor do registo (R$)
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: textColor, borderColor },
            ]}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>
            Data da movimentação
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.input,
              {
                borderColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Text
              style={dynamicInlineStyles.inline1({ textColor })}
            >
              {data.toLocaleDateString('pt-BR')}
            </Text>
            <CalendarIcon size={20} color="#00C853" />
          </TouchableOpacity>

          {/* O Picker no Android funciona melhor se estiver no final do container */}
          {showPicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={new Date()} // Opcional: impede datas futuras
            />
          )}

          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleSave}
          >
            <Check size={20} color="#0A0A0A" />
            <Text style={styles.btnSaveText}>
              Salvar Alterações
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


