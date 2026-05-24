import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';
import db from '../../../database/DatabaseInit';
import { getAuthSessionUserId } from '../../../utils/auth/authSession';
import { FuelEntryService } from '../../../modules/fuel/application/FuelEntryService';
import { DataConsentService } from '../../../modules/privacy/DataConsentService';
import { FuelEntryForm } from './FuelEntryForm';

import { styles } from '../../../styles/generated/components/telas/CalculadoraFlex/MainCalculadoraFlexStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/CalculadoraFlex/MainCalculadoraFlexInlineStyles';

/**
 * Executa a função de main calculadora flex.
 */
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
  const [registrarFinanceiro, setRegistrarFinanceiro] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [elegivelStats, setElegivelStats] = useState(false);

  /**
   * Executa a função de calcular vantagem.
   */
  const calcularVantagem = () => {
    const alc = parseFloat(precoEtanol.replace(',', '.'));
    const gas = parseFloat(precoGasolina.replace(',', '.'));
    if (!alc || !gas || Number.isNaN(alc) || Number.isNaN(gas)) return null;

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

  /**
   * Executa a função de parse number.
   */
  const parseNumber = (value: string) => {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  /**
   * Executa a função de salvar abastecimento.
   */
  const salvarAbastecimento = async () => {
    if (salvando) return;
    if (!tipoCombustivel) {
      Alert.alert(t('common.atencao'), t('fuel.validation_fuel_type_required'));
      return;
    }
    if (parseNumber(valorTotal) <= 0) {
      Alert.alert(t('common.atencao'), t('fuel.validation_total_required'));
      return;
    }
    if (kmAtual && parseNumber(kmAtual) < 0) {
      Alert.alert(t('common.atencao'), t('fuel.validation_km_invalid'));
      return;
    }

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
          'SELECT id FROM veiculos WHERE ativo = 1 LIMIT 1',
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

      setElegivelStats(await DataConsentService.getConsent());

      if (!userId) {
        Alert.alert(t('fuel.saved_title'), t('fuel.saved_without_login_msg'));
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
              <Text style={[styles.inputPrefix, { color: '#00C853' }]}>R$</Text>
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
              <Text style={[styles.inputPrefix, { color: '#EAB308' }]}>R$</Text>
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
              resultado.compensaEtanol ? styles.resultCardEtanol : styles.resultCardGas,
            ]}
          >
            <Text style={styles.resultLabel}>{t('flex_calc.break_even')}</Text>
            <Text
              style={[
                styles.resultTitle,
                { color: resultado.compensaEtanol ? '#00C853' : '#EAB308' },
              ]}
            >
              {resultado.compensaEtanol ? t('flex_calc.ethanol') : t('flex_calc.gasoline')}
            </Text>
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
            <FontAwesome5 name="gas-pump" size={40} color={isDark ? '#1A1A1A' : '#E0E0E0'} />
            <Text style={[styles.emptyText, { color: isDark ? '#333' : '#888' }]}>
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
            <Ionicons name="information-circle" size={22} color="#00C853" />
          </View>
          <View style={inlineStyles.inline2}>
            <Text style={[styles.infoTitle, { color: isDark ? '#fff' : '#000' }]}>
              {t('flex_calc.updated_calc_title')}
            </Text>
            <Text style={[styles.infoText, { color: isDark ? '#666' : '#555' }]}>
              {t('flex_calc.updated_calc_text_before')} <Text style={styles.infoHighlight}>75%</Text>{' '}
              {t('flex_calc.updated_calc_text_after')}
            </Text>
          </View>
        </View>

        <FuelEntryForm
          isDark={isDark}
          tipoCombustivel={tipoCombustivel}
          setTipoCombustivel={setTipoCombustivel}
          valorTotal={valorTotal}
          setValorTotal={setValorTotal}
          litros={litros}
          setLitros={setLitros}
          precoLitro={precoLitro}
          setPrecoLitro={setPrecoLitro}
          kmAtual={kmAtual}
          setKmAtual={setKmAtual}
          cidade={cidade}
          setCidade={setCidade}
          estadoUf={estadoUf}
          setEstadoUf={setEstadoUf}
          observacao={observacao}
          setObservacao={setObservacao}
          tanqueCheio={tanqueCheio}
          setTanqueCheio={setTanqueCheio}
          registrarFinanceiro={registrarFinanceiro}
          setRegistrarFinanceiro={setRegistrarFinanceiro}
          elegivelEstatistica={elegivelStats}
          salvando={salvando}
          onSalvar={salvarAbastecimento}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
