import React, { type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { tokens } from '../../styles/tokens';

type AppCardProps = {
  children: ReactNode;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppCard({ children, isDark = true, style }: AppCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? tokens.palette.surface800 : tokens.palette.white,
          borderColor: isDark ? tokens.palette.surface650 : tokens.palette.surface200,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
  },
});
