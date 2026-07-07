import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../../styles/tokens';

type LoadingStateProps = {
  message?: string;
  isDark?: boolean;
};

export function LoadingState({
  message = 'Carregando...',
  isDark = true,
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={tokens.palette.brand} />
      <Text
        style={[
          styles.message,
          { color: isDark ? tokens.palette.surface200 : tokens.palette.surface500 },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxl,
    gap: tokens.spacing.md,
  },
  message: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.semibold,
    textAlign: 'center',
  },
});
