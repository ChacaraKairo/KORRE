import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../../styles/tokens';

type Step = {
  key: string;
  label: string;
};

type IndicesStepProgressProps = {
  steps: Step[];
  currentIndex: number;
  isDark?: boolean;
};

export function IndicesStepProgress({
  steps,
  currentIndex,
  isDark = true,
}: IndicesStepProgressProps) {
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          return (
            <View
              key={step.key}
              style={[
                styles.dot,
                {
                  backgroundColor: active
                    ? tokens.palette.brand
                    : isDark
                      ? tokens.palette.surface650
                      : tokens.palette.surface200,
                },
              ]}
            />
          );
        })}
      </View>
      <Text style={[styles.label, { color: mutedColor }]}>
        {steps[currentIndex]?.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  track: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  dot: {
    flex: 1,
    height: 5,
    borderRadius: tokens.radius.round,
  },
  label: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.bold,
  },
});
