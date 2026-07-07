import React, { type ReactNode } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { tokens } from '../../styles/tokens';

type AppScreenProps = {
  children: ReactNode;
  isDark?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export function AppScreen({
  children,
  isDark = true,
  scroll = false,
  contentStyle,
  style,
}: AppScreenProps) {
  const backgroundColor = isDark
    ? tokens.palette.surface950
    : tokens.palette.surface100;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }, style]}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.xxxl,
  },
});
