import React from 'react';
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
    senha,
    setSenha,
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
            >
              {/* TODO: Atualizar tipagem interna do HeaderCadastro para aceitar 'caminhao' | 'van' */}
              <HeaderCadastro
                tipoVeiculo={tipoVeiculo as any}
              />

              <PerfilSecao
                nome={nome}
                setNome={setNome}
                senha={senha}
                setSenha={setSenha}
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
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.termosContainer}
                activeOpacity={0.8}
                onPress={() =>
                  setAceitouTermos(!aceitouTermos)
                } // Clicar na linha toda marca o check
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
                      e.stopPropagation(); // Evita que o clique no texto marque o checkbox sem querer
                      router.push('/termos'); // <-- Redireciona para a tela de Termos
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
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
