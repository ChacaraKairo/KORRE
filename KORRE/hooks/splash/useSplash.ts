import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import db from '../../database/DatabaseInit';

/**
 * Executa a função de use splash.
 */
export const useSplash = () => {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
      NavigationBar.setVisibilityAsync('visible').catch(() => {});
    }

    /**
     * Executa a função de verificar usuario unico.
     */
    const verificarUsuarioUnico = async () => {
      try {
        const usuarioExistente = await db.getFirstAsync(
          'SELECT id FROM perfil_usuario LIMIT 1',
        );
        router.replace(
          usuarioExistente
            ? '/(auth)/login'
            : '/(auth)/cadastro',
        );
      } catch (error) {
        console.error(
          'Erro ao verificar usuário inicial:',
          error,
        );
      }
    };

    const timeout = setTimeout(verificarUsuarioUnico, 2000);
    return () => clearTimeout(timeout);
  }, [router]);
};
