import { useRouter } from 'expo-router';
import { Check, Fuel } from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Lógica centralizada (Crie este hook em src/hooks/useLogin.ts)
import { useLogin } from '../../hooks/login/useLogin';

// Importação dos seus componentes modulares
import { CardLogin } from '../../components/telas/Login/CardLogin';
import { FooterLogin } from '../../components/telas/Login/FooterLogin';

// Importação dos estilos centralizados
import { loginStyles as styles } from '../../styles/telas/login/LoginStyles';

const LoginScreen: React.FC = () => {
  const router = useRouter();

  // Extraímos toda a inteligência do componente para o Hook
  const {
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
  } = useLogin();

  return (
    <View style={styles.container}>
      {/* Botão Calculadora Flex (Topo Direito) */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          zIndex: 50,
          backgroundColor: '#161616',
          padding: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#333',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() =>
          router.push({
            pathname: '/calculadora',
            params: { origem: 'login' },
          } as any)
        }
        activeOpacity={0.7}
      >
        <Fuel size={24} color="#00C853" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo do App com animação (Substituindo o HeaderLogin antigo) */}
          <Animated.View
            style={{
              alignItems: 'center',
              marginTop: 60,
              marginBottom: 30,
              transform: [{ translateY: bounceAnim }],
            }}
          >
            <Image
              source={require('../../assets/images/android-icon-foreground.png')}
              style={{ width: 220, height: 220 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: '#888',
                fontSize: 16,
                marginTop: -40,
                fontWeight: '500',
              }}
            >
              Você nas ruas, nós no seu bolso.
            </Text>
          </Animated.View>

          {/* O "Coração" do Login com os inputs e ações */}
          <CardLogin
            nome={nome}
            setNome={setNome}
            senha={senha}
            setSenha={setSenha}
            erro={erro}
            carregando={carregando}
            biometriaDisponivel={biometriaDisponivel}
            onLogin={realizarLoginManual}
            onBiometria={realizarLoginBiometrico}
            onNavigateCadastro={
              !temUsuario
                ? () => router.push('/cadastro')
                : (undefined as any)
            }
          />

          {/* Checkbox de Lembrar Senha */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 20,
            }}
            onPress={() => setLembrarSenha(!lembrarSenha)}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: '#00C853',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                backgroundColor: lembrarSenha
                  ? '#00C853'
                  : 'transparent',
              }}
            >
              {lembrarSenha && (
                <Check
                  size={14}
                  color="#0A0A0A"
                  strokeWidth={3}
                />
              )}
            </View>
            <Text
              style={{ color: '#888', fontWeight: 'bold' }}
            >
              Lembrar minha senha
            </Text>
          </TouchableOpacity>

          {/* Rodapé informativo */}
          <FooterLogin />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
