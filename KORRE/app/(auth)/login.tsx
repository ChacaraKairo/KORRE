import { useRouter } from 'expo-router';
import { Check, Fuel } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CardLogin } from '../../components/telas/Login/CardLogin';
import { FooterLogin } from '../../components/telas/Login/FooterLogin';
import { LanguageSwitcherButton } from '../../components/LanguageSwitcherButton';
import { OfficialLinksBanner } from '../../components/OfficialLinksBanner';
import { useLogin } from '../../hooks/login/useLogin';
import { loginStyles as styles } from '../../styles/telas/login/LoginStyles';
import { AppRoutes } from '../../constants/routes';
import { setReturnRoute } from '../../utils/navigation/returnRoute';

import { inlineStyles } from '../../styles/generated-inline/app/(auth)/loginInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/(auth)/loginDynamicStyles';
const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    identificacao,
    setIdentificacao,
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
      <View style={inlineStyles.inline0}>
        <LanguageSwitcherButton style={inlineStyles.inline7} />
        <TouchableOpacity
          style={inlineStyles.inline1}
          onPress={() => {
            setReturnRoute(AppRoutes.login);
            router.push(AppRoutes.calculadora);
          }}
          activeOpacity={0.7}
        >
          <Fuel size={24} color="#00C853" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={inlineStyles.inline2}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={dynamicInlineStyles.inline1({ bounceAnim })}
          >
            <Image
              source={require('../../assets/images/favicon.png')}
              style={inlineStyles.inline3}
              resizeMode="contain"
            />
            <Text
              style={inlineStyles.inline4}
            >
              {t('login.tagline')}
            </Text>
          </Animated.View>

          <CardLogin
            identificacao={identificacao}
            setIdentificacao={setIdentificacao}
            senha={senha}
            setSenha={setSenha}
            erro={erro}
            carregando={carregando}
            biometriaDisponivel={biometriaDisponivel}
            onLogin={realizarLoginManual}
            onBiometria={realizarLoginBiometrico}
            onEsqueciSenha={
              temUsuario
                ? () => router.push(AppRoutes.recuperarSenha)
                : undefined
            }
            onNavigateCadastro={
              !temUsuario
                ? () => router.push('/(auth)/cadastro')
                : undefined
              }
          />

          <TouchableOpacity
            style={inlineStyles.inline5}
            onPress={() => setLembrarSenha(!lembrarSenha)}
            activeOpacity={0.7}
          >
            <View
              style={dynamicInlineStyles.inline2({ lembrarSenha })}
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
              style={inlineStyles.inline6}
            >
              {t('login.lembrar_identificacao')}
            </Text>
          </TouchableOpacity>

          <OfficialLinksBanner isDark compact />

          <FooterLogin />
        </ScrollView>
      </KeyboardAvoidingView>

      {carregando && (
        <View
          pointerEvents="auto"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.08)',
          }}
        >
          <View
            style={{
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: '#161616',
              borderWidth: 1,
              borderColor: '#222',
            }}
          >
            <ActivityIndicator color="#00C853" />
          </View>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
