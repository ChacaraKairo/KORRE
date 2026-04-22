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

      {/* O texto visual que o usuário vê */}
      <Text
        style={[styles.valueText, { color: mainColor }]}
      >
        {valor}
      </Text>

      {/* O input real (escondido) */}
      <TextInput
        ref={inputRef}
        value={valor} // 👈 CRÍTICO: Agora o input obedece ao estado 'valor'
        keyboardType="numeric"
        onChangeText={onChangeText}
        style={styles.hiddenInput}
        maxLength={15} // Segurança para não quebrar o layout
        cursorColor={mainColor} // Deixa o cursor com a cor do tema
        autoFocus
        caretHidden={true} // Esconde o cursor piscando
        selectionColor="transparent" // Garante que a seleção de texto também não apareça
      />
    </TouchableOpacity>
  </View>
);
