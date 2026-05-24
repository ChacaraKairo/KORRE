import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { useSplash } from "../hooks/splash/useSplash";
import { styles } from "../styles/SplashStyles";

/**
 * Executa a função de splash screen.
 */
export default function SplashScreen() {
  const { t } = useTranslation();
  useSplash();

  return (
    <View style={styles.container}>
      {/* Garante que não apareça barra de navegação durante o loading */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Logo do KORRE ou algo que remeta ao projeto */}
      <Image
        source={require("../assets/images/android-icon-foreground-safe.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <ActivityIndicator size="large" color="#00C853" />
      <Text style={styles.text}>{t('common.loading_local')}</Text>
    </View>
  );
}
