import { Stack } from 'expo-router';

/**
 * Executa a função de auth layout.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Garante fundo preto durante a transição para combinar com a logo Korre
        contentStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="termos" />
      <Stack.Screen name="politica-privacidade" />
      <Stack.Screen name="recuperar-senha" />
    </Stack>
  );
}
