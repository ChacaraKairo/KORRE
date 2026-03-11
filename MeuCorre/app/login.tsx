import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

// Lógica centralizada (Crie este hook em src/hooks/useLogin.ts)
import { useLogin } from '../hooks/login/useLogin';

// Importação dos seus componentes modulares
import { HeaderLogin } from '../components/telas/login/HeaderLogin';
import { CardLogin } from '../components/telas/login/CardLogin';
import { FooterLogin } from '../components/telas/login/FooterLogin';

// Importação dos estilos centralizados
import { loginStyles as styles } from '../styles/telas/login/LoginStyles';

const LoginScreen: React.FC = () => {
  const router = useRouter();

  // Extraímos toda a inteligência do componente para o Hook
  const {
    nome,
    setNome,
    senha,
    setSenha,
    carregando,
    erro,
    biometriaDisponivel,
    bounceAnim,
    realizarLoginManual,
    realizarLoginBiometrico,
  } = useLogin();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Componente visual do topo com animação */}
            <HeaderLogin bounceAnim={bounceAnim} />

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
              onNavigateCadastro={() =>
                router.push('/cadastro')
              }
            />

            {/* Rodapé informativo */}
            <FooterLogin />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
