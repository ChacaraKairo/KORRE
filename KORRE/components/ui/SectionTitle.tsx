import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../../styles/tokens';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  isDark?: boolean;
};

export function SectionTitle({
  title,
  subtitle,
  isDark = true,
}: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: isDark ? tokens.palette.white : tokens.palette.surface900 },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? tokens.palette.surface300 : tokens.palette.surface400 },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.xs,
  },
  title: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.black,
  },
  subtitle: {
    fontSize: tokens.typography.size.md,
    lineHeight: 20,
  },
});
