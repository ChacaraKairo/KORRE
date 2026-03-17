import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { financeStyles as styles } from '../../../styles/telas/Finance/financeStyles';

interface FinanceHeaderProps {
  tipo: string;
  mainColor: string;
  onCancel: () => void;
}

export const FinanceHeader = ({
  tipo,
  mainColor,
  onCancel,
}: FinanceHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        Anotar{' '}
        <Text style={{ color: mainColor }}>
          {tipo === 'ganho' ? 'Ganho' : 'Despesa'}
        </Text>
      </Text>
      <TouchableOpacity
        onPress={() => router.back()} // Volta para o Dashboard
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};
