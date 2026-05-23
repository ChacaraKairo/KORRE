import { Tabs } from 'expo-router';
import { Database, Home } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTema } from '../../hooks/modo_tema';
import { CustomAlert } from '../../components/ui/CustomAlert';

export default function TabLayout() {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#00C853',
          tabBarInactiveTintColor: isDark ? '#444' : '#888',
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: t('tabs.dashboard'),
            tabBarIcon: ({ color }) => (
              <Home size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: t('tabs.dados'),
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
          name="analisar_corrida"
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
