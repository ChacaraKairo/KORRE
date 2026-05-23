import {
  Save } from 'lucide-react-native';
import React,
  { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';

import { styles } from '../../styles/generated/app/(tabs)/calculadora_korreStyles';
import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/calculadora_korreInlineStyles';
import {
  CalculadoraHeader,
  ModalExplicativo,
  PainelResultadoFlutuante,
  SecaoComposicaoCustoKm,
  SecaoCustoPessoa,
  SecaoCustosAtivo,
  SecaoCustosExistencia,
  SecaoPatrimonio,
  useIndicesKorreForm,
} from '../../modules/indicesKorre';
import { useTema } from '../../hooks/modo_tema';

// Layout (A casca da tela)

// Sections (Os blocos do formulário)

// UI Genérica
import { MainButton as Button } from '../../components/ui/buttons/Button'; // Mantido caso seja global

export default function CalculadoraScreen() {
  const { t } = useTranslation();
  const {
    form,
    handleChange,
    calcularESalvar,
    loading,
    veiculoAtivo,
    veiculosDisponiveis,
    breakdownKm,
    avisosKm,
    mudarVeiculoAtivo,
    validarStatusSecoes,
    calcularIPVAAutomatico,
  } = useIndicesKorreForm();

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
        style={inlineStyles.inline1}
      >
        <View style={inlineStyles.inline2}>
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

              <SecaoComposicaoCustoKm
                breakdown={breakdownKm}
                avisos={avisosKm}
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
                  title={t('calculadora.salvar_auditoria')}
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


