// src/components/telas/Configuracoes/HeaderConfiguracoes.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { styles } from '../../../styles/telas/Configuracoes/configuracoesStyles';
import { safeBack } from '../../../utils/navigation/safeBack';

import { inlineStyles } from '../../../styles/generated-inline/components/telas/Configuracoes/HeaderConfiguracoesInlineStyles';
interface Props {
  isDark: boolean;
  cardColor: string;
  borderColor: string;
}

/**
 * Executa a função de header configuracoes.
 */
export const HeaderConfiguracoes = ({ isDark, cardColor, borderColor }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <View style={[styles.header, { borderBottomColor: isDark ? '#161616' : '#EAEAEA' }]}>
      <TouchableOpacity
        style={[styles.btnVoltar, { backgroundColor: cardColor, borderColor }]}
        onPress={() => safeBack(router)}
      >
        <ArrowLeft size={20} color={isDark ? '#FFF' : '#1A1A1A'} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {t('configuracoes.titulo')}
      </Text>
      <View style={inlineStyles.inline1} />
    </View>
  );
};
