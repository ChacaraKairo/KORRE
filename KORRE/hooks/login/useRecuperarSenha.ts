import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import db from '../../database/DatabaseInit';
import { AppRoutes } from '../../constants/routes';
import { hashPassword } from '../../utils/auth/passwordHash';
import { clearAuthSession } from '../../utils/auth/authSession';
import { resetarTentativasLogin } from '../../utils/auth/loginLockout';
import { logger } from '../../utils/logger';
import { criarNotificacao } from '../../notifications/NotificationService';
import { recoverPasswordWithLocalData } from '../../modules/auth/PasswordRecoveryService';
import { validarRegrasSenha } from '../../utils/validacaoSenha';

export const useRecuperarSenha = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [placa, setPlaca] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const [hardware, setHardware] = useState<boolean | null>(null);
  const [enrolled, setEnrolled] = useState<boolean | null>(null);

  const checkBiometria = async () => {
    if (hardware !== null && enrolled !== null) return;
    const hasHardware =
      await LocalAuthentication.hasHardwareAsync();
    const isEnrolled =
      await LocalAuthentication.isEnrolledAsync();
    setHardware(hasHardware);
    setEnrolled(isEnrolled);
  };

  const hasBiometria = Boolean(hardware && enrolled);

  const validarSenha = () => {
    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setErro(t('recuperar_senha.preencha_nova_senha'));
      return false;
    }

    if (!validarRegrasSenha(novaSenha.trim()).valida) {
      setErro(t('recuperar_senha.senha_invalida'));
      return false;
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      setErro(t('recuperar_senha.senhas_diferentes'));
      return false;
    }

    return true;
  };

  const finalizarResetSenha = async (usuarioId: number) => {
    const novaHash = await hashPassword(novaSenha.trim());
    await db.runAsync(
      'UPDATE perfil_usuario SET senha = ? WHERE id = ?',
      [novaHash, usuarioId],
    );
    await resetarTentativasLogin();
    clearAuthSession();
    await criarNotificacao({
      titulo: t('notifications.security.password_reset_title'),
      mensagem: t('notifications.security.password_reset_body'),
      tipo: 'seguranca',
      prioridade: 'alta',
      destino: AppRoutes.login,
      canal: 'historico',
      grupoPreferencia: 'seguranca',
      dedupKey: `senha_redefinida:${Date.now()}`,
    });
    Alert.alert(
      t('common.sucesso'),
      t('recuperar_senha.sucesso_msg'),
      [
        {
          text: t('common.ok'),
          onPress: () => router.replace(AppRoutes.login),
        },
      ],
    );
  };

  const recuperarComBiometria = async () => {
    setErro('');
    if (!validarSenha()) return;

    setLoading(true);
    try {
      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage: t('recuperar_senha.biometria_prompt'),
          fallbackLabel: t('recuperar_senha.biometria_fallback'),
          disableDeviceFallback: false,
        });

      if (!result.success) {
        setErro(t('recuperar_senha.validacao_falhou'));
        return;
      }

      const usuario = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM perfil_usuario LIMIT 1',
      );

      if (!usuario?.id) {
        setErro(t('recuperar_senha.validacao_falhou'));
        return;
      }

      await finalizarResetSenha(usuario.id);
    } catch (error) {
      logger.error(
        '[RecuperarSenha] Falha ao redefinir senha por biometria:',
        error,
      );
      setErro(t('recuperar_senha.erro_banco'));
    } finally {
      setLoading(false);
    }
  };

  const recuperarComDados = async () => {
    setErro('');

    setLoading(true);
    try {
      const result = await recoverPasswordWithLocalData(
        {
          email,
          cpf,
          plate: placa,
          newPassword: novaSenha,
          confirmPassword: confirmarSenha,
        },
        db,
        hashPassword,
      );

      if (!result.ok) {
        if (result.reason === 'invalid_email') {
          setErro(t('recuperar_senha.email_invalido'));
          return;
        }

        if (result.reason === 'invalid_cpf') {
          setErro(t('recuperar_senha.cpf_invalido'));
          return;
        }

        if (result.reason === 'invalid_plate') {
          setErro(t('recuperar_senha.placa_invalida'));
          return;
        }

        if (result.reason === 'password_invalid') {
          setErro(t('recuperar_senha.senha_invalida'));
          return;
        }

        if (result.reason === 'password_mismatch') {
          setErro(t('recuperar_senha.senhas_diferentes'));
          return;
        }

        setErro(t('recuperar_senha.validacao_falhou'));
        return;
      }

      await resetarTentativasLogin();
      clearAuthSession();
      await criarNotificacao({
        titulo: t('notifications.security.password_reset_title'),
        mensagem: t('notifications.security.password_reset_body'),
        tipo: 'seguranca',
        prioridade: 'alta',
        destino: AppRoutes.login,
        canal: 'historico',
        grupoPreferencia: 'seguranca',
        dedupKey: `senha_redefinida:${Date.now()}`,
      });
      Alert.alert(
        t('common.sucesso'),
        t('recuperar_senha.sucesso_msg'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.replace(AppRoutes.login),
          },
        ],
      );
    } catch (error) {
      logger.error(
        '[RecuperarSenha] Falha ao redefinir senha por dados:',
        error,
      );
      setErro(t('recuperar_senha.erro_banco'));
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
