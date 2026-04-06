// Arquivo: src/components/telas/Cadastro/PerfilSecao.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
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
import { validarRegrasSenha } from '../../../utils/validacaoSenha'; // Importe seu utilitário

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
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleTakeAction = async () => {
    try {
      const savedUri = await PhotoService.takePhoto(foto);
      if (savedUri) setFoto(savedUri);
    } catch (error: any) {
      showCustomAlert(
        'Erro',
        error.message ||
          'Não foi possível capturar a foto.',
      );
    }
  };

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
          DADOS DO PILOTO
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
        label="Nome de Usuário"
        placeholder="Ex: João Silva"
        value={nome}
        onChangeText={(t) => setNome(t.toUpperCase())}
        autoCapitalize="characters"
        Icone={User}
        erro={erro && nome.length < 3}
      />

      <Input
        label="E-mail"
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
        label="CPF"
        placeholder="000.000.000-00"
        value={cpf}
        onChangeText={handleCpfChange}
        keyboardType="numeric"
        maxLength={14}
        Icone={CreditCard}
        erro={erro && cpf.length < 14}
      />

      {/* CAMPO 1: CRIAR SENHA */}
      <View style={localStyles.inputWrapper}>
        <Input
          label="Crie uma Senha"
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
          * Mínimo de 7 caracteres, com letras e números.
        </Text>
      </View>

      {/* CAMPO 2: CONFIRMAR SENHA */}
      <View style={localStyles.inputWrapper}>
        <Input
          label="Confirme sua Senha"
          placeholder="••••••••"
          value={confirmarSenha}
          onChangeText={(t) => setConfirmarSenha(t.trim())} // Impede espaços acidentais
          secureTextEntry={true}
          Icone={Lock}
          erro={senhasDiferentes}
        />
        {senhasDiferentes && (
          <Text style={localStyles.errorText}>
            As senhas não coincidem.
          </Text>
        )}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginVertical: 10,
    marginBottom: 20,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00C853',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  btnSmallCamera: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00C853',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#161616',
  },
  btnRemovePhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#161616',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconeOlho: {
    position: 'absolute',
    right: 16,
    top: 38,
    zIndex: 10,
    padding: 4,
  },
  helperText: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
