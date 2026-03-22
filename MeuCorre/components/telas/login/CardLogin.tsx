// Arquivo: src/components/telas/Login/CardLogin.tsx
// Componente: CardLogin

import {
  AlertCircle,
  Fingerprint,
  ShieldCheck,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../../styles/telas/login/components/CardLoginStyles';
import { Input } from '../../ui/inputs/Input';
interface CardLoginProps {
  nome: string;
  setNome: (text: string) => void;
  senha: string;
  setSenha: (text: string) => void;
  erro: string;
  carregando: boolean;
  biometriaDisponivel: boolean;
  onLogin: () => void;
  onBiometria: () => void;
  onNavigateCadastro: () => void;
}

export const CardLogin: React.FC<CardLoginProps> = ({
  nome,
  setNome,
  senha,
  setSenha,
  erro,
  carregando,
  biometriaDisponivel,
  onLogin,
  onBiometria,
  onNavigateCadastro,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.authLabelContainer}>
        <ShieldCheck
          size={16}
          {...({ color: '#00C853' } as any)}
        />
        <Text style={styles.authLabelText}>
          AUTENTICAÇÃO LOCAL
        </Text>
      </View>

      {erro ? (
        <View style={styles.errorBox}>
          <AlertCircle
            size={16}
            {...({ color: '#00C853' } as any)}
          />
          <Text style={styles.errorText}>{erro}</Text>
        </View>
      ) : null}

      <View style={styles.inputWrapper}>
        <Input
          label="Nome de Utilizador"
          placeholder="Ex: João Silva"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Input
          label="Senha"
          placeholder="••••••••"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.btnEntrar}
          onPress={onLogin}
          disabled={carregando}
          activeOpacity={0.8}
        >
          {carregando ? (
            <ActivityIndicator
              {...({ color: '#00C853' } as any)}
            />
          ) : (
            <Text style={styles.btnEntrarText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {biometriaDisponivel && (
          <TouchableOpacity
            style={styles.btnBiometria}
            onPress={onBiometria}
            activeOpacity={0.7}
          >
            <Fingerprint
              size={28}
              {...({ color: '#00C853' } as any)}
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.linkCadastro}
        onPress={onNavigateCadastro}
      >
        <Text style={styles.linkCadastroText}>
          Ainda não tens conta?{' '}
          <Text style={styles.linkCadastroBold}>
            Registra-te aqui
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
