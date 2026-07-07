import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gauge, Route, Timer } from 'lucide-react-native';
import { AppCard } from '../ui/AppCard';
import { tokens } from '../../styles/tokens';

type IntroItem = {
  title: string;
  description: string;
  icon: 'km' | 'minute' | 'goal';
};

type IndicesIntroCardProps = {
  title: string;
  description: string;
  items: IntroItem[];
  isDark?: boolean;
};

export function IndicesIntroCard({
  title,
  description,
  items,
  isDark = true,
}: IndicesIntroCardProps) {
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;

  return (
    <AppCard isDark={isDark} style={styles.card}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.description, { color: mutedColor }]}>
        {description}
      </Text>
      <View style={styles.items}>
        {items.map((item) => {
          const Icon =
            item.icon === 'km' ? Route : item.icon === 'minute' ? Timer : Gauge;
          return (
            <View key={item.title} style={styles.item}>
              <View style={styles.iconWrap}>
                <Icon size={20} color={tokens.palette.brand} />
              </View>
              <View style={styles.itemText}>
                <Text style={[styles.itemTitle, { color: textColor }]}>
                  {item.title}
                </Text>
                <Text style={[styles.itemDescription, { color: mutedColor }]}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: tokens.spacing.md,
  },
  title: {
    fontSize: tokens.typography.size.xxxl,
    fontWeight: tokens.typography.weight.black,
  },
  description: {
    fontSize: tokens.typography.size.md,
    lineHeight: 21,
  },
  items: {
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.xs,
  },
  item: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: tokens.radius.round,
    backgroundColor: tokens.alpha.brand10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontWeight: tokens.typography.weight.black,
    fontSize: tokens.typography.size.md,
  },
  itemDescription: {
    marginTop: tokens.spacing.xxs,
    fontSize: tokens.typography.size.sm,
    lineHeight: 18,
  },
});
