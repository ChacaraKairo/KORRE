// MeuCorre/app/(auth)/cadastro.tsx
import { Stack, useRouter } from 'expo-router';
import {
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
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
import { useCadastro } from '../../hooks/cadastro/useCadastro';
import { styles } from '../../styles/telas/Cadastro/componentes/cadastroStyles';

// Componentes da tela
import { HeaderCadastro } from '../../components/telas/Cadastro/HeaderCadastro';
import { MetasSecao } from '../../components/telas/Cadastro/MetasSecao';
import { PerfilSecao } from '../../components/telas/Cadastro/PerfilSecao';
import { RestaurarFluxoCadastro } from '../../components/telas/Cadastro/RestaurarFluxoCadastro';
import { VeiculoSecao } from '../../components/telas/Cadastro/VeiculoSecao';

// IMPORTAÇÃO DO ALERTA PERSONALIZADO
import { CustomAlert } from '../../components/telas/Cadastro/CustomAlert';

import { TipoVeiculo } from '../../type/typeVeiculos';

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

      {/* 1. ADICIONADO: Componente visual que renderiza o Alerta da Store (Zustand) */}
      <CustomAlert />

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
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={32}
            >
              <HeaderCadastro
                tipoVeiculo={tipoVeiculo as TipoVeiculo}
              />

              {/* O RestaurarFluxoCadastro agora conseguirá mostrar o alerta nesta tela */}
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
                        color="#0A0A0A"
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
                    Começar o Korre
                  </Text>
                  <ChevronRight size={24} color="#0A0A0A" />
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
