import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppRoutes } from '../../constants/routes';
import { useRecuperarSenha } from '../../hooks/login/useRecuperarSenha';
import { BackButton } from '../../components/ui/BackButton';
import { tokens } from '../../styles/tokens';

export default function RecuperarSenhaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    checkBiometria,
    confirmarSenha,
    cpf,
    email,
    erro,
    hasBiometria,
    loading,
    novaSenha,
    placa,
    recuperarComBiometria,
    recuperarComDados,
    setConfirmarSenha,
    setCpf,
    setEmail,
    setNovaSenha,
    setPlaca,
  } = useRecuperarSenha();

  useEffect(() => {
    void checkBiometria();
  }, [checkBiometria]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton
          fallback={AppRoutes.login}
          label={t('common.voltar')}
          isDark
        />

        <View style={styles.logoArea}>
          <Image
            source={require('../../assets/images/favicon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          {t('recuperar_senha.title')}
        </Text>
        <Text style={styles.subtitle}>
          {t('recuperar_senha.subtitle')}
        </Text>

        {hasBiometria && (
          <TouchableOpacity
            disabled={loading}
            onPress={recuperarComBiometria}
            style={[styles.primaryButton, loading && styles.disabled]}
          >
            <Text style={styles.primaryButtonText}>
              {t('recuperar_senha.biometria_action')}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionLabel}>
          {t('recuperar_senha.fallback_title')}
        </Text>

        <TextInput
          accessibilityLabel={t('recuperar_senha.email')}
          placeholder={t('recuperar_senha.email')}
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          editable={!loading}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel={t('recuperar_senha.cpf')}
          placeholder={t('recuperar_senha.cpf')}
          placeholderTextColor="#666"
          keyboardType="number-pad"
          editable={!loading}
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel={t('recuperar_senha.placa')}
          placeholder={t('recuperar_senha.placa')}
          placeholderTextColor="#666"
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!loading}
          value={placa}
          onChangeText={setPlaca}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel={t('recuperar_senha.new_password')}
          placeholder={t('recuperar_senha.new_password')}
          placeholderTextColor="#666"
          secureTextEntry
          autoComplete="new-password"
          editable={!loading}
          value={novaSenha}
          onChangeText={setNovaSenha}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel={t('recuperar_senha.confirm_password')}
          placeholder={t('recuperar_senha.confirm_password')}
          placeholderTextColor="#666"
          secureTextEntry
          autoComplete="new-password"
          editable={!loading}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          style={styles.input}
        />

        {!!erro && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        )}

        <TouchableOpacity
          disabled={loading}
          onPress={recuperarComDados}
          style={[styles.secondaryButton, loading && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#00C853" />
          ) : (
            <Text style={styles.secondaryButtonText}>
              {t('recuperar_senha.reset_action')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          onPress={() => router.replace(AppRoutes.login)}
          style={styles.backToLoginButton}
        >
          <Text style={styles.backToLoginText}>
            {t('recuperar_senha.back_to_login')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.palette.surface950,
  },
  content: {
    flexGrow: 1,
    padding: tokens.spacing.xl,
    paddingTop: tokens.spacing.xxl,
    paddingBottom: 48,
    gap: tokens.spacing.md,
  },
  logoArea: {
    alignItems: 'center',
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  logo: {
    width: 96,
    height: 96,
  },
  title: {
    color: tokens.palette.white,
    fontSize: tokens.typography.size.xxxl,
    fontWeight: tokens.typography.weight.black,
  },
  subtitle: {
    color: tokens.palette.surface300,
    fontSize: tokens.typography.size.md,
    lineHeight: 20,
  },
  sectionLabel: {
    color: tokens.palette.surface200,
    marginTop: tokens.spacing.sm,
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
  },
  input: {
    minHeight: 50,
    backgroundColor: tokens.palette.surface850,
    borderColor: tokens.palette.surface600,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    color: tokens.palette.white,
    paddingHorizontal: tokens.spacing.lg,
    fontSize: tokens.typography.size.md,
  },
  primaryButton: {
    minHeight: 50,
    backgroundColor: tokens.palette.brand,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
  },
  primaryButtonText: {
    color: tokens.palette.surface950,
    fontWeight: tokens.typography.weight.black,
    textAlign: 'center',
  },
  secondaryButton: {
    minHeight: 50,
    backgroundColor: tokens.palette.surface750,
    borderWidth: 1,
    borderColor: tokens.palette.surface600,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
  },
  secondaryButtonText: {
    color: tokens.palette.white,
    fontWeight: tokens.typography.weight.black,
  },
  backToLoginButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.xs,
  },
  backToLoginText: {
    color: tokens.palette.brand,
    fontWeight: tokens.typography.weight.black,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: tokens.palette.dangerStrong,
    borderRadius: tokens.radius.md,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: tokens.spacing.md,
  },
  errorText: {
    color: '#FCA5A5',
    fontWeight: tokens.typography.weight.bold,
    lineHeight: 19,
  },
  disabled: {
    opacity: 0.6,
  },
});
