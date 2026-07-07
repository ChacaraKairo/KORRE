import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../ui/AppCard';
import { tokens } from '../../styles/tokens';

type SummaryItem = {
  label: string;
  value: string;
  description?: string;
};

type IndicesSummaryCardProps = {
  title: string;
  items: SummaryItem[];
  isDark?: boolean;
};

export function IndicesSummaryCard({
  title,
  items,
  isDark = true,
}: IndicesSummaryCardProps) {
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;

  return (
    <AppCard isDark={isDark} style={styles.card}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <View style={styles.items}>
        {items.map((item) => (
          <View key={item.label} style={styles.item}>
            <Text style={[styles.label, { color: mutedColor }]}>
              {item.label}
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {item.value}
            </Text>
            {item.description ? (
              <Text style={[styles.description, { color: mutedColor }]}>
                {item.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.black,
  },
  items: {
    gap: tokens.spacing.md,
  },
  item: {
    gap: tokens.spacing.xs,
  },
  label: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.bold,
  },
  value: {
    fontSize: tokens.typography.size.xxxl,
    fontWeight: tokens.typography.weight.black,
  },
  description: {
    fontSize: tokens.typography.size.sm,
    lineHeight: 18,
  },
});
