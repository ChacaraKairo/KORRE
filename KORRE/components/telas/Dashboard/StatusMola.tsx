// components/telas/Dashboard/StatusMola.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useEficiencia } from '../../../hooks/dashboard/useEficiencia';

interface StatusMolaProps {
  ganhos: number;
  gastos: number;
  meta: number;
}

export const StatusMola: React.FC<StatusMolaProps> = ({
  ganhos,
  gastos,
  meta,
}) => {
  const {
    lucroReal,
    progressoMeta,
    percentualTexto,
    status,
  } = useEficiencia(ganhos, gastos, 0, meta);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Progresso da Meta</Text>
        <Text style={styles.value}>{percentualTexto}</Text>
      </View>

      {/* Barra de Progresso (Molecule) */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressoMeta * 100}%` },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.subLabel}>
          Lucro Real do Dia:
        </Text>
        <Text
          style={[
            styles.lucroValue,
            {
              color:
                status === 'lucro' ? '#10B981' : '#EF4444',
            },
          ]}
        >
          R$ {lucroReal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: { color: '#9CA3AF', fontSize: 14 },
  value: { color: '#FFF', fontWeight: 'bold' },
  progressBg: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subLabel: { color: '#9CA3AF' },
  lucroValue: { fontWeight: 'bold', fontSize: 16 },
});
