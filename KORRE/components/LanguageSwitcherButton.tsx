import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react-native';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from '../locales/i18n';
import { ModalIdioma } from './telas/Configuracoes/ModalIdioma';

interface Props {
  style?: object;
}

/**
 * Executa a função de language switcher button.
 */
export const LanguageSwitcherButton = ({ style }: Props) => {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const activeLanguage =
    SUPPORTED_LANGUAGES.find(
      (language) =>
        language.code === normalizeLanguage(i18n.language),
    ) ?? SUPPORTED_LANGUAGES[0];

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={[styles.button, style]}
      >
        <Globe size={18} color="#00C853" />
        <Text style={styles.label}>
          {activeLanguage.code.toUpperCase()}
        </Text>
      </TouchableOpacity>

      <ModalIdioma
        visible={visible}
        onClose={() => setVisible(false)}
        idiomas={SUPPORTED_LANGUAGES}
        isDark={true}
        cardColor="#161616"
        borderColor="#222"
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 16,
    backgroundColor: '#161616',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
