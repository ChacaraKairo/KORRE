import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';

export default function MainCalculadoraFlex() {
  const [precoEtanol, setPrecoEtanol] = useState('');
  const [precoGasolina, setPrecoGasolina] = useState('');

  const calcularVantagem = () => {
    const alc = parseFloat(precoEtanol.replace(',', '.'));
    const gas = parseFloat(precoGasolina.replace(',', '.'));

    if (!alc || !gas || isNaN(alc) || isNaN(gas))
      return null;

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
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios' ? 'padding' : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* INPUTS */}
        <View style={styles.inputsSection}>
          {/* Etanol */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                { color: '#00C853' },
              ]}
            >
              Preço do Etanol (Litro)
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDark
                    ? '#161616'
                    : '#FFFFFF',
                  borderColor: isDark ? '#222' : '#E0E0E0',
                },
              ]}
            >
              <Text
                style={[
                  styles.inputPrefix,
                  { color: '#00C853' },
                ]}
              >
                R$
              </Text>
              <TextInput
                style={[styles.input, { color: '#00C853' }]}
                placeholder="0.00"
                placeholderTextColor="rgba(0,200,83,0.2)"
                keyboardType="decimal-pad"
                value={precoEtanol}
                onChangeText={setPrecoEtanol}
                selectionColor="#00C853"
              />
            </View>
          </View>

          {/* Gasolina */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                { color: '#EAB308' },
              ]}
            >
              Preço da Gasolina (Litro)
            </Text>
            <View
              style={[
                styles.inputWrapper,
                styles.inputWrapperGas,
                {
                  backgroundColor: isDark
                    ? '#161616'
                    : '#FFFFFF',
                  borderColor: isDark ? '#222' : '#E0E0E0',
                },
              ]}
            >
              <Text
                style={[
                  styles.inputPrefix,
                  { color: '#EAB308' },
                ]}
              >
                R$
              </Text>
              <TextInput
                style={[styles.input, { color: '#EAB308' }]}
                placeholder="0.00"
                placeholderTextColor="rgba(234,179,8,0.2)"
                keyboardType="decimal-pad"
                value={precoGasolina}
                onChangeText={setPrecoGasolina}
                selectionColor="#EAB308"
              />
            </View>
          </View>
        </View>

        {/* RESULTADO */}
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
              Ponto de Equilíbrio:
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
                ? 'Etanol'
                : 'Gasolina'}
            </Text>

            <View style={styles.resultDivider} />

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>
                  Rendimento
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
                  Limite Etanol
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
                backgroundColor: isDark
                  ? '#0A0A0A'
                  : '#FFFFFF',
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
              Insira os preços{'\n'}para o diagnóstico
            </Text>
          </View>
        )}

        {/* INFO BOX */}
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
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.infoTitle,
                { color: isDark ? '#fff' : '#000' },
              ]}
            >
              Cálculo Atualizado
            </Text>
            <Text
              style={[
                styles.infoText,
                { color: isDark ? '#666' : '#555' },
              ]}
            >
              O ponto de viragem agora é de{' '}
              <Text style={styles.infoHighlight}>75%</Text>.
              Se o álcool custar menos de 75% da gasolina,
              ele é financeiramente superior para motores
              modernos e para a nova mistura E30.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 24,
    gap: 32,
    paddingBottom: 48,
  },

  // INPUTS
  inputsSection: {
    gap: 28,
  },
  inputGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 20 : 12,
  },
  inputWrapperGas: {
    borderColor: '#222',
  },
  inputPrefix: {
    fontSize: 18,
    fontWeight: '900',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 36,
    fontWeight: '900',
    padding: 0,
  },

  // RESULT
  resultCard: {
    padding: 32,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
  },
  resultCardEtanol: {
    backgroundColor: 'rgba(0,200,83,0.05)',
    borderColor: 'rgba(0,200,83,0.3)',
  },
  resultCardGas: {
    backgroundColor: 'rgba(234,179,8,0.05)',
    borderColor: 'rgba(234,179,8,0.3)',
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
    marginBottom: 24,
  },
  resultDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  resultStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  resultStat: {
    alignItems: 'center',
    gap: 4,
  },
  resultStatLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultStatValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  resultVerticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // EMPTY
  emptyCard: {
    padding: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#222',
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 22,
  },

  // INFO BOX
  infoBox: {
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#161616',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  infoIconWrap: {
    padding: 10,
    backgroundColor: 'rgba(0,200,83,0.1)',
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
  infoHighlight: {
    color: '#00C853',
    fontWeight: '900',
  },
});
