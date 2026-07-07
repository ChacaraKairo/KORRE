import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';
import { tokens } from '../../styles/tokens';

type SuggestionLine = {
  label: string;
  detail: string;
};

type IndicesSuggestionCardProps = {
  title: string;
  description: string;
  status?: string;
  lines?: SuggestionLine[];
  isDark?: boolean;
  loading?: boolean;
  onView: () => void;
  onApply?: () => void;
  onIgnore?: () => void;
  viewLabel: string;
  applyLabel: string;
  ignoreLabel: string;
};

export function IndicesSuggestionCard({
  title,
  description,
  status,
  lines = [],
  isDark = true,
  loading = false,
  onView,
  onApply,
  onIgnore,
  viewLabel,
  applyLabel,
  ignoreLabel,
}: IndicesSuggestionCardProps) {
  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;

  return (
    <AppCard isDark={isDark} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Sparkles size={20} color={tokens.palette.brand} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <Text style={[styles.description, { color: mutedColor }]}>
            {description}
          </Text>
        </View>
      </View>

      {status ? <Text style={[styles.status, { color: textColor }]}>{status}</Text> : null}

      {lines.length > 0 ? (
        <View style={styles.lines}>
          {lines.map((line) => (
            <View key={`${line.label}-${line.detail}`} style={styles.line}>
              <Text style={[styles.lineLabel, { color: textColor }]}>
                {line.label}
              </Text>
              <Text style={[styles.lineDetail, { color: mutedColor }]}>
                {line.detail}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        <AppButton
          title={viewLabel}
          variant="secondary"
          isDark={isDark}
          loading={loading}
          onPress={onView}
          style={styles.action}
        />
        {onApply ? (
          <AppButton
            title={applyLabel}
            isDark={isDark}
            onPress={onApply}
            style={styles.action}
          />
        ) : null}
        {onIgnore ? (
          <AppButton
            title={ignoreLabel}
            variant="ghost"
            isDark={isDark}
            onPress={onIgnore}
            style={styles.action}
          />
        ) : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: tokens.spacing.md,
  },
  header: {
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
  copy: {
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
  status: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.black,
  },
  lines: {
    gap: tokens.spacing.sm,
  },
  line: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.palette.surface600,
    paddingTop: tokens.spacing.sm,
  },
  lineLabel: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.black,
  },
  lineDetail: {
    marginTop: tokens.spacing.xxs,
    fontSize: tokens.typography.size.sm,
    lineHeight: 18,
  },
  actions: {
    gap: tokens.spacing.sm,
  },
  action: {
    width: '100%',
  },
});
