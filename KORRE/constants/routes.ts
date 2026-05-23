import type { Href } from 'expo-router';

export const AppRoutes = {
  cadastro: '/(auth)/cadastro',
  auditoriaKorre: '/calculadora_korre',
  calculadora: '/calculadora',
  configuracoes: '/(tabs)/configuracoes',
  dashboard: '/(tabs)/dashboard',
  analisarCorrida: '/(tabs)/analisar_corrida',
  finance: '/(tabs)/finance',
  garagem: '/(tabs)/garagem',
  historico: '/(tabs)/historico',
  login: '/(auth)/login',
  notificacoes: '/notificacoes',
  oficina: '/(tabs)/oficina',
  origemGanhos: '/(tabs)/origemganhos',
  perfil: '/(tabs)/perfil',
  relatorios: '/(tabs)/relatorios',
  suporte: '/(tabs)/suporte',
  termos: '/(auth)/termos',
} as const satisfies Record<string, Href>;
