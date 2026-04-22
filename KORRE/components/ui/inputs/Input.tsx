// Arquivo: src/components/inputs/Input.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from 'react-native';
import { inputStyles as styles } from '../../../styles/components/inputStyles';

interface InputProps extends TextInputProps {
  label: string;
  erro?: boolean;
  Icone?: any; // Recebe o componente de ícone (ex: User, Lock)
}

export const Input: React.FC<InputProps> = ({
  label,
  erro,
  Icone,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocus,
          erro && { borderColor: '#EF4444' },
        ]}
      >
        {Icone && (
          <View style={styles.icon}>
            <Icone
              size={20}
              color={
                erro
                  ? '#EF4444'
                  : isFocused
                    ? '#00C853'
                    : '#555'
              }
            />
          </View>
        )}

        <TextInput
          style={styles.field}
          placeholderTextColor="#444"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
    </View>
  );
};
