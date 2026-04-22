import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import db from '../../database/DatabaseInit';

export const useSplash = () => {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0A0A0A');
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setVisibilityAsync('visible');
    }

    const verificarUsuarioUnico = async () => {
      try {
        const usuarioExistente = await db.getFirstAsync(
          'SELECT id FROM perfil_usuario LIMIT 1',
        );
        router.replace(
          usuarioExistente
            ? ('/login' as any)
            : ('/cadastro' as any),
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
