import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { safeBack } from '../../utils/navigation/safeBack';
import { useRouter } from 'expo-router';
import { AppRoutes } from '../../constants/routes';
import { useRecuperarSenha } from '../../hooks/login/useRecuperarSenha';

/**
 * Executa a função de recuperar senha screen.
 */
export default function RecuperarSenhaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    checkBiometria,
    confirmarSenha,
    cpf,
    email,
    erro,
    hasBiometria,
    loading,
    novaSenha,
    placa,
    recuperarComBiometria,
    recuperarComDados,
    setConfirmarSenha,
    setCpf,
    setEmail,
    setNovaSenha,
    setPlaca,
  } = useRecuperarSenha();

  useEffect(() => {
    void checkBiometria();
  }, [checkBiometria]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#0A0A0A',
        padding: 20,
        gap: 14,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        onPress={() => safeBack(router, AppRoutes.login)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: '#00C853', fontWeight: '800' }}>
          {t('common.voltar')}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 24,
          fontWeight: '900',
          marginTop: 8,
        }}
      >
        {t('recuperar_senha.title')}
      </Text>
      <Text style={{ color: '#A0A0A0' }}>
        {t('recuperar_senha.subtitle')}
      </Text>

      {hasBiometria && (
        <TouchableOpacity
          disabled={loading}
          onPress={recuperarComBiometria}
          style={{
            backgroundColor: '#00C853',
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ color: '#0A0A0A', fontWeight: '900' }}>
            {t('recuperar_senha.biometria_action')}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={{ color: '#C5C5C5', marginTop: 8 }}>
        {t('recuperar_senha.fallback_title')}
      </Text>

      <TextInput
        placeholder={t('recuperar_senha.email')}
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
        value={email}
        onChangeText={setEmail}
        style={inputStyle}
      />
      <TextInput
        placeholder={t('recuperar_senha.cpf')}
        placeholderTextColor="#666"
        keyboardType="numeric"
        editable={!loading}
        value={cpf}
        onChangeText={setCpf}
        style={inputStyle}
      />
      <TextInput
        placeholder={t('recuperar_senha.placa')}
        placeholderTextColor="#666"
        autoCapitalize="characters"
        editable={!loading}
        value={placa}
        onChangeText={setPlaca}
        style={inputStyle}
      />
      <TextInput
        placeholder={t('recuperar_senha.new_password')}
        placeholderTextColor="#666"
        secureTextEntry
        editable={!loading}
        value={novaSenha}
        onChangeText={setNovaSenha}
        style={inputStyle}
      />
      <TextInput
        placeholder={t('recuperar_senha.confirm_password')}
        placeholderTextColor="#666"
        secureTextEntry
        editable={!loading}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        style={inputStyle}
      />

      {!!erro && (
        <Text style={{ color: '#F87171', fontWeight: '700' }}>
          {erro}
        </Text>
      )}

      <TouchableOpacity
        disabled={loading}
        onPress={recuperarComDados}
        style={{
          backgroundColor: '#1A1A1A',
          borderWidth: 1,
          borderColor: '#2E2E2E',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#00C853" />
        ) : (
          <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>
            {t('recuperar_senha.reset_action')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const inputStyle = {
  backgroundColor: '#141414',
  borderColor: '#262626',
  borderWidth: 1,
  borderRadius: 10,
  color: '#FFF',
  paddingHorizontal: 12,
  paddingVertical: 11,
} as const;
