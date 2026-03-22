import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Calculator,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Dashboard/indicesMCCardStyles';

interface Props {
  custoPorKm: number;
  custoPorMinuto: number;
}

export const IndicesMCCard = ({
  custoPorKm,
  custoPorMinuto,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  // Cores dinâmicas
  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#666' : '#888';
  const boxBg = isDark ? '#0A0A0A' : '#F5F5F5';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      // Roteamento para a tela de parâmetros que vamos construir a seguir
      onPress={() => router.push('/calculadora_mc')}
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
      ]}
    >
      {/* Cabeçalho do Card */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: 'rgba(0, 200, 83, 0.1)' },
            ]}
          >
            <Calculator size={18} color="#00C853" />
          </View>
          <Text
            style={[styles.title, { color: textColor }]}
          >
            Índices MC
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: 'rgba(0, 200, 83, 0.1)' },
          ]}
        >
          <Text
            style={[styles.badgeText, { color: '#00C853' }]}
          >
            Meu Custo Base
          </Text>
        </View>
      </View>

      {/* Valores em Destaque */}
      <View style={styles.indicesRow}>
        {/* Custo por KM */}
        <View
          style={[
            styles.indiceBox,
            {
              backgroundColor: boxBg,
              borderColor: borderColor,
            },
          ]}
        >
          <View style={styles.indiceHeader}>
            <MapPin size={14} color={textMuted} />
            <Text
              style={[
                styles.indiceLabel,
                { color: textMuted },
              ]}
            >
              Custo / KM
            </Text>
          </View>
          <Text
            style={[
              styles.indiceValue,
              { color: '#00C853' },
            ]}
          >
            R$ {custoPorKm.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {/* Custo por Minuto */}
        <View
          style={[
            styles.indiceBox,
            {
              backgroundColor: boxBg,
              borderColor: borderColor,
            },
          ]}
        >
          <View style={styles.indiceHeader}>
            <Clock size={14} color={textMuted} />
            <Text
              style={[
                styles.indiceLabel,
                { color: textMuted },
              ]}
            >
              Custo / Min
            </Text>
          </View>
          <Text
            style={[
              styles.indiceValue,
              { color: '#00C853' },
            ]}
          >
            R$ {custoPorMinuto.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      {/* Dica de Clique para Editar */}
      <View style={styles.clickHint}>
        <Text
          style={[
            styles.clickHintText,
            { color: textMuted },
          ]}
        >
          Atualizar Parâmetros
        </Text>
        <ChevronRight size={14} color={textMuted} />
      </View>
    </TouchableOpacity>
  );
};
