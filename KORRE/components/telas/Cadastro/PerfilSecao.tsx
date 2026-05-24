// Arquivo: src/components/telas/Cadastro/PerfilSecao.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  User,
  Camera,
  X,
  Lock,
  Eye,
  EyeOff,
  Mail,
  CreditCard,
} from 'lucide-react-native';
import { Input } from '../../ui/inputs/Input';
import { styles } from '../../../styles/telas/Cadastro/componentes/cadastroStyles';
import { PhotoService } from './script/photoService';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';
import { validarRegrasSenha } from '../../../utils/validacaoSenha'; import { localStyles } from '../../../styles/generated/components/telas/Cadastro/PerfilSecaoStyles';
// Importe seu utilitário

interface PerfilProps {
  nome: string;
  setNome: (t: string) => void;
  email: string;
  setEmail: (t: string) => void;
  cpf: string;
  setCpf: (t: string) => void;
  senha: string;
  setSenha: (t: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (t: string) => void;
  foto: string | null;
  setFoto: (uri: string | null) => void;
  erro: boolean;
}

export const PerfilSecao: React.FC<PerfilProps> = ({
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
  erro,
}) => {
  const { t } = useTranslation();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  /**
   * Executa a função de handle take action.
   */
  const handleTakeAction = async () => {
    try {
      const savedUri = await PhotoService.takePhoto(foto);
      if (savedUri) setFoto(savedUri);
    } catch (error: any) {
      showCustomAlert(
        t('common.erro'),
        error.message ||
          t('cadastro.foto_erro', 'Nao foi possivel capturar a foto.'),
      );
    }
  };

  /**
   * Executa a função de handle cpf change.
   */
  const handleCpfChange = (texto: string) => {
    let formatado = texto.replace(/\D/g, '');
    formatado = formatado.replace(/(\d{3})(\d)/, '$1.$2');
    formatado = formatado.replace(/(\d{3})(\d)/, '$1.$2');
    formatado = formatado.replace(
      /(\d{3})(\d{1,2})$/,
      '$1-$2',
    );
    setCpf(formatado);
  };

  // Validação em tempo real para o estilo de erro
  const senhaInvalida =
    erro && !validarRegrasSenha(senha).valida;
  const senhasDiferentes = erro && senha !== confirmarSenha;

  return (
    <View style={styles.card}>
      <View style={localStyles.sectionTitleRow}>
        <User size={18} color="#00C853" />
        <Text style={styles.labelSecao}>
          {t('cadastro.dados_piloto', 'DADOS DO PILOTO')}
        </Text>
      </View>

      {/* FOTO DE PERFIL */}
      <View style={localStyles.photoContainer}>
        <View style={localStyles.avatarWrapper}>
          <TouchableOpacity
            style={localStyles.avatar}
            onPress={handleTakeAction}
            activeOpacity={0.8}
          >
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={localStyles.avatarImg}
                key={foto}
              />
            ) : (
              <User size={40} color="#252525" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={localStyles.btnSmallCamera}
            onPress={handleTakeAction}
          >
            <Camera size={14} color="#0A0A0A" />
          </TouchableOpacity>
          {foto && (
            <TouchableOpacity
              style={localStyles.btnRemovePhoto}
              onPress={() => setFoto(null)}
            >
              <X size={14} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Input
        label={t('cadastro.nome_usuario', 'Nome de usuario')}
        placeholder={t('cadastro.nome_placeholder', 'Ex: Joao Silva')}
        value={nome}
        onChangeText={(t) => setNome(t.toUpperCase())}
        autoCapitalize="characters"
        Icone={User}
        erro={erro && nome.length < 3}
      />

      <Input
        label={t('cadastro.email', 'E-mail')}
        placeholder="seu@email.com"
        value={email}
        onChangeText={(t) =>
          setEmail(t.toLowerCase().trim())
        }
        keyboardType="email-address"
        autoCapitalize="none"
        Icone={Mail}
        erro={
          erro && (!email.includes('@') || email.length < 5)
        }
      />

      <Input
        label={t('cadastro.cpf_opcional', 'CPF (opcional)')}
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={handleCpfChange}
        keyboardType="numeric"
        maxLength={14}
        Icone={CreditCard}
        erro={erro && cpf.length > 0 && cpf.length < 14}
      />

      {/* CAMPO 1: CRIAR SENHA */}
      <View style={localStyles.inputWrapper}>
        <Input
          label={t('cadastro.crie_senha', 'Crie uma senha')}
          placeholder="••••••••"
          value={senha}
          onChangeText={(t) => setSenha(t.trim())} // Impede espaços acidentais
          secureTextEntry={!mostrarSenha}
          Icone={Lock}
          erro={senhaInvalida}
        />
        <TouchableOpacity
          style={localStyles.iconeOlho}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          {mostrarSenha ? (
            <EyeOff size={24} color="#888" />
          ) : (
            <Eye size={24} color="#888" />
          )}
        </TouchableOpacity>
        <Text
          style={[
            localStyles.helperText,
            senhaInvalida && { color: '#EF4444' },
          ]}
        >
          {t('cadastro.senha_regra', '* Minimo de 7 caracteres, com letras e numeros.')}
        </Text>
      </View>

      {/* CAMPO 2: CONFIRMAR SENHA */}
      <View style={localStyles.inputWrapper}>
        <Input
          label={t('cadastro.confirme_senha', 'Confirme sua senha')}
          placeholder="••••••••"
          value={confirmarSenha}
          onChangeText={(t) => setConfirmarSenha(t.trim())} // Impede espaços acidentais
          secureTextEntry={true}
          Icone={Lock}
          erro={senhasDiferentes}
        />
        {senhasDiferentes && (
          <Text style={localStyles.errorText}>
            {t('cadastro.senhas_nao_coincidem', 'As senhas nao coincidem.')}
          </Text>
        )}
      </View>
    </View>
  );
};


