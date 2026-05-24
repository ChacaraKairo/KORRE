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

/**
 * Executa a função de normalize cpf.
 */
const normalizeCpf = (value: string) => value.replace(/\D/g, '');
/**
 * Executa a função de normalize plate.
 */
const normalizePlate = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

/**
 * Executa a função de use recuperar senha.
 */
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

  /**
   * Executa a função de check biometria.
   */
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

  /**
   * Executa a função de validar senha.
   */
  const validarSenha = () => {
    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setErro(t('recuperar_senha.preencha_nova_senha'));
      return false;
    }

    if (novaSenha.trim().length < 7) {
      setErro(t('recuperar_senha.senha_curta'));
      return false;
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      setErro(t('recuperar_senha.senhas_diferentes'));
      return false;
    }

    return true;
  };

  /**
   * Executa a função de resetar senha.
   */
  const resetarSenha = async (usuarioId: number) => {
    const novaHash = await hashPassword(novaSenha.trim());
    await db.runAsync(
      'UPDATE perfil_usuario SET senha = ? WHERE id = ?',
      [novaHash, usuarioId],
    );
    await resetarTentativasLogin();
    clearAuthSession();
    await criarNotificacao({
      titulo: 'Senha redefinida',
      mensagem: 'Sua senha foi redefinida com sucesso.',
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

  /**
   * Executa a função de recuperar com biometria.
   */
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

      await resetarSenha(usuario.id);
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

  /**
   * Executa a função de recuperar com dados.
   */
  const recuperarComDados = async () => {
    setErro('');
    if (!validarSenha()) return;

    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = normalizeCpf(cpf);
    const placaNormalizada = normalizePlate(placa);

    if (!emailNormalizado || !cpfNormalizado || !placaNormalizada) {
      setErro(t('recuperar_senha.preencha_dados'));
      return;
    }

    setLoading(true);
    try {
      const usuario = await db.getFirstAsync<{ id: number }>(
        `SELECT p.id
         FROM perfil_usuario p
         INNER JOIN veiculos v ON v.id_user = p.id
         WHERE LOWER(p.email) = ?
           AND REPLACE(REPLACE(REPLACE(p.cpf, '.', ''), '-', ''), ' ', '') = ?
           AND UPPER(REPLACE(REPLACE(v.placa, '-', ''), ' ', '')) = ?
         LIMIT 1`,
        [emailNormalizado, cpfNormalizado, placaNormalizada],
      );

      if (!usuario?.id) {
        setErro(t('recuperar_senha.validacao_falhou'));
        return;
      }

      await resetarSenha(usuario.id);
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
