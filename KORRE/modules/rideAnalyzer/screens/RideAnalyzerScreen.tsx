import { useRouter } from 'expo-router';
import type { ComponentType } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  Eraser,
  Gauge,
  MapPin,
  Route,
  Timer,
  Wallet,
} from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { AppRoutes } from '../../../constants/routes';
import { useRideAnalyzer } from '../hooks/useRideAnalyzer';
import type { RideDecision } from '../../rideDecision';

const DECISION_COLORS: Record<RideDecision, string> = {
  ideal: '#00C853',
  aceitavel: '#1E88E5',
  fraca: '#F9A825',
  toxica: '#FB8C00',
  prejuizo: '#E53935',
};

function formatCurrency(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

interface AnalyzerInputProps {
  label: string;
  value: string;
  placeholder: string;
  icon: ComponentType<{ size: number; color: string }>;
  onChangeText: (value: string) => void;
  isDark: boolean;
}

function AnalyzerInput({
  label,
  value,
  placeholder,
  icon: Icon,
  onChangeText,
  isDark,
}: AnalyzerInputProps) {
  return (
    <View
      style={[
        styles.inputBox,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#242424' : '#E0E0E0',
        },
      ]}
    >
      <View style={styles.inputHeader}>
        <Icon size={18} color="#00C853" />
        <Text
          style={[
            styles.inputLabel,
            { color: isDark ? '#F5F5F5' : '#1A1A1A' },
          ]}
        >
          {label}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#666' : '#999'}
        keyboardType="decimal-pad"
        style={[
          styles.input,
          { color: isDark ? '#FFFFFF' : '#111111' },
        ]}
      />
    </View>
  );
}

