import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Gauge,
  Plus,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useTema } from '../../../hooks/modo_tema';

interface StatusProps {
  kmAtual: number;
  statusManutencao: 'critical' | 'warning' | 'ok';
  descManutencao: string;
  onUpdateKm: () => void;
  onOpenOficina: () => void;
}

export const StatusGrid: React.FC<StatusProps> = ({
  kmAtual,
  statusManutencao,
  descManutencao,
  onUpdateKm,
  onOpenOficina,
}) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Configuração dinâmica baseada no status
  const uiConfig = {
    critical: {
      icon: <AlertTriangle size={20} color="#FFF" />,
      label: 'Crítico',
    },
    warning: {
      icon: (
        <AlertCircle
          size={20}
          color={!isDark ? '#0A0A0A' : '#FFF'}
        />
      ),
      label: 'Atenção',
    },
    ok: {
      icon: <ShieldCheck size={20} color="#FFF" />,
      label: 'Em Dia',
    },
  };

  const UI = uiConfig[statusManutencao];

  return (
    <View style={styles.grid}>
      {/* Card Odómetro */}
      <TouchableOpacity
        style={[
          styles.cardMeio,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
          },
        ]}
        onPress={onUpdateKm}
        activeOpacity={0.8}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              padding: 8,
              backgroundColor: isDark
                ? '#202020'
                : '#F5F5F5',
              borderRadius: 12,
            }}
          >
            <Gauge size={20} color="#00C853" />
          </View>
          <View style={styles.btnPlusSmall}>
            <Plus size={20} color="#0A0A0A" />
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.labelMeta,
              { color: isDark ? '#666' : '#888' },
            ]}
          >
            KM ATUAL
          </Text>
          <Text
            style={[
              styles.valorDestaqueMeio,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            {kmAtual.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Card Manutenção */}
      <TouchableOpacity
        style={[
          styles.cardMeio,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
          },
          styles[`cardStatus_${statusManutencao}`],
          !isDark &&
            statusManutencao === 'warning' && {
              backgroundColor: '#FFC107', // Amarelo mais forte no Modo Claro
              borderColor: '#FFB300',
            },
        ]}
        onPress={onOpenOficina}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={[
              {
                padding: 8,
                backgroundColor: isDark
                  ? '#202020'
                  : '#F5F5F5',
                borderRadius: 12,
              },
              !isDark &&
                statusManutencao === 'warning' && {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)', // Fundo semi-transparente para destacar o ícone escuro
                },
            ]}
          >
            {UI.icon}
          </View>
          <ChevronRight
            size={18}
            color={
              !isDark && statusManutencao === 'warning'
                ? '#0A0A0A'
                : '#444'
            }
          />
        </View>
        <View>
          <Text
            style={[
              styles.labelMeta,
              styles[`textStatus_${statusManutencao}`],
              !isDark &&
                statusManutencao === 'warning' && {
                  color: '#0A0A0A', // Escrita escura no título
                },
            ]}
          >
            {UI.label}
          </Text>
          <Text
            style={[
              styles.descStatusMeio,
              { color: isDark ? '#888' : '#555' },
              !isDark &&
                statusManutencao === 'warning' && {
                  color: '#333333', // Escrita escura na descrição
                },
            ]}
            numberOfLines={1}
          >
            {descManutencao}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
