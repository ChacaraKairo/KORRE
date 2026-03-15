import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSplash } from '../hooks/splash/useSplash';
import { styles } from '../styles/SplashStyles';

export default function SplashScreen() {
  useSplash();

  return (
    <View style={styles.container}>
      {/* Garante que não apareça barra de navegação durante o loading */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Logo do MeuCorre ou algo que remeta ao seu projeto */}
      <Image
        source={require('../assets/images/android-icon-foreground.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ActivityIndicator size="large" color="#00C853" />
      <Text style={styles.text}>
        Carregando dados locais...
      </Text>
    </View>
  );
}
