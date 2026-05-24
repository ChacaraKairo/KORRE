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
      </View>

      <View>
        <View
          style={inlineStyles.inline2}
        >
          <Text
            style={dynamicInlineStyles.inline2({ isDark })}
          >
            Desgaste Atual
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
            Realizada
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
