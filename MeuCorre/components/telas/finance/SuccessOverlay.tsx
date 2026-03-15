import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { financeStyles as styles } from '../../../styles/telas/Finance/financeStyles';

interface SuccessOverlayProps {
  mainColor: string;
}

export const SuccessOverlay = ({
  mainColor,
}: SuccessOverlayProps) => (
  <View style={styles.overlayContainer}>
    <View
      style={[
        styles.successIconBg,
        {
          backgroundColor: mainColor,
          shadowColor: mainColor,
        },
      ]}
    >
      <Check size={48} color="white" strokeWidth={4} />
    </View>
    <Text style={styles.successTitle}>ANOTAÇÃO FEITA!</Text>
    <Text style={styles.successSubtitle}>
      Atualizando seu lucro...
    </Text>
  </View>
);
