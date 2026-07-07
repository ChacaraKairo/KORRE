import {
  useRouter } from 'expo-router';
import {
  Calculator,
  ChevronRight,
  Clock,
  HelpCircle,
  MapPin,
  MessageCircle,
  Target,
  TrendingUp,
  } from 'lucide-react-native';
import React from 'react';
import {
    Linking,
    Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COMPANY_CONTACTS } from '../../../config/companyContacts';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';
import { useTema } from '../../../hooks/modo_tema';
import { styles as baseStyles } from '../../../styles/telas/Dashboard/indicesMCCardStyles';

import { styles } from '../../../styles/generated/components/telas/Dashboard/IndicesKORREStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/Dashboard/IndicesKORREInlineStyles';
interface Props {
  custoPorKm: number;
  custoPorMinuto: number;
  metaPorMinuto: number;
}

export const IndicesMCCard = ({
  custoPorKm,
  custoPorMinuto,
  metaPorMinuto,
}: Props) => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  // Cores dinâmicas
  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#666' : '#888';
  const boxBg = isDark ? '#0A0A0A' : '#F5F5F5';

  // Cálculo do Faturamento Ideal por Hora
  const metaPorHora = metaPorMinuto * 60;
  const handleAjuda = () => {
    const exKm = 8;
    const exMin = 15;

    const calcKmCusto = custoPorKm * exKm;
    const calcMinCusto = custoPorMinuto * exMin;
    const custoTotal = calcKmCusto + calcMinCusto;

    const calcMinMeta = metaPorMinuto * exMin;
    const metaTotal = calcKmCusto + calcMinMeta;

    showCustomAlert(
      t('dashboard.indices_ajuda_titulo'),
      `O sistema separa CUSTO de LUCRO.\n\n` +
        `Faturamento Ideal por Hora: R$ ${metaPorHora.toFixed(2)}\n\n` +
        `Exemplo para corrida de ${exKm}km e ${exMin}min:\n\n` +
        `🔴 CUSTO (Zero a Zero):\n` +
        `• ${exKm}km x R$ ${custoPorKm.toFixed(2)} = R$ ${calcKmCusto.toFixed(2)}\n` +
        `• ${exMin}min x R$ ${custoPorMinuto.toFixed(2)} = R$ ${calcMinCusto.toFixed(2)}\n` +
        `Custo Real: R$ ${custoTotal.toFixed(2)}\n\n` +
        `🟢 META (Dinheiro no Bolso):\n` +
        `• Custo de Rodagem (R$ ${calcKmCusto.toFixed(2)})\n` +
        `• + Tempo & Lucro (${exMin}min x R$ ${metaPorMinuto.toFixed(2)} = R$ ${calcMinMeta.toFixed(2)})\n` +
        `Faturamento Ideal: R$ ${metaTotal.toFixed(2)}\n\n` +
        `Resumo: Se pagar menos de R$ ${custoTotal.toFixed(2)}, você PAGA para trabalhar. O ideal é focar na sua Meta/Hora.`,
    );
  };
  const handleApoioComunidade = () => {
    Linking.openURL(
      COMPANY_CONTACTS.support.vehicleCommunitySupportUrl,
    ).catch(() => {
      showCustomAlert(
        t('common.erro'),
        t('links.vehicle_community_error'),
      );
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push('/calculadora_korre')}
      style={[
        baseStyles.card,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          padding: 16, // Garantindo um bom respiro geral
        },
      ]}
    >
      {/* Cabeçalho do Card */}
      <View style={baseStyles.header}>
        <View style={baseStyles.headerLeft}>
          <View
            style={[
              baseStyles.iconBox,
              { backgroundColor: 'rgba(0, 200, 83, 0.1)' },
            ]}
          >
            <Calculator size={18} color="#00C853" />
          </View>
          <Text
            style={[baseStyles.title, { color: textColor }]}
          >
            {t('dashboard.indices_magicos')}
          </Text>
        </View>
        <View
          style={inlineStyles.inline1}
        >
          <View
            style={[
              baseStyles.badge,
              { backgroundColor: 'rgba(0, 200, 83, 0.1)' },
            ]}
          >
            <Text
              style={[
                baseStyles.badgeText,
                { color: '#00C853' },
              ]}
            >
              {t('dashboard.ativo')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAjuda}
            style={inlineStyles.inline2}
          >
            <HelpCircle size={20} color={textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Valores em Destaque - As 3 colunas base ajustadas */}
      <View style={styles.trindadeRow}>
        {/* 1. Custo por KM */}
        <View
          style={[
            styles.indiceBoxTrindade,
            { backgroundColor: boxBg, borderColor },
          ]}
        >
          <MapPin size={14} color={textMuted} />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.labelTrindade,
              { color: textMuted },
            ]}
          >
            IKM (Mov.)
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.valueTrindade,
              { color: textColor },
            ]}
          >
            R$ {custoPorKm.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {/* 2. Custo por Minuto */}
        <View
          style={[
            styles.indiceBoxTrindade,
            { backgroundColor: boxBg, borderColor },
          ]}
        >
          <Clock size={14} color={textMuted} />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.labelTrindade,
              { color: textMuted },
            ]}
          >
            IMIN (Par.)
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.valueTrindade,
              { color: textColor },
            ]}
          >
            R$ {custoPorMinuto.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {/* 3. Meta por Minuto (DESTAQUE) */}
        <View
          style={[
            styles.indiceBoxTrindade,
            {
              backgroundColor: 'rgba(0, 200, 83, 0.05)',
              borderColor: '#00C853',
            },
          ]}
        >
          <Target size={14} color="#00C853" />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.labelTrindade,
              { color: '#00C853', fontWeight: 'bold' },
            ]}
          >
            {t('dashboard.meta_min')}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.valueTrindade,
              { color: '#00C853', fontWeight: '900' },
            ]}
          >
            R$ {metaPorMinuto.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      {/* 4. Faturamento Ideal por Hora (Destaque Largo) */}
      <View
        style={[
          styles.hourlyBox,
          {
            backgroundColor: 'rgba(0, 200, 83, 0.05)',
            borderColor: '#00C853',
          },
        ]}
      >
        <View
          style={inlineStyles.inline3}
        >
          <TrendingUp size={20} color="#00C853" />
          <Text
            numberOfLines={2} // Permite quebrar em duas linhas se a tela for minúscula
            style={[
              baseStyles.indiceLabel,
              {
                color: '#00C853',
                fontSize: 13,
                fontWeight: 'bold',
                flexShrink: 1,
              },
            ]}
          >
            {t('dashboard.faturamento_ideal_hora')}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            baseStyles.indiceValue,
            {
              color: '#00C853',
              fontSize: 22,
              fontWeight: '900',
              marginLeft: 8,
            },
          ]}
        >
          R$ {metaPorHora.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.82}
        onPress={(event) => {
          event.stopPropagation();
          handleApoioComunidade();
        }}
        style={[
          baseStyles.communitySupport,
          {
            backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
            borderColor: '#00C853',
          },
        ]}
      >
        <View style={baseStyles.communitySupportIcon}>
          <MessageCircle size={18} color="#00C853" />
        </View>
        <View style={baseStyles.communitySupportCopy}>
          <Text
            style={[
              baseStyles.communitySupportTitle,
              { color: textColor },
            ]}
            numberOfLines={1}
          >
            {t('links.vehicle_community_title')}
          </Text>
          <Text
            style={[
              baseStyles.communitySupportSubtitle,
              { color: textMuted },
            ]}
            numberOfLines={2}
          >
            {t('links.vehicle_community_subtitle')}
          </Text>
        </View>
        <ChevronRight size={16} color="#00C853" />
      </TouchableOpacity>

      {/* Dica de Clique para Editar */}
      <View style={baseStyles.clickHint}>
        <Text
          style={[
            baseStyles.clickHintText,
            { color: textMuted },
          ]}
        >
          {t('dashboard.refazer_auditoria')}
        </Text>
        <ChevronRight size={14} color={textMuted} />
      </View>
    </TouchableOpacity>
  );
};
