import { Stack, useRouter } from 'expo-router';
import {
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { HeaderCadastro } from '../../components/telas/Cadastro/HeaderCadastro';
import { LanguageSwitcherButton } from '../../components/LanguageSwitcherButton';
import { MetasSecao } from '../../components/telas/Cadastro/MetasSecao';
import { PerfilSecao } from '../../components/telas/Cadastro/PerfilSecao';
import { RestaurarFluxoCadastro } from '../../components/telas/Cadastro/RestaurarFluxoCadastro';
import { VeiculoSecao } from '../../components/telas/Cadastro/VeiculoSecao';
import { CustomAlert } from '../../components/telas/Cadastro/CustomAlert';
import { useCadastro } from '../../hooks/cadastro/useCadastro';
import { inlineStyles } from '../../styles/generated-inline/app/(auth)/cadastroInlineStyles';
import { styles } from '../../styles/telas/Cadastro/componentes/cadastroStyles';
import { TipoVeiculo } from '../../type/typeVeiculos';

/**
 * Executa a função de cadastro screen.
 */
export default function CadastroScreen() {
  const { t } = useTranslation();
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
  } = useCadastro();

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isVisible = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    if (erro) {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, [erro]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomAlert />
      <LanguageSwitcherButton />

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={inlineStyles.inline1}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={inlineStyles.inline2}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={32}
            >
              <HeaderCadastro
                tipoVeiculo={tipoVeiculo as TipoVeiculo}
              />

              <RestaurarFluxoCadastro />

              <PerfilSecao
                nome={nome}
                setNome={setNome}
                email={email}
                setEmail={setEmail}
                cpf={cpf}
                setCpf={setCpf}
                senha={senha}
                setSenha={setSenha}
                confirmarSenha={confirmarSenha}
                setConfirmarSenha={setConfirmarSenha}
                foto={foto}
                setFoto={setFoto}
                erro={erro}
              />

              <VeiculoSecao
                tipo={tipoVeiculo as TipoVeiculo}
                setTipo={setTipoVeiculo}
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

              <Animated.View
                style={[
                  styles.footer,
                  {
                    paddingBottom: 40,
                    paddingTop: 20,
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.termosContainer}
                  activeOpacity={0.8}
                  onPress={() =>
                    setAceitouTermos(!aceitouTermos)
                  }
                  disabled={salvando}
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
                        color="#0A0A0A"
                      />
                    )}
                  </View>
                  <Text style={styles.termosText}>
                    {t('cadastro.aceito')}{' '}
                    <Text
                      style={styles.termosDestaque}
                      onPress={(event) => {
                        event.stopPropagation();
                        router.push('/(auth)/termos');
                      }}
                    >
                      {t('cadastro.termos')}
                    </Text>{' '}
                    {t('cadastro.armazenamento')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnSalvar,
                    {
                      backgroundColor:
                        aceitouTermos
                          ? '#00C853'
                          : '#222',
                    },
                  ]}
                  onPress={salvarCadastro}
                  disabled={!aceitouTermos || salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#0A0A0A" />
                  ) : (
                    <>
                      <Text style={styles.btnSalvarText}>
                        {t('cadastro.comecar')}
                      </Text>
                      <ChevronRight size={24} color="#0A0A0A" />
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>

            {salvando && (
              <View
                pointerEvents="auto"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: 'transparent',
                }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