export function RideAnalyzerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const {
    form,
    loading,
    resultado,
    indices,
    indicesConfigurados,
    handleChange,
    analisar,
    limpar,
  } = useRideAnalyzer();

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#151515';
  const mutedColor = isDark ? '#9A9A9A' : '#666666';

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: bgColor },
        ]}
      >
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={styles.keyboard}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Text style={[styles.eyebrow, { color: '#00C853' }]}>
              {t('rideAnalyzer.eyebrow')}
            </Text>
            <Text style={[styles.title, { color: textColor }]}>
              {t('rideAnalyzer.title')}
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}>
              {t('rideAnalyzer.subtitle')}
            </Text>
          </View>

          {!indicesConfigurados ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: isDark ? '#161616' : '#FFFFFF',
                  borderColor: isDark ? '#242424' : '#E0E0E0',
                },
              ]}
            >
              <Calculator size={28} color="#00C853" />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: textColor },
                ]}
              >
                {t('rideAnalyzer.empty.title')}
              </Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: mutedColor },
                ]}
              >
                {t('rideAnalyzer.empty.text')}
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                  router.push(AppRoutes.auditoriaKorre)
                }
              >
                <Text style={styles.primaryButtonText}>
                  {t('rideAnalyzer.empty.action')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.indexRow}>
                <View
                  style={[
                    styles.indexPill,
                    {
                      backgroundColor: isDark
                        ? '#161616'
                        : '#FFFFFF',
                      borderColor: isDark ? '#242424' : '#E0E0E0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.indexLabel,
                      { color: mutedColor },
                    ]}
                  >
                    {t('rideAnalyzer.indices.km')}
                  </Text>
                  <Text
                    style={[
                      styles.indexValue,
                      { color: textColor },
                    ]}
                  >
                    {formatCurrency(indices?.custoKm ?? 0)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.indexPill,
                    {
                      backgroundColor: isDark
                        ? '#161616'
                        : '#FFFFFF',
                      borderColor: isDark ? '#242424' : '#E0E0E0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.indexLabel,
                      { color: mutedColor },
                    ]}
                  >
                    {t('rideAnalyzer.indices.minute')}
                  </Text>
                  <Text
                    style={[
                      styles.indexValue,
                      { color: textColor },
                    ]}
                  >
                    {formatCurrency(indices?.custoMinuto ?? 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.formGrid}>
                <AnalyzerInput
                  label={t('rideAnalyzer.fields.value')}
                  value={form.valorOferecido}
                  placeholder={t(
                    'rideAnalyzer.placeholders.value',
                  )}
                  icon={Wallet}
                  isDark={isDark}
                  onChangeText={(value) =>
                    handleChange('valorOferecido', value)
                  }
                />
                <AnalyzerInput
                  label={t('rideAnalyzer.fields.time')}
                  value={form.tempoTotalMinutos}
                  placeholder={t(
                    'rideAnalyzer.placeholders.time',
                  )}
                  icon={Timer}
                  isDark={isDark}
                  onChangeText={(value) =>
                    handleChange('tempoTotalMinutos', value)
                  }
                />
                <AnalyzerInput
                  label={t('rideAnalyzer.fields.pickupKm')}
                  value={form.distanciaAteEmbarqueKm}
                  placeholder={t(
                    'rideAnalyzer.placeholders.pickupKm',
                  )}
                  icon={MapPin}
                  isDark={isDark}
                  onChangeText={(value) =>
                    handleChange(
                      'distanciaAteEmbarqueKm',
                      value,
                    )
                  }
                />
                <AnalyzerInput
                  label={t('rideAnalyzer.fields.rideKm')}
                  value={form.distanciaViagemKm}
                  placeholder={t(
                    'rideAnalyzer.placeholders.rideKm',
                  )}
                  icon={Route}
                  isDark={isDark}
                  onChangeText={(value) =>
                    handleChange('distanciaViagemKm', value)
                  }
                />
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={limpar}
                >
                  <Eraser size={18} color="#00C853" />
                  <Text style={styles.secondaryButtonText}>
                    {t('common.limpar')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={analisar}
                >
                  <Gauge size={18} color="#121212" />
                  <Text style={styles.primaryButtonText}>
                    {t('rideAnalyzer.actions.analyze')}
                  </Text>
                </TouchableOpacity>
              </View>

              {resultado ? (
                <View
                  style={[
                    styles.resultCard,
                    {
                      backgroundColor: isDark
                        ? '#161616'
                        : '#FFFFFF',
                      borderColor:
                        DECISION_COLORS[resultado.decisao],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultLabel,
                      {
                        color:
                          DECISION_COLORS[resultado.decisao],
                      },
                    ]}
                  >
                    {t(
                      `rideAnalyzer.decisions.${resultado.decisao}`,
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.resultTitle,
                      { color: textColor },
                    ]}
                  >
                    {t(resultado.mensagem)}
                  </Text>
                  <Text
                    style={[
                      styles.resultReason,
                      { color: mutedColor },
                    ]}
                  >
                    {t(resultado.motivo)}
                  </Text>

                  <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                      <Text
                        style={[
                          styles.metricLabel,
                          { color: mutedColor },
                        ]}
                      >
                        {t('rideAnalyzer.metrics.cost')}
                      </Text>
                      <Text
                        style={[
                          styles.metricValue,
                          { color: textColor },
                        ]}
                      >
                        {formatCurrency(resultado.custoTotal)}
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text
                        style={[
                          styles.metricLabel,
                          { color: mutedColor },
                        ]}
                      >
                        {t('rideAnalyzer.metrics.profit')}
                      </Text>
                      <Text
                        style={[
                          styles.metricValue,
                          { color: textColor },
                        ]}
                      >
                        {formatCurrency(resultado.lucroLiquido)}
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text
                        style={[
                          styles.metricLabel,
                          { color: mutedColor },
                        ]}
                      >
                        {t('rideAnalyzer.metrics.hour')}
                      </Text>
                      <Text
                        style={[
                          styles.metricValue,
                          { color: textColor },
                        ]}
                      >
                        {formatCurrency(resultado.lucroPorHora)}
                      </Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text
                        style={[
                          styles.metricLabel,
                          { color: mutedColor },
                        ]}
                      >
                        {t('rideAnalyzer.metrics.distance')}
                      </Text>
                      <Text
                        style={[
                          styles.metricValue,
                          { color: textColor },
                        ]}
                      >
                        {resultado.distanciaTotalKm.toFixed(1)} km
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  indexRow: {
    flexDirection: 'row',
    gap: 10,
  },
  indexPill: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  indexLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  indexValue: {
    fontSize: 17,
    fontWeight: '900',
  },
  formGrid: {
    gap: 12,
  },
  inputBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    fontSize: 22,
    fontWeight: '900',
    paddingVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: '#00C853',
    fontSize: 14,
    fontWeight: '900',
  },
  resultCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  resultReason: {
    fontSize: 14,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  metricItem: {
    width: '47%',
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
  },
});
