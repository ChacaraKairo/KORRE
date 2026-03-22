import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Calculator,
  MapPin,
  Clock,
  ChevronRight,
  HelpCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../../hooks/modo_tema';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={[
              styles.badge,
              { backgroundColor: 'rgba(0, 200, 83, 0.1)' },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: '#00C853' },
              ]}
            >
              Meu Custo Base
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              const exKm = 8;
              const exMin = 15;
              const calcKm = (custoPorKm * exKm)
                .toFixed(2)
                .replace('.', ',');
              const calcMin = (custoPorMinuto * exMin)
                .toFixed(2)
                .replace('.', ',');
              const calcTotal = (
                custoPorKm * exKm +
                custoPorMinuto * exMin
              )
                .toFixed(2)
                .replace('.', ',');

              showCustomAlert(
                'Como calcular o custo da corrida?',
                `A conta para saberes o teu custo numa viagem é simples:\n\n1️⃣ Multiplica o "Custo / KM" pela distância total da viagem.\n2️⃣ Multiplica o "Custo / Min" pelo tempo estimado.\n3️⃣ Soma os dois resultados!\n\nExemplo para uma corrida de 8km e 15min:\n• ${exKm}km x R$ ${custoPorKm.toFixed(2).replace('.', ',')} = R$ ${calcKm}\n• ${exMin}min x R$ ${custoPorMinuto.toFixed(2).replace('.', ',')} = R$ ${calcMin}\n• Custo Total: R$ ${calcTotal}\n\nPronto! Para teres lucro de verdade nesta corrida, o aplicativo tem de te pagar um valor MAIOR do que R$ ${calcTotal}.`,
              );
            }}
          >
            <HelpCircle size={20} color={textMuted} />
          </TouchableOpacity>
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
