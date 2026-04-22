// MeuCorre/hooks/login/useLogin.ts
import * as Crypto from 'expo-crypto'; // <-- IMPORTAÇÃO DO CRYPTO
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import db from '../../database/DatabaseInit';

export const useLogin = () => {
  const router = useRouter();
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
    console.log(
      '[LOGIN DEBUG] Hook useLogin inicializado.',
    );
    checkDeviceForHardware();
    startBounce();
    carregarDadosSalvos();
  }, []);

  const carregarDadosSalvos = async () => {
    console.log(
      '[LOGIN DEBUG] Buscando dados salvos no banco local...',
    );
    try {
      await db.runAsync(
        'CREATE TABLE IF NOT EXISTS app_config (chave TEXT PRIMARY KEY, valor TEXT)',
      );

      const usuario: any = await db.getFirstAsync(
        'SELECT email, cpf, senha FROM perfil_usuario LIMIT 1',
      );

      if (usuario) {
        console.log(
          `[LOGIN DEBUG] Usuário encontrado: E-mail: ${usuario.email} | CPF: ${usuario.cpf}`,
        );
        setTemUsuario(true);
        setIdentificacao(usuario.email || usuario.cpf);

        const config: any = await db.getFirstAsync(
          'SELECT valor FROM app_config WHERE chave = ?',
          ['lembrar_senha'],
        );

        if (config && config.valor === 'true') {
          console.log(
            '[LOGIN DEBUG] Preferência "Lembrar Senha" está ATIVA. Preenchendo com Hash.',
          );
          setSenha(usuario.senha); // Preenche com o Hash (ficará longo no input, mas funciona)
          setLembrarSenha(true);
        } else {
          console.log(
            '[LOGIN DEBUG] Preferência "Lembrar Senha" está INATIVA.',
          );
        }
      } else {
        console.log(
          '[LOGIN DEBUG] Nenhum usuário registrado no banco local.',
        );
        setTemUsuario(false);
      }
    } catch (e) {
      console.error(
        '[LOGIN DEBUG] Erro ao carregar dados salvos:',
        e,
      );
    }
  };

  const checkDeviceForHardware = async () => {
    const compatible =
      await LocalAuthentication.hasHardwareAsync();
    const enrolled =
      await LocalAuthentication.isEnrolledAsync();
    console.log(
      `[LOGIN DEBUG] Biometria suportada: ${compatible} | Cadastrada: ${enrolled}`,
    );
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
    console.log(
      '--------------------------------------------------',
    );
    console.log(
      '[LOGIN DEBUG] Iniciando tentativa de Login Manual...',
    );
    setErro('');

    if (!identificacao.trim() || !senha) {
      console.log(
        '[LOGIN DEBUG] Falha: Campos de identificação ou senha vazios.',
      );
      setErro(
        'Introduza o E-mail ou CPF e a senha para entrar.',
      );
      return;
    }

    setCarregando(true);

    try {
      let idLimpo = identificacao.trim();
      const senhaLimpa = senha.trim();

      // Normalização da Identificação
      const apenasNumeros = idLimpo.replace(/\D/g, '');
      if (
        apenasNumeros.length === 11 &&
        !idLimpo.includes('@')
      ) {
        console.log('[LOGIN DEBUG] Formatando CPF...');
        idLimpo = apenasNumeros.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          '$1.$2.$3-$4',
        );
      } else {
        console.log('[LOGIN DEBUG] Formatando E-mail...');
        idLimpo = idLimpo.toLowerCase();
      }

      console.log(
        `[LOGIN DEBUG] Buscando usuário: |${idLimpo}|`,
      );

      // PASSO 1: Busca o usuário apenas pelo E-mail ou CPF primeiro
      const usuario: any = await db.getFirstAsync(
        'SELECT id, nome, senha FROM perfil_usuario WHERE LOWER(email) = ? OR cpf = ?',
        [idLimpo, idLimpo],
      );

      if (usuario) {
        console.log(
          '[LOGIN DEBUG] Usuário encontrado. Verificando criptografia de senha...',
        );

        let senhaFinal = senhaLimpa;

        // PASSO 2: Verifica se a senha digitada já é o Hash do banco (caso do "Lembrar Senha")
        if (senhaLimpa !== usuario.senha) {
          console.log(
            '[LOGIN DEBUG] Senha digitada é texto puro. Gerando Hash SHA-256...',
          );
          // Se não for o hash, significa que o usuário digitou a senha na hora. Criptografamos para comparar.
          senhaFinal = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            senhaLimpa,
          );
        } else {
          console.log(
            '[LOGIN DEBUG] Senha no input já é o Hash armazenado (Autofill). Pulando criptografia.',
          );
        }

        // PASSO 3: Compara os Hashes
        if (senhaFinal === usuario.senha) {
          console.log(
            `[LOGIN DEBUG] SUCESSO! Senhas conferem. ID: ${usuario.id}`,
          );

          await db.runAsync(
            'CREATE TABLE IF NOT EXISTS app_config (chave TEXT PRIMARY KEY, valor TEXT)',
          );
          await db.runAsync(
            'INSERT OR REPLACE INTO app_config (chave, valor) VALUES (?, ?)',
            [
              'lembrar_senha',
              lembrarSenha ? 'true' : 'false',
            ],
          );

          console.log(
            '[LOGIN DEBUG] Redirecionando para o Dashboard...',
          );
          router.replace({
            pathname: '/dashboard',
            params: { userId: usuario.id },
          } as any);
        } else {
          console.log(
            '[LOGIN DEBUG] FALHA: As senhas não conferem após criptografia.',
          );
          setErro('Utilizador ou senha incorretos.');
        }
      } else {
        console.log(
          '[LOGIN DEBUG] FALHA: Nenhum usuário encontrado com esse ID.',
        );
        setErro('Utilizador ou senha incorretos.');
      }
    } catch (e) {
      console.error(
        '[LOGIN DEBUG] ERRO TRY/CATCH na consulta ao banco:',
        e,
      );
      setErro('Erro ao aceder à base de dados local.');
    } finally {
      setCarregando(false);
      console.log(
        '--------------------------------------------------',
      );
    }
  };

  const realizarLoginBiometrico = async () => {
    console.log(
      '[LOGIN DEBUG] Iniciando Autenticação Biométrica...',
    );
    try {
      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage:
            'Aceda ao MeuCorre com a sua biometria',
          fallbackLabel: 'Utilizar senha',
          disableDeviceFallback: false,
        });

      if (result.success) {
        console.log(
          '[LOGIN DEBUG] Biometria validada com sucesso! Redirecionando...',
        );
        router.replace('/dashboard' as any);
      } else {
        console.log(
          '[LOGIN DEBUG] Biometria cancelada ou falhou.',
          result,
        );
      }
    } catch (e) {
      console.error(
        '[LOGIN DEBUG] Erro na chamada da biometria:',
        e,
      );
    }
  };

  const recuperarSenha = async () => {
    console.log(
      '[LOGIN DEBUG] Tentativa de recuperação de senha...',
    );
    try {
      const usuario: any = await db.getFirstAsync(
        'SELECT nome, senha FROM perfil_usuario LIMIT 1',
      );
      if (usuario) {
        console.log(
          '[LOGIN DEBUG] Usuário encontrado. Avisando sobre criptografia.',
        );
        // Como a senha agora é um Hash irreversível (SHA-256), não podemos mostrá-la
        Alert.alert(
          'Segurança Ativa',
          `Olá, ${usuario.nome}. Por motivos de segurança, sua senha é criptografada de ponta a ponta e não pode ser exibida.\n\nSe você esqueceu sua senha, será necessário redefinir seus dados (Funcionalidade a ser implementada).`,
          [{ text: 'Entendi' }],
        );
      } else {
        console.log(
          '[LOGIN DEBUG] Nenhum usuário cadastrado para recuperar senha.',
        );
        Alert.alert(
          'Sem cadastro',
          'Nenhum usuário encontrado no dispositivo.',
        );
      }
    } catch (e) {
      console.error(
        '[LOGIN DEBUG] Erro ao tentar recuperar senha:',
        e,
      );
      Alert.alert(
        'Erro',
        'Não foi possível acessar os dados de segurança.',
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
