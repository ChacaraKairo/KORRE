// Arquivo: src/components/telas/Login/FooterLogin.tsx
// Componente: FooterLogin

import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../../styles/telas/login/components/FooterLoginStyles';

export const FooterLogin: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        MeuCorre v1.0 • Dados Protegidos Localmente
      </Text>
    </View>
  );
};
