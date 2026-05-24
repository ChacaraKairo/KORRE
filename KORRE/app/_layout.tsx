import {
  Stack,
  usePathname,
  useRouter,
  useSegments,
} from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppLoadingOverlay } from '../components/ui/AppLoadingOverlay';
import { AppRoutes } from '../constants/routes';
import db, { DatabaseInit } from '../database/DatabaseInit';
import { i18nReady } from '../locales/i18n';
import { executarVerificacoesLocais } from '../notifications/LocalNotificationScheduler';
import { NotificationHandler } from '../notifications/NotificationHandler';
import { logger } from '../utils/logger';
import { safeBack } from '../utils/navigation/safeBack';
import { goBackToReturnRoute } from '../utils/navigation/returnRoute';
import { getAuthSessionUserId } from '../utils/auth/authSession';
import { DataSyncService } from '../modules/sync/DataSyncService';

import { inlineStyles } from '../styles/generated-inline/app/_layoutInlineStyles';
/**
 * Executa a função de root layout.
 */
export default function RootLayout() {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [startupError, setStartupError] = useState(false);
  const [setupAttempt, setSetupAttempt] = useState(0);
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const subscriptions: { remove: () => void }[] = [];

    /**
     * Executa a função de setup.
     */
    async function setup() {
      setIsReady(false);
      setStartupError(false);

      try {
        await i18nReady;
        DatabaseInit();
        await NotificationHandler.setupForegroundHandler();
        subscriptions.push(
          await NotificationHandler.listenToReceived(),
        );
        const notificationSub =
          await NotificationHandler.listenToClicks();
        subscriptions.push(notificationSub);
        const result = await db.getAllAsync<{ id: number }>(
          'SELECT id FROM perfil_usuario LIMIT 1;',
        );
        const existeUsuario = result.length > 0;
        setHasUser(existeUsuario);

        if (existeUsuario) {
          await executarVerificacoesLocais();
        }
        void DataSyncService.registerDeviceIfPossible();
        void DataSyncService.flushPendingBatches();
      } catch (error) {
        logger.error('[RootLayout] Falha no setup inicial:', error);
        setStartupError(true);
      } finally {
        setIsReady(true);
      }
    }
    setup();

    return () => {
      subscriptions.forEach((subscription) =>
        subscription.remove(),
      );
    };
  }, [setupAttempt]);

  useEffect(() => {
    if (!isReady || startupError) return;
    const rootSegment = segments[0] as string | undefined;
    const isAuthenticated = getAuthSessionUserId() !== null;
    const isAtRoot =
      rootSegment === undefined ||
      rootSegment === 'index' ||
      rootSegment === '';
    const inAuthGroup = rootSegment === '(auth)';
    const inTabsGroup = rootSegment === '(tabs)';
    const isAuthPublicRoute =
      inAuthGroup &&
      pathname !== AppRoutes.termos &&
      pathname !== '/(auth)/politica-privacidade';
    const isPrivateRoute =
      inTabsGroup && pathname !== AppRoutes.calculadora;

    if (isAtRoot) {
      if (hasUser) {
        router.replace(AppRoutes.login);
      } else {
        router.replace(AppRoutes.cadastro);
      }
      return;
    }

    if (!isAuthenticated && isPrivateRoute) {
      router.replace(AppRoutes.login);
      return;
    }

    if (isAuthenticated && isAuthPublicRoute) {
      router.replace(AppRoutes.dashboard);
    }
  }, [
    hasUser,
    isReady,
    pathname,
    router,
    segments,
    startupError,
  ]);

  useEffect(() => {
    if (Platform.OS !== 'android' || !isReady || startupError) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const isAuthenticated = getAuthSessionUserId() !== null;
        const fallbackRoute = isAuthenticated
          ? AppRoutes.dashboard
          : AppRoutes.login;

        if (pathname === AppRoutes.calculadora) {
          goBackToReturnRoute(router, fallbackRoute);
          return true;
        }

        if (!isAuthenticated) {
          if (
            pathname !== AppRoutes.login &&
            pathname !== AppRoutes.cadastro &&
            pathname !== AppRoutes.calculadora
          ) {
            router.replace(fallbackRoute);
          }
          return true;
        }

        const isProtectedRoot = pathname.includes('dashboard');
        const isAuthRoute =
          pathname.includes('login') ||
          pathname.includes('cadastro');

        if (isProtectedRoot) {
          return true;
        }

        if (isAuthRoute) {
          return true;
        }

        safeBack(router, fallbackRoute);
        return true;
      },
    );

    return () => subscription.remove();
  }, [
    isReady,
    pathname,
    router,
    startupError,
  ]);

  if (!isReady) {
    return (
      <SafeAreaProvider style={inlineStyles.inline4}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0A',
          }}
        >
          <ActivityIndicator size="large" color="#00C853" />
          <Text
            style={{
              color: '#00C853',
              fontSize: 12,
              fontWeight: '900',
              marginTop: 12,
              textTransform: 'uppercase',
            }}
          >
            {t('startup.loading')}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (startupError) {
    return (
      <SafeAreaProvider style={inlineStyles.inline4}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            backgroundColor: '#0A0A0A',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            {t('startup.erro_titulo')}
          </Text>
          <Text
            style={{
              color: '#A0A0A0',
              fontSize: 14,
              lineHeight: 20,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            {t('startup.erro_msg')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSetupAttempt((attempt) => attempt + 1)}
            style={{
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              borderRadius: 8,
              backgroundColor: '#00C853',
            }}
          >
            <Text
              style={{
                color: '#0A0A0A',
                fontSize: 14,
                fontWeight: '900',
              }}
            >
              {t('startup.tentar_novamente')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={inlineStyles.inline4}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="relatorios" />
      </Stack>
      <AppLoadingOverlay />
    </SafeAreaProvider>
  );
}
