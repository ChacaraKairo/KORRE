import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Inbox } from 'lucide-react-native';
import { tokens } from '../../styles/tokens';
import { AppButton } from './AppButton';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  isDark?: boolean;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  isDark = true,
}: EmptyStateProps) {
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;
  const iconBg = isDark ? tokens.palette.surface750 : tokens.palette.white;
  const borderColor = isDark ? tokens.palette.surface650 : tokens.palette.surface200;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg, borderColor }]}>
        <Icon size={28} color={tokens.palette.brand} />
      </View>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: mutedColor }]}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          isDark={isDark}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.huge,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: tokens.radius.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.black,
    textAlign: 'center',
  },
  description: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.typography.size.md,
    lineHeight: 20,
    textAlign: 'center',
  },
  action: {
    marginTop: tokens.spacing.xl,
    alignSelf: 'stretch',
  },
});
