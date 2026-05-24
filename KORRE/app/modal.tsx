import {
  Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { styles } from '../styles/generated/app/modalStyles';
/**
 * Executa a função de modal screen.
 */
export default function ModalScreen() {
  const { t } = useTranslation();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('modal.titulo')}</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">{t('modal.home')}</ThemedText>
      </Link>
    </ThemedView>
  );
}

