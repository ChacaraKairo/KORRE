import { useState, useEffect, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';

export const useLogin = () => {
  const router = useRouter();
  const [nome, setNome] = useState('');
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

  // Carrega o nome do último usuário e verifica se ele queria salvar a senha
  const carregarDadosSalvos = async () => {
    try {
      // Cria a tabela de configurações caso não exista ainda (sem afetar as outras tabelas)
      await db.runAsync(
        'CREATE TABLE IF NOT EXISTS app_config (chave TEXT PRIMARY KEY, valor TEXT)',
      );

      // Pega o único usuário cadastrado no celular
      const usuario: any = await db.getFirstAsync(
        'SELECT nome, senha FROM perfil_usuario LIMIT 1',
      );

      if (usuario) {
        setTemUsuario(true);
        setNome(usuario.nome); // O nome fica sempre preenchido

        // Verifica a preferência de senha
        const config: any = await db.getFirstAsync(
          'SELECT valor FROM app_config WHERE chave = ?',
          ['lembrar_senha'],
        );

        if (config && config.valor === 'true') {
          setSenha(usuario.senha); // Preenche a senha se estava marcado
          setLembrarSenha(true); // Deixa o checkbox marcado
        }
      } else {
        setTemUsuario(false);
      }
    } catch (e) {
      console.log('Erro ao carregar dados salvos:', e);
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
    if (!nome.trim() || !senha) {
      setErro('Introduza o nome e a senha para entrar.');
      return;
    }
    setCarregando(true);
    try {
      const usuario: any = await db.getFirstAsync(
        'SELECT * FROM perfil_usuario WHERE nome = ? AND senha = ?',
        [nome.trim(), senha],
      );
      if (usuario) {
        // Salva a preferência do usuário sobre lembrar a senha
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

        // Passamos o ID do usuário como parâmetro para o Dashboard saber quem logou
        router.replace({
          pathname: '/dashboard',
          params: { userId: usuario.id },
        } as any);
      } else {
        setErro('Utilizador ou senha incorretos.');
      }
    } catch (e) {
      setErro('Erro ao aceder à base de dados local.');
    } finally {
      setCarregando(false);
    }
  };

  const realizarLoginBiometrico = async () => {
    try {
      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage:
            'Aceda ao MeuCorre com a sua biometria',
          fallbackLabel: 'Utilizar senha',
          disableDeviceFallback: false,
        });

      if (result.success) {
        // Rota corrigida para a pasta de abas onde está o Dashboard
        router.replace('/dashboard' as any);
      }
    } catch (e) {
      console.error('Erro na biometria:', e);
    }
  };

  const recuperarSenha = async () => {
    try {
      const usuario: any = await db.getFirstAsync(
        'SELECT nome, senha FROM perfil_usuario LIMIT 1',
      );
      if (usuario) {
        Alert.alert(
          'Sua senha',
          `Usuário: ${usuario.nome}\nSenha: ${usuario.senha}`,
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert('Sem cadastro', 'Nenhum usuário encontrado no dispositivo.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível recuperar a senha.');
    }
  };

  return {
    nome,
    setNome,
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
