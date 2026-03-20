import { Tabs } from 'expo-router';
import { Database, Home } from 'lucide-react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from '../../hooks/modo_tema';
import { CustomAlert } from '../../components/ui/CustomAlert';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#00C853', // Verde destaque do app
          tabBarInactiveTintColor: isDark ? '#444' : '#888', // Cinza para inativos
          headerShown: false, // Esconde o cabeçalho padrão
          tabBarStyle: {
            backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#161616' : '#E0E0E0',
            height: 60 + insets.bottom,
            paddingBottom: 8 + insets.bottom,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Home size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Dados',
            tabBarIcon: ({ color }) => (
              <Database size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="finance"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="calculadora"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="origemganhos"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <CustomAlert />
    </>
  );
}
