import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ArrowLeft,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Historico/historicoStyles';
import { safeBack } from '../../../utils/navigation/safeBack';

import { localStyles } from '../../../styles/generated/components/telas/historico/HeaderHistoricoStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/historico/HeaderHistoricoInlineStyles';
interface HeaderHistoricoProps {
  getLabelData: () => string;
  navegarData: (direcao: number) => void;
  onOpenFilter: () => void;
  // Novas props para controlar o tipo de período
  periodoAtual: 'dia' | 'semana' | 'mes' | 'personalizado';
  onMudarPeriodo: (
    novoPeriodo: 'dia' | 'semana' | 'mes',
  ) => void;
}

/**
 * Executa a função de header historico.
 */
export function HeaderHistorico({
  getLabelData,
  navegarData,
  onOpenFilter,
  periodoAtual,
  onMudarPeriodo,
}: HeaderHistoricoProps) {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#888' : '#666';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';

  const periodos: ('dia' | 'semana' | 'mes')[] = [
    'dia',
    'semana',
    'mes',
  ];

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
          paddingBottom: 15, // Espaço extra para o novo seletor
        },
      ]}
    >
      {/* 1. TOPO: Voltar, Título e Filtro */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={[
            styles.btnIcon,
            { backgroundColor: cardColor, borderColor },
          ]}
          onPress={() => safeBack(router)}
        >
          <ArrowLeft size={20} color={textMuted} />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: textColor }]}
        >
          Histórico
        </Text>

        <TouchableOpacity
          style={[
            styles.btnIcon,
            { backgroundColor: cardColor, borderColor },
          ]}
          onPress={onOpenFilter}
        >
          <Filter size={20} color={textMuted} />
        </TouchableOpacity>
      </View>

      {/* 2. NOVO: Seletor de Tipo (Dia, Semana, Mês) */}
      <View
        style={[
          localStyles.segmentedContainer,
          { backgroundColor: isDark ? '#111' : '#EEE' },
        ]}
      >
        {periodos.map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => onMudarPeriodo(p)}
            style={[
              localStyles.segmentButton,
              periodoAtual === p && {
                backgroundColor: '#00C853',
              },
            ]}
          >
            <Text
              style={[
                localStyles.segmentText,
                {
                  color:
                    periodoAtual === p
                      ? '#0A0A0A'
                      : textMuted,
                },
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. BARRA DE DATA: Navegação (ChevronLeft, Data, ChevronRight) */}
      <View
        style={[
          styles.navDataContainer,
          {
            backgroundColor: cardColor,
            borderColor,
            marginTop: 15,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navegarData(-1)}
          style={inlineStyles.inline1}
        >
          <ChevronLeft size={20} color={textMuted} />
        </TouchableOpacity>

        <View style={styles.navDataCentro}>
          <CalendarDays size={16} color="#00C853" />
          <Text
            style={[
              styles.navDataTexto,
              { color: textColor },
            ]}
          >
            {getLabelData()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navegarData(1)}
          style={inlineStyles.inline2}
        >
          <ChevronRight size={20} color={textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


