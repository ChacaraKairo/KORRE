import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Target } from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Historico/historicoStyles';

interface ResumoGraficoProps {
  dados: {
    ganhos: number;
    gastos: number;
    saldo: number;
  };
}

export function ResumoGrafico({
  dados,
}: ResumoGraficoProps) {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  const maxVal = Math.max(dados.ganhos, dados.gastos);
  const hGanhos =
    maxVal > 0 ? (dados.ganhos / maxVal) * 100 : 0;
  const hGastos =
    maxVal > 0 ? (dados.gastos / maxVal) * 100 : 0;

  return (
    <View
      style={[
        styles.chartCard,
        {
          backgroundColor: cardColor,
          borderColor,
          minHeight: 320, // Aumenta o tamanho total do container
          paddingVertical: 20, // Espaçamento interno em cima e embaixo
        },
      ]}
    >
      {/* Título com margem inferior aumentada */}
      <View
        style={[
          styles.chartTitleContainer,
          { marginBottom: 35 },
        ]}
      >
        <BarChart3 size={18} color="#00C853" />
        <Text
          style={[styles.chartTitle, { color: textMuted }]}
        >
          Análise Comparativa
        </Text>
      </View>

      {/* Container das barras com margem superior para descer os gráficos */}
      <View
        style={[
          styles.chartBarrasContainer,
          { marginTop: 15, marginBottom: 25 },
        ]}
      >
        <View style={styles.barraWrapper}>
          <Text
            style={[
              styles.barraValorFlutuante,
              { color: '#00C853' },
            ]}
          >
            R${dados.ganhos.toFixed(0)}
          </Text>
          <View
            style={[
              styles.barraFundo,
              { backgroundColor: 'rgba(0, 200, 83, 0.1)' },
            ]}
          >
            <View
              style={[
                styles.barraPreenchimento,
                {
                  height: `${hGanhos}%`,
                  backgroundColor: '#00C853',
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.barraLabel,
              { color: textColor },
            ]}
          >
            Ganhos
          </Text>
        </View>

        <View style={styles.barraWrapper}>
          <Text
            style={[
              styles.barraValorFlutuante,
              { color: '#EF4444' },
            ]}
          >
            R${dados.gastos.toFixed(0)}
          </Text>
          <View
            style={[
              styles.barraFundo,
              { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
            ]}
          >
            <View
              style={[
                styles.barraPreenchimento,
                {
                  height: `${hGastos}%`,
                  backgroundColor: '#EF4444',
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.barraLabel,
              { color: textColor },
            ]}
          >
            Gastos
          </Text>
        </View>
      </View>

      {/* Rodapé com Saldo */}
      <View style={[styles.saldoCard, { marginTop: 10 }]}>
        <View>
          <Text style={styles.saldoLabel}>
            Saldo Líquido
          </Text>
          <Text style={styles.saldoValor}>
            R$ {dados.saldo.toFixed(2)}
          </Text>
        </View>
        <View style={styles.saldoIconBox}>
          <Target
            size={28}
            color="#0A0A0A"
            strokeWidth={2.5}
          />
        </View>
      </View>
    </View>
  );
}
