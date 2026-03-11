import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
// Importações apontando para o arquivo correto
import { DatabaseInit } from '../database/DatabaseInit';
import db from '../database/DatabaseInit';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // 1. EFEITO DE INICIALIZAÇÃO DO BANCO
  useEffect(() => {
    async function setup() {
      try {
        // Inicializa tabelas (síncrono)
        DatabaseInit();

        // Verifica se existe perfil (assíncrono)
        const result = await db.getAllAsync<{ id: number }>(
          'SELECT id FROM perfil_usuario LIMIT 1;',
        );

        setHasUser(result.length > 0);
      } catch (error) {
        console.error(
          'Erro na inicialização do app:',
          error,
        );
      } finally {
        // Simula tempo de splash screen
        setTimeout(() => setIsReady(true), 2000);
      }
    }
    setup();
  }, []);

  // 2. LÓGICA DE REDIRECIONAMENTO
  useEffect(() => {
    if (!isReady) return;

    // Forçamos a tipagem para string para evitar o erro de "no overlap"
    const rootSegment = segments[0] as string | undefined;

    // Verifica se estamos na raiz (URL "/" ou arquivo "index")
    const isAtRoot =
      rootSegment === undefined ||
      rootSegment === 'index' ||
      rootSegment === '';

    if (isAtRoot) {
      if (hasUser) {
        router.replace('/login');
      } else {
        router.replace('/cadastro');
      }
    }
  }, [isReady, hasUser, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
