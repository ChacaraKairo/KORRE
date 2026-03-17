import { Tabs } from "expo-router";
import { Compass, Home } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00C853", // Verde destaque do app
        tabBarInactiveTintColor: "#444", // Cinza para inativos
        headerShown: false, // Esconde o cabeçalho padrão
        tabBarStyle: {
          backgroundColor: "#0A0A0A", // Fundo escuro igual ao Dashboard
          borderTopWidth: 1,
          borderTopColor: "#161616", // Linha sutil de divisão
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
