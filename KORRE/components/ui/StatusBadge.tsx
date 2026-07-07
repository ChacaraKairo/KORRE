import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../../styles/tokens';

type StatusBadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  const color = getToneColor(tone);

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}1A` }]}>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function getToneColor(tone: StatusBadgeTone) {
  switch (tone) {
    case 'success':
      return tokens.palette.brand;
    case 'warning':
      return tokens.palette.warningStrong;
    case 'danger':
      return tokens.palette.dangerStrong;
    case 'info':
      return tokens.palette.blue;
    default:
      return tokens.palette.surface300;
  }
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 28,
    borderRadius: tokens.radius.round,
    borderWidth: 1,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.black,
  },
});
