import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  X,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
              style={{
                color: textColor,
                fontSize: 18,
                fontWeight: 'bold',
              }}
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: '900' },
  label: { color: '#888', marginBottom: 8, fontSize: 13 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    minHeight: 60,
  },
  btnSave: {
    backgroundColor: '#00C853',
    flexDirection: 'row',
    padding: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnSaveText: {
    fontWeight: '900',
    color: '#0A0A0A',
    marginLeft: 8,
    fontSize: 16,
  },
});
