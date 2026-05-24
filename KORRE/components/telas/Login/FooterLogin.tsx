// Arquivo: src/components/telas/Login/FooterLogin.tsx
// Componente: FooterLogin

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { styles } from '../../../styles/telas/login/components/FooterLoginStyles';

/**
 * Executa a função de footer login.
 */
export const FooterLogin: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {t('login.footer')}
      </Text>
    </View>
  );
};
