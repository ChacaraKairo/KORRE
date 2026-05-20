import React from 'react';
import { useRouter } from 'expo-router';
import { Plus, Target, TrendingUp } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTema } from '../../../hooks/modo_tema';

import { styles } from '../../../styles/generated/components/telas/Dashboard/GanhosCardStyles';

interface GanhosProps {
  ganhosTotal: number;
  metaValor: number;
  tipoMeta: 'diaria' | 'semanal';
  qtdGanhos?: number;
}

export const GanhosCard: React.FC<GanhosProps> = ({
  ganhosTotal = 0,
  metaValor = 0,
  tipoMeta = 'diaria',
  qtdGanhos = 0,
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const safeGanhos = ganhosTotal || 0;
  const safeMeta = metaValor || 0;
  const metaRestante = safeMeta - safeGanhos;
  const porcentagem =
    safeMeta > 0
      ? Math.min((safeGanhos / safeMeta) * 100, 100)
      : 0;

  const labelPeriodo =
    tipoMeta === 'diaria'
      ? t('dashboard.hoje')
      : t('dashboard.da_semana');
  const labelFaltante =
    tipoMeta === 'diaria'
      ? t('dashboard.p_meta_diaria')
      : t('dashboard.p_meta_semanal');

  return (
    <TouchableOpacity
      style={[
        styles.cardGanhos,
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
            initialType: 'ganho',
            ts: String(Date.now()),
          },
        } as any)
      }
    >
      <View style={styles.rowBetween}>
        <View style={styles.iconRow}>
          <View style={styles.iconeGanhoBg}>
            <TrendingUp size={28} color="#00C853" />
          </View>

          <View style={styles.btnPlusSmall}>
            <Plus size={20} color="#0A0A0A" />
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaLabelRow}>
            <Target
              size={12}
              color={metaRestante <= 0 ? '#00C853' : '#666'}
            />
            <Text
              style={[
                styles.labelMeta,
                { color: isDark ? '#666' : '#888' },
              ]}
            >
              {metaRestante <= 0
                ? t('dashboard.meta_batida')
                : t('dashboard.faltam_meta', {
                    meta: labelFaltante,
                  })}
            </Text>
          </View>

          <Text
            style={[
              styles.valorMetaRestante,
              { color: isDark ? '#FFF' : '#000' },
              metaRestante <= 0 && { color: '#00C853' },
            ]}
          >
            {metaRestante <= 0
              ? t('dashboard.so_lucro')
              : `R$ ${Math.abs(metaRestante).toFixed(2)}`}
          </Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <Text
          style={[
            styles.labelGanhosHoje,
            { color: isDark ? '#666' : '#888' },
          ]}
        >
          {t('dashboard.ganhos_periodo', {
            periodo: labelPeriodo,
          })}{' '}
          {qtdGanhos > 0
            ? t('dashboard.registros_count', {
                count: qtdGanhos,
              })
            : ''}
        </Text>
        <Text
          style={[
            styles.valorGanhosBig,
            { color: isDark ? '#FFF' : '#000' },
          ]}
        >
          R${' '}
          {safeGanhos.toLocaleString(i18n.language, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      <View
        style={[
          styles.barraProgressoBg,
          { backgroundColor: isDark ? '#222' : '#E0E0E0' },
        ]}
      >
        <View
          style={[
            styles.barraProgressoFill,
            {
              width: `${porcentagem}%`,
              backgroundColor:
                porcentagem >= 100 ? '#00C853' : '#00E676',
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.porcentagemTexto,
          { color: isDark ? '#444' : '#888' },
        ]}
      >
        {t('dashboard.porcentagem_meta', {
          percent: porcentagem.toFixed(0),
        })}
      </Text>
    </TouchableOpacity>
  );
};
