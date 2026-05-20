import React from 'react';
import { useRouter } from 'expo-router';
import { Plus, TrendingDown } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTema } from '../../../hooks/modo_tema';

import { styles } from '../../../styles/generated/components/telas/Dashboard/GastosCardStyles';

interface GastosProps {
  valor: number;
  qtdGastos?: number;
  tipoMeta?: 'diaria' | 'semanal';
}

export const GastosCard: React.FC<GastosProps> = ({
  valor,
  qtdGastos = 0,
  tipoMeta = 'diaria',
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#222' : '#E0E0E0',
        },
      ]}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/finance',
          params: {
            initialType: 'despesa',
            ts: String(Date.now()),
          },
        } as any)
      }
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <TrendingDown size={28} color="#F44336" />
          </View>

          <View style={styles.plusBtn}>
            <Plus size={20} color="white" />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            { color: isDark ? '#666' : '#888' },
          ]}
        >
          {tipoMeta === 'semanal'
            ? t('dashboard.gastos_da_semana')
            : t('dashboard.gastos_de_hoje')}{' '}
          {qtdGastos > 0
            ? t('dashboard.registros_count', {
                count: qtdGastos,
              })
            : ''}
        </Text>
        <Text
          style={[
            styles.value,
            { color: isDark ? '#FFF' : '#000' },
          ]}
        >
          R${' '}
          {valor.toLocaleString(i18n.language, {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
