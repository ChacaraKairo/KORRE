import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { safeBack } from '../../utils/navigation/safeBack';
import { tokens } from '../../styles/tokens';

type BackButtonProps = {
  fallback?: Href;
  label?: string;
  isDark?: boolean;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({
  fallback,
  label = 'Voltar',
  isDark = true,
  showLabel = false,
  style,
}: BackButtonProps) {
  const router = useRouter();
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const backgroundColor = isDark ? tokens.palette.surface800 : tokens.palette.white;
  const borderColor = isDark ? tokens.palette.surface650 : tokens.palette.surface200;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.75}
      onPress={() => safeBack(router, fallback)}
      style={[
        styles.button,
        { backgroundColor, borderColor },
        showLabel && styles.buttonWithLabel,
        style,
      ]}
    >
      <ArrowLeft size={20} color={textColor} />
      {showLabel ? (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWithLabel: {
    width: 'auto',
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  label: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.black,
  },
});
