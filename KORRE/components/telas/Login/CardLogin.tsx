// Arquivo: src/components/telas/login/components/CardLogin.tsx
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
  identificacao: string;
  setIdentificacao: (text: string) => void;
  senha: string;
  setSenha: (text: string) => void;
  erro: string;
  carregando: boolean;
  biometriaDisponivel: boolean;
  onLogin: () => void;
  onBiometria: () => void;
  onNavigateCadastro?: () => void;
  onEsqueciSenha?: () => void;
}

export const CardLogin: React.FC<CardLoginProps> = ({
  identificacao,
  setIdentificacao,
  senha,
  setSenha,
  erro,
  carregando,
  biometriaDisponivel,
  onLogin,
  onBiometria,
  onNavigateCadastro,
  onEsqueciSenha,
}) => {
  // Lógica de máscara dinâmica (E-mail ou CPF)
  const handleIdentificacaoChange = (text: string) => {
    const apenasNumeros = text.replace(/\D/g, '');

    // Se o texto original só tem números, pontos ou traços, e não tem '@', aplicamos a máscara de CPF
    if (
      /^[\d\.\-]*$/.test(text) &&
      apenasNumeros.length <= 11 &&
      !text.includes('@')
    ) {
      let valor = apenasNumeros;

      if (valor.length > 9) {
        valor = valor.replace(
          /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
          '$1.$2.$3-$4',
        );
      } else if (valor.length > 6) {
        valor = valor.replace(
          /(\d{3})(\d{3})(\d{1,3})/,
          '$1.$2.$3',
        );
      } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }

      setIdentificacao(valor);
    } else {
      // Se for e-mail (tiver letras ou '@'), atualiza normalmente
      setIdentificacao(text);
    }
  };

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
          label="Identificação"
          placeholder="E-mail ou CPF"
          value={identificacao}
          onChangeText={handleIdentificacaoChange}
          autoCapitalize="none"
          keyboardType="email-address"
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

      {onEsqueciSenha && (
        <TouchableOpacity
          style={[styles.linkCadastro, { marginBottom: 4 }]}
          onPress={onEsqueciSenha}
        >
          <Text style={styles.linkCadastroText}>
            <Text style={styles.linkCadastroBold}>
              Esqueci minha senha
            </Text>
          </Text>
        </TouchableOpacity>
      )}

      {onNavigateCadastro && (
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
      )}
    </View>
  );
};
