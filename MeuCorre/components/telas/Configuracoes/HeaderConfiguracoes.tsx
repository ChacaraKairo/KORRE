// src/components/telas/Configuracoes/HeaderConfiguracoes.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../../styles/telas/Configuracoes/configuracoesStyles';

interface Props {
  isDark: boolean;
  cardColor: string;
  borderColor: string;
}

export const HeaderConfiguracoes = ({ isDark, cardColor, borderColor }: Props) => {
  const router = useRouter();
  return (
    <View style={[styles.header, { borderBottomColor: isDark ? '#161616' : '#EAEAEA' }]}>
      <TouchableOpacity
        style={[styles.btnVoltar, { backgroundColor: cardColor, borderColor }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color={isDark ? '#FFF' : '#1A1A1A'} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>AJUSTES</Text>
      <View style={{ width: 36 }} />
    </View>
  );
};