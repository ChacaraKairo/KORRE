import type { Href } from 'expo-router';

export const AppRoutes = {
  cadastro: '/(auth)/cadastro',
  calculadora: '/calculadora',
  configuracoes: '/(tabs)/configuracoes',
  dashboard: '/(tabs)/dashboard',
  finance: '/(tabs)/finance',
  garagem: '/(tabs)/garagem',
  historico: '/(tabs)/historico',
  login: '/(auth)/login',
  notificacoes: '/notificacoes',
  oficina: '/(tabs)/oficina',
  origemGanhos: '/(tabs)/origemganhos',
  perfil: '/(tabs)/perfil',
  recuperarSenha: '/(auth)/recuperar-senha',
  relatorios: '/(tabs)/relatorios',
  suporte: '/(tabs)/suporte',
  termos: '/(auth)/termos',
} as const satisfies Record<string, Href>;
