import React, { useRef } from 'react'; // Removido o useState daqui
import { useRouter } from 'expo-router';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';
import { Stack } from 'expo-router';

import { useCadastro } from '../../hooks/cadastro/useCadastro';
import { styles } from '../../styles/telas/Cadastro/componentes/cadastroStyles';

// Seus componentes modulares
import { HeaderCadastro } from '../../components/telas/Cadastro/HeaderCadastro';
import { PerfilSecao } from '../../components/telas/Cadastro/PerfilSecao';
import { VeiculoSecao } from '../../components/telas/Cadastro/VeiculoSecao';
import { MetasSecao } from '../../components/telas/Cadastro/MetasSecao';

export default function CadastroScreen() {
  const {
    nome,
    setNome,
    email,
    setEmail,
    cpf,
    setCpf,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha, // <-- Agora pegamos direto do Hook
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
  } = useCadastro();

  const router = useRouter();

  // Removida a linha: const [confirmarSenha, setConfirmarSenha] = useState('');
  // O erro acontecia porque você digitava no estado local daqui,
  // mas o salvarCadastro olhava para o estado vazio lá do Hook.

  // ===== CONFIGURAÇÃO DA ANIMAÇÃO DO FOOTER =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isVisible = useRef(false);

  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const {
      layoutMeasurement,
      contentOffset,
      contentSize,
    } = event.nativeEvent;
    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 450;

    if (isNearBottom && !isVisible.current) {
      isVisible.current = true;
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!isNearBottom && isVisible.current) {
      isVisible.current = false;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              <HeaderCadastro
                tipoVeiculo={tipoVeiculo as any}
              />

              <PerfilSecao
                nome={nome}
                setNome={setNome}
                email={email}
                setEmail={setEmail}
                cpf={cpf}
                setCpf={setCpf}
                senha={senha}
                setSenha={setSenha}
                confirmarSenha={confirmarSenha} // Agora sincronizado com o Hook
                setConfirmarSenha={setConfirmarSenha} // Agora sincronizado com o Hook
                foto={foto}
                setFoto={setFoto}
                erro={erro}
              />

              <VeiculoSecao
                tipo={tipoVeiculo as any}
                setTipo={setTipoVeiculo as any}
                marca={marca}
                setMarca={setMarca}
                modelo={modelo}
                setModelo={setModelo}
                ano={ano}
                setAno={setAno}
                motor={motor}
                setMotor={setMotor}
                placa={placa}
                setPlaca={setPlaca}
                km={kmAtual}
                setKm={setKmAtual}
                erro={erro}
              />

              <MetasSecao
                meta={meta}
                setMeta={setMeta}
                tipoMeta={tipoMeta}
                setTipoMeta={setTipoMeta}
                erro={erro}
              />

              {/* FOOTER ANIMADO */}
              <Animated.View
                style={[
                  styles.footer,
                  {
                    paddingBottom: 40,
                    paddingTop: 20,
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.termosContainer}
                  activeOpacity={0.8}
                  onPress={() =>
                    setAceitouTermos(!aceitouTermos)
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      aceitouTermos && styles.checkboxAtivo,
                    ]}
                  >
                    {aceitouTermos && (
                      <ShieldCheck
                        size={14}
                        {...({ color: '#0A0A0A' } as any)}
                      />
                    )}
                  </View>
                  <Text style={styles.termosText}>
                    Aceito os{' '}
                    <Text
                      style={styles.termosDestaque}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push('/termos');
                      }}
                    >
                      Termos de Uso
                    </Text>{' '}
                    e confirmo o armazenamento local.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnSalvar,
                    {
                      backgroundColor: aceitouTermos
                        ? '#00C853'
                        : '#222',
                    },
                  ]}
                  onPress={salvarCadastro}
                  disabled={!aceitouTermos}
                >
                  <Text style={styles.btnSalvarText}>
                    Começar o corre
                  </Text>
                  <ChevronRight
                    size={24}
                    {...({ color: '#0A0A0A' } as any)}
                  />
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
