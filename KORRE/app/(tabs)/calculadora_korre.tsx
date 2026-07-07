import { useRouter } from 'expo-router';
import { Route, Save } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CalculadoraHeader,
  CalculadoraTempo,
  ModalExplicativo,
  SecaoComposicaoCustoKm,
  SecaoCustoPessoa,
  SecaoCustosAtivo,
  SecaoCustosExistencia,
  SecaoPatrimonio,
  useIndicesKorreForm,
} from '../../modules/indicesKorre';
import {
  getIndicesSteps,
  hasNegativeIndexValue,
  IndicesFormMode,
  IndicesFormStep,
  validateIndicesStep,
} from '../../modules/indicesKorre/domain/indicesFormWorkflow';
import { IndicesIntroCard } from '../../components/indices/IndicesIntroCard';
import { IndicesModeSelector } from '../../components/indices/IndicesModeSelector';
import { IndicesStepProgress } from '../../components/indices/IndicesStepProgress';
import { IndicesSuggestionCard } from '../../components/indices/IndicesSuggestionCard';
import { IndicesSummaryCard } from '../../components/indices/IndicesSummaryCard';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { BackButton } from '../../components/ui/BackButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTema } from '../../hooks/modo_tema';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';
import { AppRoutes } from '../../constants/routes';
import { tokens } from '../../styles/tokens';

