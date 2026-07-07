import React, { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { tokens } from '../../styles/tokens';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  isDark?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppHeader({
  title,
  subtitle,
  isDark = true,
  onBack,
  right,
  style,
}: AppHeaderProps) {
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;
  const borderColor = isDark ? tokens.palette.surface650 : tokens.palette.surface200;
  const buttonBg = isDark ? tokens.palette.surface750 : tokens.palette.white;

  return (
    <View style={[styles.container, { borderBottomColor: borderColor }, style]}>
      <View style={styles.leftGroup}>
        {onBack ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            activeOpacity={0.75}
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: buttonBg, borderColor },
            ]}
          >
            <ArrowLeft size={20} color={textColor} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.titleGroup}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: textColor }]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={2}
              style={[styles.subtitle, { color: mutedColor }]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rightGroup}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    minWidth: 0,
  },
  rightGroup: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.black,
  },
  subtitle: {
    marginTop: tokens.spacing.xxs,
    fontSize: tokens.typography.size.sm,
    lineHeight: 17,
  },
});
