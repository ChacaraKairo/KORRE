// src/hooks/useCadastro.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';

export const useCadastro = () => {
  const router = useRouter();

  // Estados do Perfil
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  // Estados do Veículo
  const [tipoVeiculo, setTipoVeiculo] = useState<
    'moto' | 'carro' | 'caminhao' | 'van'
  >('moto');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [motor, setMotor] = useState('');
  const [placa, setPlaca] = useState('');
  const [kmAtual, setKmAtual] = useState('');

  // Estados de Metas e Termos
  const [meta, setMeta] = useState('');
  const [tipoMeta, setTipoMeta] = useState<
    'diaria' | 'semanal'
  >('diaria');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState(false);

  const salvarCadastro = async () => {
    setErro(true);

    if (
      !nome ||
      senha.length < 4 ||
      !marca ||
      !modelo ||
      !placa ||
      !kmAtual ||
      !meta ||
      !aceitouTermos
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos obrigatórios.',
      );
      return;
    }

    try {
      const valorMeta = parseFloat(meta) || 0;

      // 1. Inserir Perfil
      await db.runAsync(
        `INSERT INTO perfil_usuario (nome, senha, foto_uri, tipo_meta, meta_diaria, meta_semanal) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          nome.trim(),
          senha,
          foto,
          tipoMeta,
          tipoMeta === 'diaria' ? valorMeta : 0,
          tipoMeta === 'semanal' ? valorMeta : 0,
        ],
      );

      // 2. Inserir Veículo
      await db.runAsync(
        `INSERT INTO veiculos (tipo, marca, modelo, ano, motor, placa, km_atual, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, 1);`,
        [
          tipoVeiculo,
          marca,
          modelo,
          parseInt(ano) || 0,
          motor,
          placa.toUpperCase(),
          parseInt(kmAtual) || 0,
        ],
      );

      router.replace('/'); // Rota do Expo Router
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Falha ao guardar os dados.');
    }
  };

  return {
    nome,
    setNome,
    senha,
    setSenha,
    foto,
    setFoto,
    tipoVeiculo,
    setTipoVeiculo,
    marca,
    setMarca,
    modelo,
    setModelo,
    ano,
    setAno,
    motor,
    setMotor,
    placa,
    setPlaca,
    kmAtual,
    setKmAtual,
    meta,
    setMeta,
    tipoMeta,
    setTipoMeta,
    aceitouTermos,
    setAceitouTermos,
    erro,
    salvarCadastro,
  };
};
