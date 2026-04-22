import { Stack } from 'expo-router';

export default function RelatoriosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aqui dentro vão viver todos os relatórios detalhados */}
      <Stack.Screen name="termometro_mei" />
      <Stack.Screen name="carne-leao" />

      {/* Pode adicionar os outros depois: balanco_dre, fluxo_caixa, etc. */}
    </Stack>
  );
}