export default function CalculadoraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
    verSugestoes,
    aplicarSugestoes,
    ignorarSugestoes,
    previewSugestoes,
    carregandoSugestoes,
    sugestoesAplicadas,
    sugestoesIgnoradas,
    sugestoesRevisao,
    resumoSugestoes,
    setSugestoesRevisao,
  } = useIndicesKorreForm();

  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const [mode, setMode] = useState<IndicesFormMode>('simple');
  const [step, setStep] = useState<IndicesFormStep>('intro');
  const [helpModal, setHelpModal] = useState({
    visible: false,
    titulo: '',
    texto: '',
  });

  const steps = useMemo(() => getIndicesSteps(mode), [mode]);
  const currentStepIndex = Math.max(steps.indexOf(step), 0);
  const status = validarStatusSecoes();

  const tempo = CalculadoraTempo.calcularCustoMinuto(form as any);
  const custoKm = breakdownKm
    ? Object.values(breakdownKm).reduce((sum, value) => sum + Number(value || 0), 0)
    : 0;

  const textColor = isDark ? tokens.palette.white : tokens.palette.surface900;
  const mutedColor = isDark ? tokens.palette.surface300 : tokens.palette.surface400;

  const goToStep = (target: IndicesFormStep) => {
    setStep(target);
  };

  const goNext = () => {
    const erros = validateIndicesStep(step, form);
    if (hasNegativeIndexValue(form)) {
      showCustomAlert(
        t('common.atencao'),
        t('indices.validation.positive'),
      );
      return;
    }
    if (erros.length > 0) {
      showCustomAlert(
        t('common.atencao'),
        t('indices.validation.required'),
      );
      return;
    }

    const next = steps[currentStepIndex + 1];
    if (next) {
      setStep(next);
    }
  };

  const goBackStep = () => {
    const previous = steps[currentStepIndex - 1];
    if (previous) {
      setStep(previous);
    }
  };

  const handleOpenHelp = (titulo: string, texto: string) => {
    setHelpModal({ visible: true, titulo, texto });
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });

  const suggestionLines =
    previewSugestoes?.sugestoesAplicadas.slice(0, 5).map((sugestao) => ({
      label: String(sugestao.campo).replace(/_/g, ' '),
      detail: `${t(`calculadora.fontes_sugestao.${sugestao.fonte}`)} · ${t(
        'calculadora.confianca_sugestao',
        {
          confianca: t(`calculadora.confiancas.${sugestao.confianca}`),
        },
      )}`,
    })) ?? [];

  if (loading) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: isDark ? tokens.palette.black : tokens.palette.white },
        ]}
      >
        <ActivityIndicator size="large" color={tokens.palette.brand} />
        <Text style={[styles.loadingText, { color: mutedColor }]}>
          {t('common.loading_local')}
        </Text>
      </View>
    );
  }

  if (!veiculoAtivo) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? tokens.palette.black : tokens.palette.surface100 },
        ]}
      >
        <View style={styles.topBar}>
          <BackButton fallback={AppRoutes.dashboard} isDark={isDark} />
        </View>
        <EmptyState
          title={t('indices.empty.noVehicle')}
          description={t('indices.empty.noVehicleDescription')}
          actionLabel={t('indices.empty.registerVehicle')}
          onAction={() => router.push(AppRoutes.garagem)}
          isDark={isDark}
        />
      </SafeAreaView>
    );
  }

  const renderIntro = () => (
    <View style={styles.stepContent}>
      <IndicesIntroCard
        isDark={isDark}
        title={t('indices.intro.title')}
        description={t('indices.intro.description')}
        items={[
          {
            icon: 'km',
            title: t('indices.intro.kmTitle'),
            description: t('indices.intro.kmDescription'),
          },
          {
            icon: 'minute',
            title: t('indices.intro.minuteTitle'),
            description: t('indices.intro.minuteDescription'),
          },
          {
            icon: 'goal',
            title: t('indices.intro.goalTitle'),
            description: t('indices.intro.goalDescription'),
          },
        ]}
      />
      <AppButton
        title={t('indices.intro.start')}
        isDark={isDark}
        onPress={() => goToStep('mode')}
      />
    </View>
  );

  const renderMode = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: textColor }]}>
        {t('indices.mode.title')}
      </Text>
      <Text style={[styles.stepDescription, { color: mutedColor }]}>
        {t('indices.mode.description')}
      </Text>
      <IndicesModeSelector
        isDark={isDark}
        value={mode}
        onChange={(value) => {
          setMode(value);
          if (value === 'simple' && step === 'advanced') {
            setStep('basic');
          }
        }}
        options={[
          {
            mode: 'simple',
            title: t('indices.mode.simple.title'),
            description: t('indices.mode.simple.description'),
          },
          {
            mode: 'advanced',
            title: t('indices.mode.advanced.title'),
            description: t('indices.mode.advanced.description'),
          },
        ]}
      />
      <SuggestionArea />
    </View>
  );

  const SuggestionArea = () => (
    <IndicesSuggestionCard
      isDark={isDark}
      title={t('indices.suggestion.title')}
      description={t('indices.suggestion.description')}
      status={
        previewSugestoes
          ? previewSugestoes.sugestoesAplicadas.length > 0
            ? t('indices.suggestion.available')
            : t('indices.empty.noDataForSuggestion')
          : undefined
      }
      lines={suggestionLines}
      loading={carregandoSugestoes}
      onView={() => void verSugestoes()}
      onApply={
        previewSugestoes && previewSugestoes.sugestoesAplicadas.length > 0
          ? () => void aplicarSugestoes()
          : undefined
      }
      onIgnore={previewSugestoes ? ignorarSugestoes : undefined}
      viewLabel={t('indices.suggestion.view')}
      applyLabel={t('indices.suggestion.apply')}
      ignoreLabel={t('indices.suggestion.ignore')}
    />
  );

  const renderBasic = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: textColor }]}>
        {t('indices.basic.title')}
      </Text>
      <Text style={[styles.stepDescription, { color: mutedColor }]}>
        {t('indices.basic.description')}
      </Text>
      <SecaoCustosAtivo
        form={form}
        onChange={handleChange}
        onHelp={handleOpenHelp}
        isComplete={status.operacaoCompleta}
      />
      <SecaoComposicaoCustoKm breakdown={breakdownKm} avisos={avisosKm} />
      {mode === 'simple' ? (
        <SecaoCustoPessoa
          form={form}
          onChange={handleChange}
          onHelp={handleOpenHelp}
          isComplete={status.humanoCompleto}
        />
      ) : null}
    </View>
  );

  const renderAdvanced = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: textColor }]}>
        {t('indices.advanced.title')}
      </Text>
      <Text style={[styles.stepDescription, { color: mutedColor }]}>
        {t('indices.advanced.description')}
      </Text>
      <SecaoCustoPessoa
        form={form}
        onChange={handleChange}
        onHelp={handleOpenHelp}
        isComplete={status.humanoCompleto}
      />
      <SecaoPatrimonio
        form={form}
        onChange={handleChange}
        onHelp={handleOpenHelp}
        isComplete={!!form.valor_veiculo_fipe && !!form.custo_oportunidade_selic}
      />
      <SecaoCustosExistencia
        form={form}
        onChange={handleChange}
        onHelp={handleOpenHelp}
        onCalcularIPVA={calcularIPVAAutomatico}
        isComplete={status.burocraciaCompleta}
      />
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <IndicesSummaryCard
        isDark={isDark}
        title={t('indices.summary.title')}
        items={[
          {
            label: t('indices.summary.kmCost'),
            value: formatCurrency(custoKm),
            description: t('indices.summary.kmCostDescription'),
          },
          {
            label: t('indices.summary.minuteCost'),
            value: formatCurrency(tempo.imin),
            description: t('indices.summary.minuteCostDescription'),
          },
          {
            label: t('indices.summary.goal'),
            value: formatCurrency(tempo.metaMinuto),
            description: t('indices.summary.goalDescription'),
          },
        ]}
      />

      {sugestoesAplicadas.length > 0 || sugestoesIgnoradas.length > 0 ? (
        <AppCard isDark={isDark} style={styles.suggestionResult}>
          <Text style={[styles.resultTitle, { color: textColor }]}>
            {t('indices.suggestion.applied')}
          </Text>
          <Text style={[styles.resultText, { color: mutedColor }]}>
            {t('calculadora.sugestoes_resumo', {
              count: sugestoesAplicadas.length,
            })}{' '}
            {t('calculadora.sugestoes_ignoradas', {
              count: sugestoesIgnoradas.length,
            })}
          </Text>
          <Text style={[styles.resultText, { color: mutedColor }]}>
            {t('calculadora.baseado_oficina')}: {resumoSugestoes.historicoOficina} ·{' '}
            {t('calculadora.baseado_financeiro')}: {resumoSugestoes.historicoFinanceiro} ·{' '}
            {t('calculadora.baseado_planejado')}: {resumoSugestoes.preCadastro} ·{' '}
            {t('calculadora.baseado_perfil')}: {resumoSugestoes.perfilUso} ·{' '}
            {t('calculadora.baseado_padrao')}: {resumoSugestoes.padraoKorre}
          </Text>
        </AppCard>
      ) : null}

      {sugestoesRevisao.length > 0 ? (
        <AppCard isDark={isDark} style={styles.reviewBox}>
          <Text style={[styles.resultTitle, { color: textColor }]}>
            {t('calculadora.sugestoes_revisao')}
          </Text>
          {sugestoesRevisao.map((sugestao) => (
            <View
              key={`${String(sugestao.campo)}-${sugestao.fonte}`}
              style={styles.reviewItem}
            >
              <Text style={[styles.resultText, { color: mutedColor }]}>
                {String(sugestao.campo).replace(/_/g, ' ')} ·{' '}
                {t(`calculadora.fontes_sugestao.${sugestao.fonte}`)} ·{' '}
                {t('calculadora.confianca_sugestao', {
                  confianca: t(`calculadora.confiancas.${sugestao.confianca}`),
                })}
              </Text>
              <View style={styles.reviewActions}>
                <AppButton
                  title={t('calculadora.usar_valor_sugerido')}
                  isDark={isDark}
                  onPress={() => {
                    handleChange(sugestao.campo, sugestao.valor as number);
                    setSugestoesRevisao((prev) =>
                      prev.filter((item) => item.campo !== sugestao.campo),
                    );
                  }}
                  style={styles.reviewAction}
                />
                <AppButton
                  title={t('calculadora.manter_meu_valor')}
                  variant="secondary"
                  isDark={isDark}
                  onPress={() =>
                    setSugestoesRevisao((prev) =>
                      prev.filter((item) => item.campo !== sugestao.campo),
                    )
                  }
                  style={styles.reviewAction}
                />
              </View>
            </View>
          ))}
        </AppCard>
      ) : null}
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'intro':
        return renderIntro();
      case 'mode':
        return renderMode();
      case 'basic':
        return renderBasic();
      case 'advanced':
        return renderAdvanced();
      default:
        return renderReview();
    }
  };

  const showFooter = step !== 'intro';
  const isReview = step === 'review';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? tokens.palette.black : tokens.palette.surface100 },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.screen}>
          <View style={styles.topBar}>
            <BackButton fallback={AppRoutes.dashboard} isDark={isDark} />
          </View>

          <CalculadoraHeader
            veiculoAtivo={veiculoAtivo}
            veiculosDisponiveis={veiculosDisponiveis}
            onMudarVeiculo={mudarVeiculoAtivo}
            percentualCompletude={status.percentualGeral || 0}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.formContainer}>
              <IndicesStepProgress
                steps={steps.map((item) => ({
                  key: item,
                  label: t(`indices.steps.${item}`),
                }))}
                currentIndex={currentStepIndex}
                isDark={isDark}
              />
              {renderCurrentStep()}
            </View>
          </ScrollView>

          {showFooter ? (
            <View
              style={[
                styles.footer,
                {
                  backgroundColor: isDark
                    ? tokens.palette.black
                    : tokens.palette.surface100,
                  borderTopColor: isDark
                    ? tokens.palette.surface650
                    : tokens.palette.surface200,
                },
              ]}
            >
              <AppButton
                title={t('common.cancelar')}
                variant="ghost"
                isDark={isDark}
                onPress={() => router.push(AppRoutes.dashboard)}
                style={styles.footerButton}
              />
              {currentStepIndex > 0 ? (
                <AppButton
                  title={t('common.voltar')}
                  variant="secondary"
                  isDark={isDark}
                  onPress={goBackStep}
                  style={styles.footerButton}
                />
              ) : null}
              {isReview ? (
                <AppButton
                  title={t('indices.summary.save')}
                  icon={Save}
                  isDark={isDark}
                  onPress={calcularESalvar}
                  style={styles.footerButton}
                />
              ) : (
                <AppButton
                  title={t('indices.navigation.continue')}
                  isDark={isDark}
                  onPress={goNext}
                  style={styles.footerButton}
                />
              )}
            </View>
          ) : null}

          {isReview ? (
            <View style={styles.analysisCta}>
              <AppButton
                title={t('ride_decision.dashboard_cta')}
                icon={Route}
                variant="secondary"
                isDark={isDark}
                onPress={() => router.push(AppRoutes.analisarCorrida)}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      <ModalExplicativo
        visible={helpModal.visible}
        titulo={helpModal.titulo}
        textoExplicativo={helpModal.texto}
        onClose={() => setHelpModal({ ...helpModal, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
  },
  loadingText: {
    fontSize: tokens.typography.size.md,
    fontWeight: tokens.typography.weight.bold,
  },
  topBar: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.sm,
  },
  scrollContent: {
    paddingBottom: 170,
  },
  formContainer: {
    padding: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  stepContent: {
    gap: tokens.spacing.lg,
  },
  stepTitle: {
    fontSize: tokens.typography.size.xxl,
    fontWeight: tokens.typography.weight.black,
  },
  stepDescription: {
    fontSize: tokens.typography.size.md,
    lineHeight: 21,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  footerButton: {
    width: '100%',
  },
  analysisCta: {
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
  suggestionResult: {
    gap: tokens.spacing.sm,
  },
  resultTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.black,
  },
  resultText: {
    fontSize: tokens.typography.size.sm,
    lineHeight: 18,
  },
  reviewBox: {
    gap: tokens.spacing.md,
  },
  reviewItem: {
    gap: tokens.spacing.sm,
  },
  reviewActions: {
    gap: tokens.spacing.sm,
  },
  reviewAction: {
    width: '100%',
  },
});
