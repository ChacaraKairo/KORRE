import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { safeBack } from '../utils/navigation/safeBack';

import { useTema } from '../hooks/modo_tema';
import { useNotificacoes } from '../hooks/notificacoes/useNotificacoes';
import { AppHeader } from '../components/ui/AppHeader';
import { AppScreen } from '../components/ui/AppScreen';
import { AppButton } from '../components/ui/AppButton';
import { EmptyState } from '../components/ui/EmptyState';
import { tokens } from '../styles/tokens';

export default function NotificacoesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const {
    notificacoes,
    marcarComoLida,
    limparHistorico,
    dispararNotificacao,
  } = useNotificacoes();

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle size={24} color={tokens.palette.dangerStrong} />;
      case 'sucesso':
        return <CheckCircle2 size={24} color={tokens.palette.brand} />;
      default:
        return <Bell size={24} color={tokens.palette.blue} />;
    }
  };

  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;
  const cardColor = isDark ? tokens.palette.surface800 : tokens.palette.white;
  const borderColor = isDark ? tokens.palette.surface650 : tokens.palette.surface200;

  return (
    <AppScreen isDark={isDark}>
      <AppHeader
        title={t('notificacoes.titulo')}
        subtitle={t(
          'notificacoes.subtitulo',
          'Alertas, lembretes e avisos importantes ficam aqui.',
        )}
        isDark={isDark}
        onBack={() => safeBack(router)}
        right={
          notificacoes.length > 0 ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t(
                'notificacoes.limpar',
                'Limpar notificacoes',
              )}
              onPress={limparHistorico}
              activeOpacity={0.75}
              style={[
                localStyles.clearButton,
                { backgroundColor: cardColor, borderColor },
              ]}
            >
              <Trash2 size={20} color={tokens.palette.dangerStrong} />
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={localStyles.testArea}>
        <AppButton
          title={t('notificacoes.testar')}
          variant="secondary"
          isDark={isDark}
          icon={Bell}
          onPress={() =>
            dispararNotificacao(
              t('notificacoes.teste_titulo'),
              t('notificacoes.teste_msg'),
              'sucesso',
            )
          }
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.listContent}
      >
        {notificacoes.length === 0 ? (
          <EmptyState
            title={t('notificacoes.vazio')}
            description={t(
              'notificacoes.vazio_desc',
              'Quando houver metas, manutenção, backup ou alertas do sistema, você verá tudo por aqui.',
            )}
            icon={Bell}
            isDark={isDark}
          />
        ) : (
          notificacoes.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              accessibilityRole="button"
              accessibilityLabel={`${notif.titulo}. ${notif.mensagem}`}
              onPress={() => marcarComoLida(notif.id)}
              activeOpacity={0.75}
              style={[
                localStyles.notificationCard,
                {
                  backgroundColor: cardColor,
                  borderColor,
                  opacity: notif.lida ? 0.68 : 1,
                },
              ]}
            >
              <View style={localStyles.iconWrap}>{getIcone(notif.tipo)}</View>
              <View style={localStyles.messageWrap}>
                <Text style={[localStyles.notificationTitle, { color: textColor }]}>
                  {notif.titulo}
                </Text>
                <Text style={[localStyles.notificationMessage, { color: mutedColor }]}>
                  {notif.mensagem}
                </Text>
                <Text
                  style={[
                    localStyles.readState,
                    {
                      color: notif.lida
                        ? mutedColor
                        : tokens.palette.brand,
                    },
                  ]}
                >
                  {notif.lida
                    ? t('notificacoes.lida', 'Lida')
                    : t('notificacoes.nao_lida', 'Nova')}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </AppScreen>
  );
}

const localStyles = StyleSheet.create({
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testArea: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  listContent: {
    flexGrow: 1,
    padding: tokens.spacing.xl,
    paddingBottom: 100,
  },
  notificationCard: {
    minHeight: 92,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
    paddingTop: tokens.spacing.xs,
  },
  messageWrap: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.black,
  },
  notificationMessage: {
    marginTop: tokens.spacing.xs,
    fontSize: tokens.typography.size.md,
    lineHeight: 20,
  },
  readState: {
    marginTop: tokens.spacing.sm,
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.black,
  },
});
