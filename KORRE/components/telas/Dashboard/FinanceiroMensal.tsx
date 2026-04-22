import {
  Calendar,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTema } from '../../../hooks/modo_tema';

interface FinanceiroMensalProps {
  ganhos: number;
  gastos: number;
}

export const FinanceiroMensal: React.FC<
  FinanceiroMensalProps
> = ({ ganhos, gastos }) => {
  const lucro = ganhos - gastos;

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#222' : '#E0E0E0',
        },
      ]}
    >
      <View style={styles.header}>
        <Calendar size={20} color="#00C853" />
        <Text
          style={[
            styles.title,
            { color: isDark ? '#FFF' : '#000' },
          ]}
        >
          RESUMO DO MÊS
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.labelContainer}>
            <TrendingUp size={14} color="#00C853" />
            <Text
              style={[
                styles.label,
                { color: isDark ? '#888' : '#555' },
              ]}
            >
              GANHOS
            </Text>
          </View>
          <Text
            style={[styles.value, { color: '#00C853' }]}
          >
            R${' '}
            {ganhos.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.column}>
          <View style={styles.labelContainer}>
            <TrendingDown size={14} color="#F44336" />
            <Text
              style={[
                styles.label,
                { color: isDark ? '#888' : '#555' },
              ]}
            >
              GASTOS
            </Text>
          </View>
          <Text
            style={[styles.value, { color: '#F44336' }]}
          >
            R${' '}
            {gastos.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: isDark ? '#222' : '#E0E0E0' },
        ]}
      />

      <View
        style={[
          styles.lucroContainer,
          {
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.2)'
              : '#F5F5F5',
            borderColor: isDark ? '#222' : '#E0E0E0',
          },
        ]}
      >
        <View style={styles.labelContainer}>
          <Wallet
            size={16}
            color={lucro >= 0 ? '#00C853' : '#F44336'}
          />
          <Text
            style={[
              styles.labelLucro,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            LUCRO LÍQUIDO
          </Text>
        </View>
        <Text
          style={[
            styles.valueLucro,
            { color: lucro >= 0 ? '#00C853' : '#F44336' },
          ]}
        >
          R${' '}
          {lucro.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161616',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: { flex: 1 },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  label: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: { fontSize: 16, fontWeight: 'bold' },
  divider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 16,
  },
  lucroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  labelLucro: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  valueLucro: { fontSize: 20, fontWeight: '900' },
});
