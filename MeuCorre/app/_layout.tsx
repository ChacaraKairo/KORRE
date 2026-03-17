import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import db, { DatabaseInit } from "../database/DatabaseInit";

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
          "SELECT id FROM perfil_usuario LIMIT 1;",
        );

        setHasUser(result.length > 0);
      } catch (error) {
        console.error("Erro na inicialização do app:", error);
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

    const rootSegment = segments[0] as string | undefined;

    // Verifica se estamos na raiz (URL "/" ou arquivo "index")
    const isAtRoot =
      rootSegment === undefined ||
      rootSegment === "index" ||
      rootSegment === "";

    if (isAtRoot) {
      if (hasUser) {
        // Se já tem cadastro, vai para o login
        router.replace("/(auth)/login" as any);
      } else {
        // Se não tem, vai criar conta
        router.replace("/(auth)/cadastro" as any);
      }
    }
  }, [isReady, hasUser, segments, router]);

  // 3. RENDERIZAÇÃO DAS ROTAS (Limpo)
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
