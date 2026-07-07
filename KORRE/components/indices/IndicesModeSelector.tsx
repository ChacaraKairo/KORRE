import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { tokens } from '../../styles/tokens';

export type IndicesMode = 'simple' | 'advanced';

type Option = {
  mode: IndicesMode;
  title: string;
  description: string;
};

type IndicesModeSelectorProps = {
  value: IndicesMode;
  onChange: (value: IndicesMode) => void;
  options: Option[];
  isDark?: boolean;
};

export function IndicesModeSelector({
  value,
  onChange,
  options,
  isDark = true,
}: IndicesModeSelectorProps) {
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = value === option.mode;
        return (
          <TouchableOpacity
            key={option.mode}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            activeOpacity={0.78}
            onPress={() => onChange(option.mode)}
            style={[
              styles.option,
              {
                backgroundColor: selected
                  ? tokens.alpha.brand10
                  : isDark
                    ? tokens.palette.surface800
                    : tokens.palette.white,
                borderColor: selected
                  ? tokens.palette.brand
                  : isDark
                    ? tokens.palette.surface650
                    : tokens.palette.surface200,
              },
            ]}
          >
            <View style={styles.optionText}>
              <Text style={[styles.title, { color: textColor }]}>
                {option.title}
              </Text>
              <Text style={[styles.description, { color: mutedColor }]}>
                {option.description}
              </Text>
            </View>
            {selected ? (
              <CheckCircle2 size={22} color={tokens.palette.brand} />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  option: {
    minHeight: 92,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    padding: tokens.spacing.lg,
    flexDirection: 'row',
    gap: tokens.spacing.md,
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.black,
  },
  description: {
    marginTop: tokens.spacing.xs,
    fontSize: tokens.typography.size.md,
    lineHeight: 20,
  },
});
