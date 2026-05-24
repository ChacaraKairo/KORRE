import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import db from '../../database/DatabaseInit';
import { validarRegrasSenha } from '../../utils/validacaoSenha';
import { validarCPF } from '../../utils/validacaoCpf';
import { TipoVeiculo } from '../../type/typeVeiculos';
import { VeiculoService } from './veiculoService';
import { hashPassword } from '../../utils/auth/passwordHash';
import { AppRoutes } from '../../constants/routes';
import { logger } from '../../utils/logger';
import { waitForUiFeedback } from '../../utils/ui/waitForUiFeedback';
import { setAuthSession } from '../../utils/auth/authSession';
import { FuelEntryService } from '../../modules/fuel/application/FuelEntryService';

export const useCadastro = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  const [tipoVeiculo, setTipoVeiculo] =
    useState<TipoVeiculo>('moto');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [motor, setMotor] = useState('');
  const [placa, setPlaca] = useState('');
  const [kmAtual, setKmAtual] = useState('');

  const [meta, setMeta] = useState('');
  const [tipoMeta, setTipoMeta] = useState<
    'diaria' | 'semanal'
  >('diaria');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const salvarCadastro = async () => {
    if (salvando) return;

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();
    const confirmacaoLimpa = confirmarSenha.trim();
    const cpfLimpo = cpf.trim();

    setErro(true);

    if (
      !nomeLimpo ||
      !emailLimpo ||
      !marca ||
      !modelo ||
      (tipoVeiculo !== 'bicicleta' && !placa) ||
      (tipoVeiculo !== 'bicicleta' && !kmAtual) ||
      !meta ||
      !aceitouTermos
    ) {
      Alert.alert(
        t('common.atencao'),
        t('cadastro.preencha_obrigatorios'),
      );
      return;
    }

    if (cpfLimpo) {
      const validacaoCpf = validarCPF(cpfLimpo);
      if (!validacaoCpf.valida) {
        Alert.alert(
          t('cadastro.cpf_invalido'),
          validacaoCpf.erro ?? t('cadastro.cpf_invalido_msg'),
        );
        return;
      }
    }

    const validacaoSenha = validarRegrasSenha(senhaLimpa);
    if (!validacaoSenha.valida) {
      Alert.alert(
        t('cadastro.senha_invalida'),
        validacaoSenha.erro ?? t('cadastro.senha_invalida_msg'),
      );
      return;
    }

    if (senhaLimpa !== confirmacaoLimpa) {
      Alert.alert(
        t('common.atencao'),
        t('cadastro.senhas_nao_coincidem'),
      );
      return;
    }

    try {
      setSalvando(true);
      await waitForUiFeedback();

      const valorMeta = parseFloat(meta) || 0;
      const senhaCriptografada = await hashPassword(senhaLimpa);

      const resultUsuario = await db.runAsync(
        `INSERT INTO perfil_usuario (nome, email, cpf, senha, foto_uri, tipo_meta, meta_diaria, meta_semanal) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          nomeLimpo,
          emailLimpo,
          cpfLimpo || null,
          senhaCriptografada,
          foto,
          tipoMeta,
          tipoMeta === 'diaria' ? valorMeta : 0,
          tipoMeta === 'semanal' ? valorMeta : 0,
        ],
      );

      const usuarioId = resultUsuario.lastInsertRowId;
      setAuthSession(usuarioId);

      await VeiculoService.inserirVeiculo({
        tipo: tipoVeiculo,
        marca,
        modelo,
        ano,
        motor,
        placa,
        km_atual: parseInt(kmAtual) || 0,
        ativo: 1,
        id_user: usuarioId,
      });

      const pendentes = await FuelEntryService.contarPendentesSemLogin();
      if (pendentes > 0) {
        const veiculo = await db.getFirstAsync<{ id: number }>(
          'SELECT id FROM veiculos WHERE id_user = ? ORDER BY id DESC LIMIT 1',
          [usuarioId],
        );
        if (veiculo?.id) {
          await FuelEntryService.vincularPendentesAoVeiculo(
            veiculo.id,
          );
        }
      }

      router.replace(AppRoutes.origemGanhos);
    } catch (error) {
      logger.error('Erro ao salvar no banco:', error);
      Alert.alert(
        t('common.erro'),
        t('cadastro.erro_salvar_banco'),
      );
    } finally {
      setSalvando(false);
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
    salvando,
    salvarCadastro,
  };
};
