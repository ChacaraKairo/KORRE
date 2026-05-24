import {
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';

import { styles } from '../../../styles/generated/components/telas/CalculadoraFlex/MainCalculadoraFlexStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/CalculadoraFlex/MainCalculadoraFlexInlineStyles';

export default function MainCalculadoraFlex() {
  const { t } = useTranslation();
  const [precoEtanol, setPrecoEtanol] = useState('');
  const [precoGasolina, setPrecoGasolina] = useState('');

  const calcularVantagem = () => {
    const alc = parseFloat(precoEtanol.replace(',', '.'));
    const gas = parseFloat(precoGasolina.replace(',', '.'));

    if (!alc || !gas || Number.isNaN(alc) || Number.isNaN(gas)) {
      return null;
    }

    const paridade = (alc / gas) * 100;
    const compensaEtanol = paridade <= 75;

    return {
      compensaEtanol,
      paridade: paridade.toFixed(1),
      limiteEtanol: (gas * 0.75).toFixed(2),
    };
  };

  const resultado = calcularVantagem();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <KeyboardAvoidingView
      style={inlineStyles.inline1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputsSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: '#00C853' }]}>
              {t('flex_calc.ethanol_price_label')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDark ? '#161616' : '#FFFFFF',
                  borderColor: isDark ? '#222' : '#E0E0E0',
                },
              ]}
            >
              <Text style={[styles.inputPrefix, { color: '#00C853' }]}>
                R$
              </Text>
              <TextInput
                style={[styles.input, { color: '#00C853' }]}
                placeholder={t('flex_calc.placeholder_price')}
                placeholderTextColor="rgba(0,200,83,0.2)"
                keyboardType="decimal-pad"
                value={precoEtanol}
                onChangeText={setPrecoEtanol}
                selectionColor="#00C853"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: '#EAB308' }]}>
              {t('flex_calc.gasoline_price_label')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                styles.inputWrapperGas,
                {
                  backgroundColor: isDark ? '#161616' : '#FFFFFF',
                  borderColor: isDark ? '#222' : '#E0E0E0',
                },
              ]}
            >
              <Text style={[styles.inputPrefix, { color: '#EAB308' }]}>
                R$
              </Text>
              <TextInput
                style={[styles.input, { color: '#EAB308' }]}
                placeholder={t('flex_calc.placeholder_price')}
                placeholderTextColor="rgba(234,179,8,0.2)"
                keyboardType="decimal-pad"
                value={precoGasolina}
                onChangeText={setPrecoGasolina}
                selectionColor="#EAB308"
              />
            </View>
          </View>
        </View>

        {resultado ? (
          <View
            style={[
              styles.resultCard,
              resultado.compensaEtanol
                ? styles.resultCardEtanol
                : styles.resultCardGas,
            ]}
          >
            <Text style={styles.resultLabel}>
              {t('flex_calc.break_even')}
            </Text>
            <Text
              style={[
                styles.resultTitle,
                {
                  color: resultado.compensaEtanol
                    ? '#00C853'
                    : '#EAB308',
                },
              ]}
            >
              {resultado.compensaEtanol
                ? t('flex_calc.ethanol')
                : t('flex_calc.gasoline')}
            </Text>

            <View style={styles.resultDivider} />

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>
                  {t('flex_calc.performance')}
                </Text>
                <Text
                  style={[
                    styles.resultStatValue,
                    {
                      color: resultado.compensaEtanol
                        ? '#00C853'
                        : '#EAB308',
                    },
                  ]}
                >
                  {resultado.paridade}%
                </Text>
              </View>
              <View style={styles.resultVerticalDivider} />
              <View style={styles.resultStat}>
                <Text
                  style={[
                    styles.resultStatLabel,
                    { color: isDark ? '#888' : '#555' },
                  ]}
                >
                  {t('flex_calc.ethanol_limit')}
                </Text>
                <Text
                  style={[
                    styles.resultStatValue,
                    { color: isDark ? '#fff' : '#000' },
                  ]}
                >
                  R$ {resultado.limiteEtanol}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
                borderColor: isDark ? '#222' : '#E0E0E0',
              },
            ]}
          >
            <FontAwesome5
              name="gas-pump"
              size={40}
              color={isDark ? '#1A1A1A' : '#E0E0E0'}
            />
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? '#333' : '#888' },
              ]}
            >
              {t('flex_calc.empty_state')}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: isDark ? '#111' : '#FFFFFF',
              borderColor: isDark ? '#161616' : '#E0E0E0',
            },
          ]}
        >
          <View style={styles.infoIconWrap}>
            <Ionicons
              name="information-circle"
              size={22}
              color="#00C853"
            />
          </View>
          <View style={inlineStyles.inline2}>
            <Text
              style={[
                styles.infoTitle,
                { color: isDark ? '#fff' : '#000' },
              ]}
            >
              {t('flex_calc.updated_calc_title')}
            </Text>
            <Text
              style={[
                styles.infoText,
                { color: isDark ? '#666' : '#555' },
              ]}
            >
              {t('flex_calc.updated_calc_text_before')}{' '}
              <Text style={styles.infoHighlight}>75%</Text>{' '}
              {t('flex_calc.updated_calc_text_after')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

