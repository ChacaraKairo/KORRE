import { useRouter } from 'expo-router';
import { Route, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { styles } from '../../styles/generated/app/(tabs)/calculadora_korreStyles';
import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/calculadora_korreInlineStyles';
import {
  CalculadoraHeader,
  ModalExplicativo,
  PainelResultadoFlutuante,
  PerfilUsoKorre,
  SecaoComposicaoCustoKm,
  SecaoCustoPessoa,
  SecaoCustosAtivo,
  SecaoCustosExistencia,
  SecaoPatrimonio,
  useIndicesKorreForm,
} from '../../modules/indicesKorre';
import { useTema } from '../../hooks/modo_tema';
import { AppRoutes } from '../../constants/routes';

// Layout (A casca da tela)

// Sections (Os blocos do formulário)

// UI Genérica
import { MainButton as Button } from '../../components/ui/buttons/Button'; // Mantido caso seja global

/**
 * Executa a função de calculadora screen.
 */
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
    perfilUso,
    setPerfilUso,
    aplicarSugestoes,
    sugestoesAplicadas,
    sugestoesIgnoradas,
    sugestoesRevisao,
    resumoSugestoes,
    setSugestoesRevisao,
  } = useIndicesKorreForm();

  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const [modoAvancado, setModoAvancado] = useState(false);

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
  const perfisUso: PerfilUsoKorre[] = [
    'uso_leve',
    'uso_medio',
    'uso_intenso',
    'uso_profissional_pesado',
  ];

  /**
   * Executa a função de formatar campo sugestao.
   */
  const formatarCampoSugestao = (campo: string) =>
    campo.replace(/_/g, ' ');

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
              <View
                style={{
                  gap: 12,
                  marginBottom: 16,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: isDark ? '#111' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: isDark ? '#222' : '#E5E7EB',
                }}
              >
                <Text
                  style={{
                    color: isDark ? '#FFF' : '#111827',
                    fontSize: 18,
                    fontWeight: '900',
                  }}
                >
                  {t('calculadora.auditoria_korre')}
                </Text>
                <Text
                  style={{
                    color: isDark ? '#9CA3AF' : '#4B5563',
                    lineHeight: 20,
                  }}
                >
                  {t('calculadora.sugestoes_intro')}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {perfisUso.map((perfil) => {
                    const selecionado = perfilUso === perfil;
                    return (
                      <TouchableOpacity
                        key={perfil}
                        onPress={() => setPerfilUso(perfil)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 999,
                          backgroundColor: selecionado
                            ? '#00C853'
                            : isDark
                              ? '#1F2937'
                              : '#F3F4F6',
                        }}
                      >
                        <Text
                          style={{
                            color: selecionado
                              ? '#06140C'
                              : isDark
                                ? '#E5E7EB'
                                : '#111827',
                            fontWeight: '800',
                          }}
                        >
                          {t(`calculadora.perfis_uso.${perfil}`)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Button
                  title={t('calculadora.preencher_para_mim')}
                  onPress={aplicarSugestoes}
                />

                {sugestoesAplicadas.length > 0 && (
                  <View style={{ gap: 6 }}>
                    <Text
                      style={{
                        color: isDark ? '#E5E7EB' : '#111827',
                        fontWeight: '900',
                      }}
                    >
                      {t('calculadora.sugestoes_resumo', {
                        count: sugestoesAplicadas.length,
                      })}
                    </Text>
                    {sugestoesAplicadas.slice(0, 4).map((sugestao) => (
                      <Text
                        key={String(sugestao.campo)}
                        style={{
                          color: isDark ? '#9CA3AF' : '#4B5563',
                          fontSize: 12,
                          lineHeight: 17,
                        }}
                      >
                        {formatarCampoSugestao(String(sugestao.campo))} ·{' '}
                        {t(`calculadora.fontes_sugestao.${sugestao.fonte}`)} ·{' '}
                        {t('calculadora.confianca_sugestao', {
                          confianca: t(
                            `calculadora.confiancas.${sugestao.confianca}`,
                          ),
                        })}
                      </Text>
                    ))}
                    {sugestoesIgnoradas.length > 0 && (
                      <Text
                        style={{
                          color: isDark ? '#6B7280' : '#6B7280',
                          fontSize: 12,
                        }}
                      >
                        {t('calculadora.sugestoes_ignoradas', {
                          count: sugestoesIgnoradas.length,
                        })}
                      </Text>
                    )}
                    <Text
                      style={{
                        color: isDark ? '#9CA3AF' : '#4B5563',
                        fontSize: 12,
                      }}
                    >
                      {t('calculadora.baseado_oficina')}: {resumoSugestoes.historicoOficina} · {t('calculadora.baseado_financeiro')}: {resumoSugestoes.historicoFinanceiro} · {t('calculadora.baseado_planejado')}: {resumoSugestoes.preCadastro} · {t('calculadora.baseado_perfil')}: {resumoSugestoes.perfilUso} · {t('calculadora.baseado_padrao')}: {resumoSugestoes.padraoKorre}
                    </Text>
                  </View>
                )}
                {sugestoesRevisao.length > 0 && (
                  <View
                    style={{
                      gap: 10,
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: isDark ? '#1A1208' : '#FFF7ED',
                      borderWidth: 1,
                      borderColor: isDark ? '#422006' : '#FDBA74',
                    }}
                  >
                    <Text
                      style={{
                        color: isDark ? '#FED7AA' : '#9A3412',
                        fontWeight: '900',
                      }}
                    >
                      {t('calculadora.sugestoes_revisao')}
                    </Text>
                    {sugestoesRevisao.map((sugestao) => (
                      <View
                        key={`${String(sugestao.campo)}-${sugestao.fonte}`}
                        style={{ gap: 8 }}
                      >
                        <Text
                          style={{
                            color: isDark ? '#E5E7EB' : '#111827',
                            fontSize: 12,
                          }}
                        >
                          {formatarCampoSugestao(String(sugestao.campo))} · {t(`calculadora.fontes_sugestao.${sugestao.fonte}`)} · {t('calculadora.confianca_sugestao', {
                            confianca: t(`calculadora.confiancas.${sugestao.confianca}`),
                          })}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              borderRadius: 8,
                              backgroundColor: '#00C853',
                            }}
                            onPress={() => {
                              handleChange(
                                sugestao.campo,
                                sugestao.valor as number,
                              );
                              setSugestoesRevisao((prev) =>
                                prev.filter(
                                  (item) =>
                                    item.campo !== sugestao.campo,
                                ),
                              );
                            }}
                          >
                            <Text style={{ fontWeight: '800' }}>
                              {t('calculadora.usar_valor_sugerido')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              borderRadius: 8,
                              backgroundColor: isDark
                                ? '#1F2937'
                                : '#E5E7EB',
                            }}
                            onPress={() =>
                              setSugestoesRevisao((prev) =>
                                prev.filter(
                                  (item) =>
                                    item.campo !== sugestao.campo,
                                ),
                              )
                            }
                          >
                            <Text
                              style={{
                                color: isDark ? '#F3F4F6' : '#111827',
                                fontWeight: '800',
                              }}
                            >
                              {t('calculadora.manter_meu_valor')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setModoAvancado(false)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: !modoAvancado
                        ? '#00C853'
                        : isDark
                          ? '#1F2937'
                          : '#F3F4F6',
                    }}
                  >
                    <Text style={{ fontWeight: '900' }}>
                      {t('calculadora.modo_simples')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModoAvancado(true)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: modoAvancado
                        ? '#00C853'
                        : isDark
                          ? '#1F2937'
                          : '#F3F4F6',
                    }}
                  >
                    <Text style={{ fontWeight: '900' }}>
                      {t('calculadora.modo_avancado')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

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

              <SecaoCustoPessoa
                form={form}
                onChange={handleChange}
                onHelp={handleOpenHelp}
                isComplete={status.humanoCompleto}
              />

              {modoAvancado && (
                <>
                  <SecaoPatrimonio
                    form={form}
                    onChange={handleChange}
                    onHelp={handleOpenHelp}
                    isComplete={
                      !!form.valor_veiculo_fipe &&
                      !!form.custo_oportunidade_selic
                    }
                  />

                  <SecaoCustosExistencia
                    form={form}
                    onChange={handleChange}
                    onHelp={handleOpenHelp}
                    onCalcularIPVA={calcularIPVAAutomatico}
                    isComplete={status.burocraciaCompleta}
                  />
                </>
              )}

              <View style={styles.buttonWrapper}>
                <Button
                  title={t('calculadora.salvar_auditoria')}
                  onPress={calcularESalvar}
                  icon={Save}
                />
                <TouchableOpacity
                  onPress={() => router.push(AppRoutes.analisarCorrida)}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                    marginTop: 10,
                    paddingVertical: 13,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#00C853',
                  }}
                >
                  <Route size={18} color="#00C853" />
                  <Text
                    style={{
                      color: '#00C853',
                      fontWeight: '900',
                    }}
                  >
                    {t('ride_decision.dashboard_cta')}
                  </Text>
                </TouchableOpacity>
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


