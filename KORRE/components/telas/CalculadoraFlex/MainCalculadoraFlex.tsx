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
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';
import db from '../../../database/DatabaseInit';
import { getAuthSessionUserId } from '../../../utils/auth/authSession';
import { FuelEntryService } from '../../../modules/fuel/application/FuelEntryService';
import { DataConsentService } from '../../../modules/privacy/DataConsentService';

import { styles } from '../../../styles/generated/components/telas/CalculadoraFlex/MainCalculadoraFlexStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/CalculadoraFlex/MainCalculadoraFlexInlineStyles';

export default function MainCalculadoraFlex() {
  const { t } = useTranslation();
  const [precoEtanol, setPrecoEtanol] = useState('');
  const [precoGasolina, setPrecoGasolina] = useState('');
  const [tipoCombustivel, setTipoCombustivel] =
    useState<'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'energia' | 'flex_outro'>('gasolina');
  const [valorTotal, setValorTotal] = useState('');
  const [litros, setLitros] = useState('');
  const [precoLitro, setPrecoLitro] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [cidade, setCidade] = useState('');
  const [estadoUf, setEstadoUf] = useState('');
  const [observacao, setObservacao] = useState('');
  const [tanqueCheio, setTanqueCheio] = useState(false);
  const [registrarFinanceiro, setRegistrarFinanceiro] =
    useState(false);
  const [salvando, setSalvando] = useState(false);

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

  const parseNumber = (value: string) => {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const salvarAbastecimento = async () => {
    if (salvando) return;
    setSalvando(true);
    try {
      const hasConsent = await DataConsentService.hasResponded();
      if (!hasConsent) {
        await new Promise<void>((resolve) => {
          Alert.alert(
            t('privacidade.consent_title'),
            t('privacidade.consent_message'),
            [
              {
                text: t('privacidade.allow'),
                onPress: async () => {
                  await DataConsentService.setConsent(true);
                  resolve();
                },
              },
              {
                text: t('privacidade.not_now'),
                onPress: async () => {
                  await DataConsentService.setConsent(false);
                  resolve();
                },
              },
            ],
          );
        });
      }

      const userId = getAuthSessionUserId();
      let veiculoId: number | null = null;
      if (userId) {
        const veiculo = await db.getFirstAsync<{ id: number }>(
          `SELECT id FROM veiculos WHERE ativo = 1 LIMIT 1`,
        );
        veiculoId = veiculo?.id ?? null;
      }

      await FuelEntryService.salvarAbastecimento({
        veiculoId,
        tipoCombustivel,
        valorTotal: parseNumber(valorTotal),
        litros: litros ? parseNumber(litros) : null,
        precoUnitario: precoLitro ? parseNumber(precoLitro) : null,
        kmAtual: kmAtual ? parseNumber(kmAtual) : null,
        tanqueCheio,
        cidade: cidade || null,
        estadoUf: estadoUf || null,
        observacao: observacao || null,
        origem: 'calculadora_flex',
        criadoSemLogin: !userId,
        registrarNoFinanceiro: Boolean(userId && registrarFinanceiro),
      });

      if (!userId) {
        Alert.alert(
          t('fuel.saved_title'),
          t('fuel.saved_without_login_msg'),
        );
      } else {
        Alert.alert(t('fuel.saved_title'), t('fuel.saved_msg'));
      }
    } catch (error) {
      Alert.alert(t('common.erro'), String(error));
    } finally {
      setSalvando(false);
    }
  };

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

        <View
          style={{
            marginTop: 12,
            gap: 10,
            padding: 14,
            borderRadius: 12,
            backgroundColor: isDark ? '#111' : '#fff',
            borderWidth: 1,
            borderColor: isDark ? '#222' : '#E0E0E0',
          }}
        >
          <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '800' }}>
            {t('fuel.save_fuel_entry')}
          </Text>
          <TextInput
            placeholder={t('fuel.total_value')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={valorTotal}
            onChangeText={setValorTotal}
            keyboardType="decimal-pad"
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <TextInput
            placeholder={t('fuel.liters')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={litros}
            onChangeText={setLitros}
            keyboardType="decimal-pad"
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <TextInput
            placeholder={t('fuel.price_per_liter')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={precoLitro}
            onChangeText={setPrecoLitro}
            keyboardType="decimal-pad"
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <TextInput
            placeholder={t('fuel.current_km')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={kmAtual}
            onChangeText={setKmAtual}
            keyboardType="number-pad"
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <TextInput
            placeholder={t('fuel.city')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={cidade}
            onChangeText={setCidade}
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <TextInput
            placeholder={t('fuel.state')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={estadoUf}
            onChangeText={setEstadoUf}
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <TextInput
            placeholder={t('fuel.note')}
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={observacao}
            onChangeText={setObservacao}
            style={{ color: isDark ? '#fff' : '#000' }}
          />

          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {(['gasolina', 'etanol', 'diesel', 'gnv', 'energia'] as const).map((tipo) => (
              <TouchableOpacity
                key={tipo}
                onPress={() => setTipoCombustivel(tipo)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: tipoCombustivel === tipo ? '#00C853' : isDark ? '#1F2937' : '#E5E7EB',
                }}
              >
                <Text>{t(`fuel.types.${tipo}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={() => setTanqueCheio((v) => !v)}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>
              {tanqueCheio ? '☑' : '☐'} {t('fuel.full_tank')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRegistrarFinanceiro((v) => !v)}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>
              {registrarFinanceiro ? '☑' : '☐'} {t('fuel.register_finance')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={salvarAbastecimento}
            style={{
              backgroundColor: '#00C853',
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '800' }}>
              {salvando ? t('common.salvando') : t('fuel.save_fuel_entry')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

