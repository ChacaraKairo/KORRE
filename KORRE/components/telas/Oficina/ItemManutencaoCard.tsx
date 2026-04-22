import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  const { tema } = useTema();
  const isDark = tema === 'escuro';

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
              Ciclo:{' '}
              {[
                item.intervalo_km
                  ? `${item.intervalo_km} km`
                  : null,
                item.intervalo_meses
                  ? `${item.intervalo_meses} meses`
                  : null,
              ]
                .filter(Boolean)
                .join(' ou ')}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: `${info.cor}15`,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: `${info.cor}30`,
          }}
        >
          <Text
            style={{
              color: info.cor,
              fontSize: 8,
              fontWeight: '900',
              textTransform: 'uppercase',
            }}
          >
            {info.status}
          </Text>
        </View>
      </View>

      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text
            style={{
              color: isDark ? '#666' : '#888',
              fontSize: 10,
              fontWeight: '900',
              textTransform: 'uppercase',
            }}
          >
            Desgaste Atual
          </Text>
          <Text
            style={{
              color: info.cor,
              fontSize: 12,
              fontWeight: '900',
            }}
          >
            {info.infoTexto}
          </Text>
        </View>
        <View style={styles.barraBg}>
          <View
            style={{
              height: '100%',
              width: `${info.percentagemDesgaste}%`,
              backgroundColor: info.cor,
            }}
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
            style={{
              color: isDark ? '#888' : '#555',
              fontSize: 10,
              fontWeight: '900',
              textTransform: 'uppercase',
            }}
          >
            Realizada
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
