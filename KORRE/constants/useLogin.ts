import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import db from '../database/';

export const useLogin = () => {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [biometriaDisponivel, setBiometriaDisponivel] =
    useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkDeviceForHardware();
    // Inicia sua animação de bounce aqui (startBounce)
  }, []);

  const realizarLoginManual = async () => {
    setErro('');
    if (!nome.trim() || !senha) {
      setErro('Introduza o nome e a senha para entrar.');
      return;
    }
    setCarregando(true);
    try {
      const usuario = await db.getFirstAsync(
        'SELECT * FROM perfil_usuario WHERE nome = ? AND senha = ?',
        [nome.trim(), senha],
      );
      if (usuario) {
        router.replace('/dashboard');
      } else {
        setErro('Utilizador ou senha incorretos.');
      }
    } catch (e) {
      setErro('Erro ao aceder à base de dados local.');
    } finally {
      setCarregando(false);
    }
  };

  return {
    nome,
    setNome,
    senha,
    setSenha,
    erro,
    carregando,
    biometriaDisponivel,
    bounceAnim,
    realizarLoginManual,
  };
};
