import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

export function HelloWave() {
  // 1. Criamos um valor compartilhado para a rotação
  const rotation = useSharedValue(0);

  useEffect(() => {
    // 2. Iniciamos a animação: uma sequência que vai para 25 graus e volta para 0
    // Repetimos isso 4 vezes (como no seu código original)
    rotation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(0, { duration: 150 }),
      ),
      4, // Número de repetições
      false, // Não inverte (faz o ciclo completo da sequência)
    );
  }, []);

  // 3. Criamos o estilo animado que o Reanimated entende
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.Text
      style={[
        {
          fontSize: 28,
          lineHeight: 32,
          marginTop: -6,
        },
        animatedStyle, // Aplicamos a animação aqui
      ]}
    >
      👋
    </Animated.Text>
  );
}
