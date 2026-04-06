// src/hooks/cadastro/useCadastro.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import db from '../../database/DatabaseInit';
import { validarRegrasSenha } from '../../utils/validacaoSenha';

export const useCadastro = () => {
  const router = useRouter();

  // Estados do Perfil
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  // Estados do Veículo
  const [tipoVeiculo, setTipoVeiculo] = useState<
    'moto' | 'carro' | 'bicicleta' | 'van' | 'eletrico'
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
    // 1. LIMPEZA DE DADOS (Removendo espaços invisíveis)
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();
    const confirmacaoLimpa = confirmarSenha.trim();
    const cpfLimpo = cpf.trim();

    // 2. LOGS DE DEBUG NO CONSOLE
    console.log('===== DEBUG CADASTRO =====');
    console.log(`Nome: |${nomeLimpo}|`);
    console.log(`Email: |${emailLimpo}|`);
    console.log(
      `Senha: |${senhaLimpa}| (Tamanho: ${senhaLimpa.length})`,
    );
    console.log(
      `Confirmar: |${confirmacaoLimpa}| (Tamanho: ${confirmacaoLimpa.length})`,
    );
    console.log(
      `Senhas são iguais? ${senhaLimpa === confirmacaoLimpa ? 'SIM' : 'NÃO'}`,
    );
    console.log('==========================');

    setErro(true);

    // 3. Validação de Campos Vazios
    if (
      !nomeLimpo ||
      !emailLimpo ||
      cpfLimpo.length < 14 ||
      !marca ||
      !modelo ||
      (tipoVeiculo !== 'bicicleta' && !placa) ||
      (tipoVeiculo !== 'bicicleta' && !kmAtual) ||
      !meta ||
      !aceitouTermos
    ) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos obrigatórios corretamente.',
      );
      return;
    }

    // 4. Validação de Regras de Senha (usando seu util)
    const validacao = validarRegrasSenha(senhaLimpa);
    if (!validacao.valida) {
      Alert.alert('Senha Inválida', validacao.erro);
      return;
    }

    // 5. Verificação de Igualdade (agora com valores limpos)
    if (senhaLimpa !== confirmacaoLimpa) {
      Alert.alert(
        'Atenção',
        'As senhas não coincidem. Verifique se há espaços extras.',
      );
      return;
    }

    try {
      const valorMeta = parseFloat(meta) || 0;

      // 6. Inserir Perfil
      const resultUsuario = await db.runAsync(
        `INSERT INTO perfil_usuario (nome, email, cpf, senha, foto_uri, tipo_meta, meta_diaria, meta_semanal) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          nomeLimpo,
          emailLimpo,
          cpfLimpo,
          senhaLimpa,
          foto,
          tipoMeta,
          tipoMeta === 'diaria' ? valorMeta : 0,
          tipoMeta === 'semanal' ? valorMeta : 0,
        ],
      );

      const usuarioId = resultUsuario.lastInsertRowId;

      // 7. Inserir Veículo
      await db.runAsync(
        `INSERT INTO veiculos (tipo, marca, modelo, ano, motor, placa, km_atual, ativo, id_user) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?);`,
        [
          tipoVeiculo,
          marca,
          modelo,
          parseInt(ano) || 0,
          motor,
          placa.toUpperCase().trim(),
          parseInt(kmAtual) || 0,
          usuarioId,
        ],
      );

      console.log(
        '[SUCESSO] Cadastro realizado com ID:',
        usuarioId,
      );
      router.replace('/origemganhos');
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      Alert.alert(
        'Erro',
        'Falha ao guardar os dados no banco de dados local.',
      );
    }
  };

  return {
    nome,
    setNome,
    email,
    setEmail,
    cpf,
    setCpf,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
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
