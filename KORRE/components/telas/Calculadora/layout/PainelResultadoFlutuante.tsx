import {
  Clock,
  Gauge,
  TrendingUp,
} from 'lucide-react-native';
import React, { memo, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// IMPORTANTE: Importação da SSOT
import { useTema } from '../../../../hooks/modo_tema';
import { FormularioViabilidade } from '../../../../type/viabilidadeCorrida';
import { CalculadoraMovimento } from '../../../../utils/calculadoraKorreKM';
import { CalculadoraTempo } from '../../../../utils/calculadoraKorreTempo';

interface Props {
  form: Partial<FormularioViabilidade>; // Atualizado
  veiculoTipo: string;
}

export const PainelResultadoFlutuante = memo(
  ({ form, veiculoTipo }: Props) => {
    const { tema } = useTema();
    const isDark = tema === 'escuro';

    const resultados = useMemo(() => {
      try {
        const { ikm } =
          CalculadoraMovimento.calcularCustoKm(form as any);
        const { imin } =
          CalculadoraTempo.calcularCustoMinuto(form as any);
        return { ikm: ikm || 0, imin: imin || 0 };
      } catch (e) {
        return { ikm: 0, imin: 0 };
      }
    }, [form]);

    const bgColor = isDark ? '#121212' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
    const subTextColor = isDark ? '#AAA' : '#666';

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: bgColor },
        ]}
      >
        <View style={styles.content}>
          {/* Índice por KM (IKM) */}
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Gauge size={16} color="#00C853" />
            </View>
            <View>
              <Text
                style={[
                  styles.label,
                  { color: subTextColor },
                ]}
              >
                IKM (Custo KM)
              </Text>
              <Text
                style={[styles.value, { color: textColor }]}
              >
                R$ {resultados.ikm.toFixed(2)}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? '#333' : '#EEE' },
            ]}
          />

          {/* Índice por Minuto (IMIN) */}
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Clock size={16} color="#00C853" />
            </View>
            <View>
              <Text
                style={[
                  styles.label,
                  { color: subTextColor },
                ]}
              >
                IMIN (Custo Min)
              </Text>
              <Text
                style={[styles.value, { color: textColor }]}
              >
                R$ {resultados.imin.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.efficiencyBadge}>
            <TrendingUp size={14} color="#FFF" />
            <Text style={styles.efficiencyText}>LIVE</Text>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  // ... Mantenha exatamente os mesmos estilos que você já tinha no PainelResultadoFlutuante
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 20 },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: { fontSize: 18, fontWeight: '800' },
  divider: { width: 1, height: 30, marginHorizontal: 15 },
  efficiencyBadge: {
    backgroundColor: '#00C853',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  efficiencyText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
