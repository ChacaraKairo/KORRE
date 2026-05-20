import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Fuel, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useTema } from '../../../hooks/modo_tema';

export const FooterCalculadora = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <View
      style={[
        styles.footerFixo,
        {
          backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
          borderTopColor: isDark ? '#222' : '#E0E0E0',
          borderTopWidth: 1,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.btnCalculadora}
        onPress={onPress}
      >
        <Fuel size={24} color="#0A0A0A" />
        <Text style={styles.btnCalculadoraTexto}>
          {t('dashboard.calculadora_flex')}
        </Text>
        <ChevronRight size={20} color="#0A0A0A" />
      </TouchableOpacity>
    </View>
  );
};
