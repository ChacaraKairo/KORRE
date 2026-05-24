import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  RotateCcw,
  Droplets,
  CircleDot,
  Disc,
  Cog,
  Zap,
  Activity,
  Fuel,
  Wrench,
} from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Oficina/oficinaStyles';

import {
  inlineStyles,
  itemManutencaoCardDynamicStyles,
} from '../../../styles/generated-inline/components/telas/Oficina/ItemManutencaoCardInlineStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/Oficina/ItemManutencaoCardDynamicStyles';
export const IconeServico = ({
  id,
  color = '#00C853',
  size = 18,
}: {
  id: string;
  color?: string;
  size?: number;
}) => {
  switch (id) {
    case 'droplets':
      return <Droplets size={size} color={color} />;
    case 'circle-dot':
      return <CircleDot size={size} color={color} />;
    case 'disc':
      return <Disc size={size} color={color} />;
    case 'cog':
      return <Cog size={size} color={color} />;
    case 'zap':
      return <Zap size={size} color={color} />;
    case 'activity':
      return <Activity size={size} color={color} />;
    case 'fuel':
      return <Fuel size={size} color={color} />;
    default:
      return <Wrench size={size} color={color} />;
  }
};

interface Props {
  item: any;
  info: any;
  onResetPress: () => void;
}

export const ItemManutencaoCard = ({
  item,
  info,
  onResetPress,
}: Props) => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const isPlanejado =
    item.origem === 'auditoria_korre' &&
    Number(item.tem_historico_real ?? 0) === 0;
  const valorPrevisto = Number(item.valor_previsto ?? 0);

  return (
    <View
      style={[
        styles.itemCard,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#222' : '#E0E0E0',
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleInfo}>
          <View style={styles.itemIcon}>
            <IconeServico id={item.icone} />
          </View>
          <View>
            <Text
              style={[
                styles.itemNome,
                { color: isDark ? '#FFF' : '#000' },
              ]}
            >
              {item.nome}
            </Text>
            <Text
              style={[
                styles.itemCiclo,
                { color: isDark ? '#888' : '#555' },
              ]}
            >
              {item.isVirtual
                ? t('oficina.sugestao_adicionar')
                : isPlanejado
                  ? t('oficina.planejado_aguardando')
                  : `Ciclo: ${[
                    item.intervalo_km
                      ? `${item.intervalo_km} km`
                      : null,
                    item.intervalo_meses
                      ? `${item.intervalo_meses} meses`
                      : null,
                    ]
                      .filter(Boolean)
                      .join(' ou ')}`}
            </Text>
          </View>
        </View>
        {isPlanejado && (
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: isDark ? '#12301E' : '#E8F8EE',
            }}
          >
            <Text
              style={{
                color: '#00C853',
                fontSize: 11,
                fontWeight: '900',
              }}
            >
              {t('oficina.status_planejado')}
            </Text>
          </View>
        )}
        {!isPlanejado && (
          <View
            style={itemManutencaoCardDynamicStyles.statusBadge(
              info.cor,
            )}
          >
            <Text
              style={dynamicInlineStyles.inline1({ info })}
            >
              {info.status}
            </Text>
          </View>
        )}
      </View>

      {isPlanejado ? (
        <View
          style={{
            gap: 6,
            padding: 12,
            borderRadius: 12,
            backgroundColor: isDark ? '#0A0A0A' : '#F7FDF9',
            borderWidth: 1,
            borderColor: isDark ? '#1F3A2A' : '#CFF2DA',
          }}
        >
          <Text style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
            {t('oficina.aguardando_primeira_manutencao')}
          </Text>
          {valorPrevisto > 0 && (
            <Text style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
              {t('oficina.valor_previsto')}: R${' '}
              {valorPrevisto.toFixed(2).replace('.', ',')}
            </Text>
          )}
          {Number(item.intervalo_km ?? 0) > 0 && (
            <Text style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
              {t('oficina.intervalo_previsto')}: {item.intervalo_km} km
            </Text>
          )}
          <Text style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
            {t('oficina.origem_auditoria')}
          </Text>
        </View>
      ) : (
        <View>
          <View
            style={inlineStyles.inline2}
          >
            <Text
              style={dynamicInlineStyles.inline2({ isDark })}
            >
              {t('oficina.desgaste_atual')}
            </Text>
            <Text
              style={dynamicInlineStyles.inline3({ info })}
            >
              {info.infoTexto}
            </Text>
          </View>
          <View style={styles.barraBg}>
            <View
              style={dynamicInlineStyles.inline4({ info })}
            />
          </View>
        </View>
      )}

      <View style={styles.botoesAcao}>
        <TouchableOpacity
          style={[
            styles.btnAcaoSecundario,
            {
              backgroundColor: isDark
                ? '#0A0A0A'
                : '#F5F5F5',
              borderColor: isDark ? '#222' : '#E0E0E0',
            },
          ]}
          onPress={onResetPress}
        >
          <RotateCcw size={16} color="#00C853" />
          <Text
            style={dynamicInlineStyles.inline5({ isDark })}
          >
            {isPlanejado
              ? t('oficina.registrar_primeira_manutencao')
              : t('oficina.realizada')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
