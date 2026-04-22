import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';

export const HeaderPerfil = () => {
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
        Central de Comando
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
