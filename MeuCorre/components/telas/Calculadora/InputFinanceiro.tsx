import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Calculadora/calculadoraStyles';
import { useTema } from '../../../hooks/modo_tema';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  suffix?: string;
  keyboardType?: 'numeric' | 'default';
  onHelp?: () => void;
}

export const InputFinanceiro = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  suffix,
  keyboardType = 'numeric',
  onHelp,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#666' : '#888';

  return (
    <View style={styles.inputWrapper}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text
          style={[
            styles.inputLabel,
            { color: textMuted, marginBottom: 0 },
          ]}
        >
          {label}
        </Text>
        {onHelp && (
          <TouchableOpacity
            onPress={onHelp}
            activeOpacity={0.6}
            style={{ padding: 2 }}
          >
            <HelpCircle size={14} color={textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
          },
        ]}
      >
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={textMuted}
          keyboardType={keyboardType}
        />
        {suffix && (
          <Text
            style={[
              styles.inputSuffix,
              { color: textMuted },
            ]}
          >
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
};
