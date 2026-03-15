import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { financeStyles as styles } from '../../../styles/telas/Finance/financeStyles';

interface ValueInputProps {
  valor: string;
  mainColor: string;
  inputRef: React.RefObject<TextInput | null>;
  onChangeText: (text: string) => void;
}

export const ValueInput = ({
  valor,
  mainColor,
  inputRef,
  onChangeText,
}: ValueInputProps) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueTitle}>Valor da Anotação</Text>
    <TouchableOpacity
      style={styles.valueTouchable}
      onPress={() => inputRef.current?.focus()}
      activeOpacity={1}
    >
      <Text style={styles.currencySymbol}>R$</Text>
      <Text
        style={[styles.valueText, { color: mainColor }]}
      >
        {valor}
      </Text>
      <TextInput
        ref={inputRef}
        keyboardType="numeric"
        onChangeText={onChangeText}
        style={styles.hiddenInput}
        autoFocus
      />
    </TouchableOpacity>
  </View>
);
