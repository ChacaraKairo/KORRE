import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import db from '../../database/DatabaseInit';
import {
  hashPassword,
  verifyPassword,
} from '../../utils/auth/passwordHash';
import {
  HASH_ITERATIONS,
  parsePasswordHash,
} from '../../utils/auth/passwordHashFormat';
import { AppRoutes } from '../../constants/routes';
import { logger } from '../../utils/logger';
import { waitForUiFeedback } from '../../utils/ui/waitForUiFeedback';
import { setAuthSession } from '../../utils/auth/authSession';
import {
  getLoginLockoutValue,
  LOGIN_LOCKED_UNTIL,
  registrarFalhaLogin,
  resetarTentativasLogin,
} from '../../utils/auth/loginLockout';

type UsuarioLogin = {
  id: number;
  nome: string;
  email?: string | null;
  cpf?: string | null;
  senha?: string | null;
};

const CONFIG_LEMBRAR_IDENTIFICACAO = 'lembrar_identificacao';

export const useLogin = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [identificacao, setIdentificacao] = useState('');
  const [senha, setSenha] = useState('');
  const [temUsuario, setTemUsuario] = useState(false);
  const [lembrarSenha, setLembrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [biometriaDisponivel, setBiometriaDisponivel] =
    useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkDeviceForHardware();
    startBounce();
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    try {
      const usuario = await db.getFirstAsync<UsuarioLogin>(
        'SELECT email, cpf FROM perfil_usuario LIMIT 1',
      );

      if (usuario) {
        setTemUsuario(true);

        const config = await db.getFirstAsync<{ valor: string }>(
          'SELECT valor FROM configuracoes_app WHERE chave = ?',
          [CONFIG_LEMBRAR_IDENTIFICACAO],
        );

        if (config && config.valor === 'true') {
          setIdentificacao(usuario.email || usuario.cpf || '');
          setLembrarSenha(true);
        }
      } else {
        setTemUsuario(false);
      }
    } catch (e) {
      if (__DEV__) logger.error('[LOGIN] Falha ao carregar dados salvos:', e);
    }
  };

  const checkDeviceForHardware = async () => {
    const compatible =
      await LocalAuthentication.hasHardwareAsync();
    const enrolled =
      await LocalAuthentication.isEnrolledAsync();
    setBiometriaDisponivel(compatible && enrolled);
  };

  const startBounce = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const realizarLoginManual = async () => {
    setErro('');

    if (!identificacao.trim() || !senha) {
      setErro(t('login.preencha_credenciais'));
      return;
    }

    setCarregando(true);

    try {
      await waitForUiFeedback();

      const lockedUntil =
        await getLoginLockoutValue(LOGIN_LOCKED_UNTIL);
      if (lockedUntil && Date.now() < lockedUntil) {
        const minutosRestantes = Math.ceil(
          (lockedUntil - Date.now()) / 60000,
        );
        setErro(
          t('login.tentativas_bloqueadas', {
            minutos: minutosRestantes,
          }),
        );
        return;
      }

      let idLimpo = identificacao.trim();
      const senhaLimpa = senha.trim();

      // Normalização da Identificação
      const apenasNumeros = idLimpo.replace(/\D/g, '');
      if (
        apenasNumeros.length === 11 &&
        !idLimpo.includes('@')
      ) {
        idLimpo = apenasNumeros.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          '$1.$2.$3-$4',
        );
      } else {
        idLimpo = idLimpo.toLowerCase();
      }

      const usuario = await db.getFirstAsync<UsuarioLogin>(
        'SELECT id, nome, senha FROM perfil_usuario WHERE LOWER(email) = ? OR cpf = ?',
        [idLimpo, idLimpo],
      );

      if (usuario) {
        if (await verifyPassword(senhaLimpa, usuario.senha)) {
          setAuthSession(usuario.id);
          const senhaAtual = parsePasswordHash(usuario.senha);
          await resetarTentativasLogin();
          await db.runAsync(
            'INSERT OR REPLACE INTO configuracoes_app (chave, valor) VALUES (?, ?)',
            [
              CONFIG_LEMBRAR_IDENTIFICACAO,
              lembrarSenha ? 'true' : 'false',
            ],
          );

          router.replace({
            pathname: AppRoutes.dashboard,
            params: { userId: usuario.id },
          });

          if (
            !senhaAtual ||
            senhaAtual.iterations !== HASH_ITERATIONS
          ) {
            void atualizarHashEmSegundoPlano(
              usuario.id,
              senhaLimpa,
            );
          }
        } else {
          await registrarFalhaLogin();
          setErro(t('login.credenciais_invalidas'));
        }
      } else {
        await registrarFalhaLogin();
        setErro(t('login.credenciais_invalidas'));
      }
    } catch (e) {
      logger.error('[LOGIN] Falha na consulta ao banco:', e);
      setErro(t('login.erro_banco_local'));
    } finally {
      setCarregando(false);
    }
  };

  const atualizarHashEmSegundoPlano = async (
    usuarioId: number,
    senhaLimpa: string,
  ) => {
    try {
      const senhaAtualizada = await hashPassword(senhaLimpa);
      await db.runAsync(
        'UPDATE perfil_usuario SET senha = ? WHERE id = ?',
        [senhaAtualizada, usuarioId],
      );
    } catch (error) {
      logger.error('[LOGIN] Falha ao atualizar hash:', error);
    }
  };

  const realizarLoginBiometrico = async () => {
    try {
      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage: t('login.biometria_prompt'),
          fallbackLabel: t('login.biometria_fallback'),
          disableDeviceFallback: false,
        });

      if (result.success) {
        const usuario = await db.getFirstAsync<UsuarioLogin>(
          'SELECT id FROM perfil_usuario LIMIT 1',
        );

        if (!usuario) {
          setTemUsuario(false);
          setErro(t('login.sem_usuario_biometria'));
          return;
        }

        setAuthSession(usuario.id);
        router.replace({
          pathname: AppRoutes.dashboard,
          params: { userId: usuario.id },
        });
      }
    } catch (e) {
      if (__DEV__) logger.error('[LOGIN] Falha na biometria:', e);
    }
  };

  const recuperarSenha = async () => {
    try {
      const usuario = await db.getFirstAsync<UsuarioLogin>(
        'SELECT nome FROM perfil_usuario LIMIT 1',
      );
      if (usuario) {
        Alert.alert(
          t('login.seguranca_ativa'),
          t('login.recuperar_senha_msg', {
            nome: usuario.nome,
          }),
          [{ text: t('calculadora.entendi') }],
        );
      } else {
        Alert.alert(
          t('login.sem_cadastro'),
          t('login.sem_cadastro_msg'),
        );
      }
    } catch (e) {
      if (__DEV__) logger.error('[LOGIN] Falha ao recuperar senha:', e);
      Alert.alert(
        t('common.erro'),
        t('login.erro_dados_seguranca'),
      );
    }
  };

  return {
    identificacao,
    setIdentificacao,
    senha,
    setSenha,
    temUsuario,
    lembrarSenha,
    setLembrarSenha,
    carregando,
    erro,
    biometriaDisponivel,
    bounceAnim,
    realizarLoginManual,
    realizarLoginBiometrico,
    recuperarSenha,
  };
};
