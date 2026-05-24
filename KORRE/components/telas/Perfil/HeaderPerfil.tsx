import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';

/**
 * Executa a função de header perfil.
 */
export const HeaderPerfil = () => {
  const { t } = useTranslation();
  const { tema, toggleTema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <View style={styles.header}>
      <Text
        style={[
          styles.headerTitle,
          { color: isDark ? '#FFFFFF' : '#000000' },
        ]}
      >
        {t('perfil.central_comando')}
      </Text>
      <TouchableOpacity
        style={[
          styles.themeButton,
          !isDark && {
            backgroundColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            borderWidth: 1,
          },
        ]}
        onPress={toggleTema}
      >
        {tema === 'escuro' ? (
          <Sun size={20} color="#888" />
        ) : (
          <Moon size={20} color="#888" />
        )}
      </TouchableOpacity>
    </View>
  );
};
