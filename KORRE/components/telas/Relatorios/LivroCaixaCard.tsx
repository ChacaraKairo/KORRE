import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/telas/Relatorios/carneLeaoStyles';

interface Props {
  dadosFiscais: {
    faturamentoBruto: number;
    despesasDedutiveis: number;
    baseCalculo: number;
    aliquota: number;
  };
}

export function LivroCaixaCard({ dadosFiscais }: Props) {
  return (
    <View style={styles.livroCaixaCard}>
      <View style={styles.livroCaixaHeader}>
        <Text style={styles.livroCaixaTitle}>
          Cálculo Livro Caixa
        </Text>
        <Ionicons
          name="calculator"
          size={18}
          color="#444"
        />
      </View>

      {/* Rendimentos Brutos */}
      <View style={styles.livroCaixaRow}>
        <View>
          <Text style={styles.livroCaixaRowLabel}>
            Rendimentos Brutos
          </Text>
          <Text style={styles.livroCaixaRowValue}>
            R$ {dadosFiscais.faturamentoBruto.toFixed(2)}
          </Text>
        </View>
        <Ionicons
          name="trending-up"
          size={24}
          color="rgba(0,200,83,0.2)"
        />
      </View>

      {/* Despesas */}
      <View style={styles.livroCaixaRow}>
        <View>
          <Text style={styles.livroCaixaRowLabel}>
            Despesas Abatidas (-)
          </Text>
          <Text
            style={[
              styles.livroCaixaRowValue,
              { color: '#EF4444' },
            ]}
          >
            R$ {dadosFiscais.despesasDedutiveis.toFixed(2)}
          </Text>
        </View>
        <Ionicons
          name="trending-down"
          size={24}
          color="rgba(239,68,68,0.2)"
        />
      </View>

      <View style={styles.divider} />

      {/* Base de Cálculo */}
      <View style={styles.livroCaixaRow}>
        <View>
          <Text
            style={[
              styles.livroCaixaRowLabel,
              { color: '#2196F3' },
            ]}
          >
            Base de Cálculo Final
          </Text>
          <Text
            style={[
              styles.livroCaixaRowValue,
              { fontSize: 20 },
            ]}
          >
            R$ {dadosFiscais.baseCalculo.toFixed(2)}
          </Text>
        </View>
        <View style={styles.aliquotaBadge}>
          <Text style={styles.aliquotaText}>
            {dadosFiscais.aliquota}% IRPF
          </Text>
        </View>
      </View>
    </View>
  );
}
