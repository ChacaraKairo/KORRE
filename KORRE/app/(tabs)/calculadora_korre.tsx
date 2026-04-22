import { Save } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// Hooks
import { useCalculadora } from '../../hooks/calculadora/useCalculadora';
import { useTema } from '../../hooks/modo_tema';

// Layout (A casca da tela)
import { CalculadoraHeader } from '../../components/telas/Calculadora/layout/CalculadoraHeader';
import { PainelResultadoFlutuante } from '../../components/telas/Calculadora/layout/PainelResultadoFlutuante';

// Sections (Os blocos do formulário)
import { SecaoCustoPessoa } from '../../components/telas/Calculadora/sections/SecaoCustoPessoa';
import { SecaoCustosAtivo } from '../../components/telas/Calculadora/sections/SecaoCustosAtivo';
import { SecaoCustosExistencia } from '../../components/telas/Calculadora/sections/SecaoCustosExistencia';
import { SecaoPatrimonio } from '../../components/telas/Calculadora/sections/SecaoPatrimonio';

// UI Genérica
import { ModalExplicativo } from '../../components/telas/Calculadora/ui/ModalExplicativo';
import { MainButton as Button } from '../../components/ui/buttons/Button'; // Mantido caso seja global

export default function CalculadoraScreen() {
  const {
    form,
    handleChange,
    calcularESalvar,
    loading,
    veiculoAtivo,
    veiculosDisponiveis,
    mudarVeiculoAtivo,
    validarStatusSecoes,
    calcularIPVAAutomatico,
  } = useCalculadora();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Estado para o Modal de Ajuda
  const [helpModal, setHelpModal] = useState({
    visible: false,
    titulo: '',
    texto: '',
  });

  const handleOpenHelp = (
    titulo: string,
    texto: string,
  ) => {
    setHelpModal({ visible: true, titulo, texto });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: isDark ? '#000' : '#FFF' },
        ]}
      >
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const status = validarStatusSecoes();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#F8F9FA' },
      ]}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : 'height'
        }
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <CalculadoraHeader
            veiculoAtivo={veiculoAtivo}
            veiculosDisponiveis={veiculosDisponiveis}
            onMudarVeiculo={mudarVeiculoAtivo}
            percentualCompletude={
              status.percentualGeral || 0
            }
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.formContainer}>
              <SecaoPatrimonio
                form={form}
                onChange={handleChange}
                onHelp={handleOpenHelp}
                isComplete={
                  !!form.valor_veiculo_fipe &&
                  !!form.custo_oportunidade_selic
                }
              />

              <SecaoCustosAtivo
                form={form}
                onChange={handleChange}
                onHelp={handleOpenHelp}
                isComplete={status.operacaoCompleta}
              />

              <SecaoCustosExistencia
                form={form}
                onChange={handleChange}
                onHelp={handleOpenHelp}
                onCalcularIPVA={calcularIPVAAutomatico}
                isComplete={status.burocraciaCompleta}
              />

              <SecaoCustoPessoa
                form={form}
                onChange={handleChange}
                onHelp={handleOpenHelp}
                isComplete={status.humanoCompleto}
              />

              <View style={styles.buttonWrapper}>
                <Button
                  title="SALVAR AUDITORIA"
                  onPress={calcularESalvar}
                  icon={Save}
                />
              </View>
            </View>
          </ScrollView>

          <PainelResultadoFlutuante
            form={form}
            veiculoTipo={veiculoAtivo?.tipo || 'carro'}
          />
        </View>
      </KeyboardAvoidingView>

      <ModalExplicativo
        visible={helpModal.visible}
        titulo={helpModal.titulo}
        textoExplicativo={helpModal.texto}
        onClose={() =>
          setHelpModal({ ...helpModal, visible: false })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { paddingBottom: 120 }, // Espaço para o Painel Flutuante
  formContainer: { padding: 20, gap: 8 },
  buttonWrapper: { marginTop: 10, marginBottom: 20 },
});
