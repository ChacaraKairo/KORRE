import React from 'react';
import {
  Calendar,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTema } from '../../../hooks/modo_tema';

import { styles } from '../../../styles/generated/components/telas/Dashboard/FinanceiroMensalStyles';

interface FinanceiroMensalProps {
  ganhos: number;
  gastos: number;
}

export const FinanceiroMensal: React.FC<
  FinanceiroMensalProps
> = ({ ganhos, gastos }) => {
  const { t, i18n } = useTranslation();
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
          {t('dashboard.resumo_mes')}
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
              {t('dashboard.ganhos')}
            </Text>
          </View>
          <Text style={[styles.value, { color: '#00C853' }]}>
            R${' '}
            {ganhos.toLocaleString(i18n.language, {
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
              {t('dashboard.gastos')}
            </Text>
          </View>
          <Text style={[styles.value, { color: '#F44336' }]}>
            R${' '}
            {gastos.toLocaleString(i18n.language, {
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
            {t('dashboard.lucro_liquido')}
          </Text>
        </View>
        <Text
          style={[
            styles.valueLucro,
            { color: lucro >= 0 ? '#00C853' : '#F44336' },
          ]}
        >
          R${' '}
          {lucro.toLocaleString(i18n.language, {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>
    </View>
  );
};
