import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen'; // Importante para UX
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DatabaseInit } from '@/database/DatabaseInit'; // Verifique se o caminho está correto

// Impede que a Splash Screen feche automaticamente
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Inicializa o SQLite
        DatabaseInit();

        // Aqui você pode carregar outras coisas se precisar (fontes, login, etc)
        console.log('[SISTEMA] Banco de dados pronto.');
      } catch (e) {
        console.warn(
          '[ERRO] Falha ao inicializar o app:',
          e,
        );
      } finally {
        setAppReady(true);
        // Esconde a Splash Screen após tudo estar pronto
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, []);

  // Enquanto o banco não carrega, não renderiza as rotas para evitar erros de SQL
  if (!appReady) {
    return null;
  }

  return (
    <ThemeProvider
      value={
        colorScheme === 'dark' ? DarkTheme : DefaultTheme
      }
    >
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
