import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { tokens } from '../../styles/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type AppButtonProps = TouchableOpacityProps & {
  title: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  loading?: boolean;
  isDark?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  icon: Icon,
  variant = 'primary',
  loading = false,
  isDark = true,
  disabled,
  textStyle,
  style,
  ...props
}: AppButtonProps) {
  const palette = getPalette(variant, isDark);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      activeOpacity={0.78}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: isDisabled ? 0.55 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.text} />
      ) : Icon ? (
        <Icon size={18} color={palette.text} strokeWidth={2.5} />
      ) : null}
      <Text
        numberOfLines={1}
        style={[styles.text, { color: palette.text }, textStyle]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function getPalette(variant: ButtonVariant, isDark: boolean) {
  if (variant === 'danger') {
    return {
      background: tokens.palette.dangerStrong,
      border: tokens.palette.dangerStrong,
      text: tokens.palette.white,
    };
  }

  if (variant === 'secondary') {
    return {
      background: isDark ? tokens.palette.surface750 : tokens.palette.white,
      border: isDark ? tokens.palette.surface600 : tokens.palette.surface200,
      text: isDark ? tokens.palette.white : tokens.palette.surface900,
    };
  }

  if (variant === 'ghost') {
    return {
      background: 'transparent',
      border: 'transparent',
      text: isDark ? tokens.palette.surface200 : tokens.palette.surface500,
    };
  }

  return {
    background: tokens.palette.brand,
    border: tokens.palette.brand,
    text: tokens.palette.surface950,
  };
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
  },
  text: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.black,
  },
});
