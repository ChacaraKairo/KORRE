import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Car,
  Droplets,
  Target,
  Shield,
  Gauge,
  Save,
  Wrench,
  Smartphone,
  Briefcase,
  Zap,
  CircleDot,
  FileText,
  Banknote,
  Activity,
  MapPin,
  AlertTriangle,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useTema } from '../../hooks/modo_tema';
import {
  useCalculadora,
  TipoAquisicao,
} from '../../hooks/calculadora/useCalculadora';
import { styles } from '../../styles/telas/Calculadora/calculadoraStyles';
import { InputFinanceiro } from '../../components/telas/Calculadora/InputFinanceiro';
import { AccordionSection } from '../../components/telas/Calculadora/AccordionSection';
import { ModalExplicativo } from '../../components/telas/Calculadora/ModalExplicativo';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';
import {
  VEICULOS_CONFIG,
  TipoVeiculo,
} from '../../type/typeVeiculos';

export default function CalculadoraMCScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    loading,
    veiculoAtivo,
    veiculosDisponiveis,
    mudarVeiculoAtivo,
    form,
    handleChange,
    calcularESalvar,
    validarStatusSecoes,
    calcularIPVAAutomatico,
  } = useCalculadora();

  // Estados do Modal Explicativo
  const [helpVisible, setHelpVisible] = useState(false);
  const [helpContent, setHelpContent] = useState({
    title: '',
    text: '',
  });
  const [isKeyboardVisible, setKeyboardVisible] =
    useState(false);
  const [modalEstadoAberto, setModalEstadoAberto] =
    useState(false);

  const listaEstados = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  useEffect(() => {
    console.log(
      '[CalculadoraMCScreen] Tela montada. Aguardando dados...',
    );
  }, []);

  useEffect(() => {
    if (veiculoAtivo) {
      console.log(
        `[CalculadoraMCScreen] Veículo ativo em exibição: ID ${veiculoAtivo.id} - ${veiculoAtivo.modelo}`,
      );
    }
  }, [veiculoAtivo]);

  // Monitoriza a abertura e o fecho do teclado
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios'
        ? 'keyboardWillShow'
        : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios'
        ? 'keyboardWillHide'
        : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#666' : '#888';

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: bgColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  const isEletrico =
    veiculoAtivo?.tipo === 'carro_eletrico';
  const isBike = veiculoAtivo?.tipo === 'bicicleta';
  const isAlugado = form.tipo_aquisicao === 'alugado';

  const statusSecoes = validarStatusSecoes();

  const openHelp = (title: string, text: string) => {
    console.log(
      `[CalculadoraMCScreen] Abrindo modal de ajuda: ${title}`,
    );
    setHelpContent({ title, text });
    setHelpVisible(true);
  };

  // Componente interno para os botões de seleção de tipo de aquisição
  const BotaoAquisicao = ({
    tipo,
    label,
  }: {
    tipo: TipoAquisicao;
    label: string;
  }) => {
    const isSelected = form.tipo_aquisicao === tipo;
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(
            `[CalculadoraMCScreen] Tipo de aquisição alterado para: ${tipo}`,
          );
          handleChange('tipo_aquisicao', tipo);
        }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isSelected ? '#00C853' : borderColor,
          backgroundColor: isSelected
            ? 'rgba(0, 200, 83, 0.1)'
            : cardColor,
          marginRight: 8,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            color: isSelected ? '#00C853' : textMuted,
            fontSize: 10,
            fontWeight: 'bold',
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { borderBottomColor: borderColor },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.btnVoltar,
              { backgroundColor: cardColor, borderColor },
            ]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={textColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Auditoria Financeira
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* SELETOR DE VEÍCULOS (FROTA) */}
        {veiculosDisponiveis.length > 0 && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: textMuted,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              Máquina em Auditoria
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {veiculosDisponiveis.map((v) => {
                const isActive = veiculoAtivo?.id === v.id;
                const tipo =
                  (v.tipo as TipoVeiculo) || 'moto';
                const Icone =
                  VEICULOS_CONFIG[tipo]?.icone ||
                  VEICULOS_CONFIG.moto.icone;
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      console.log(
                        `[CalculadoraMCScreen] Trocando para o veículo ID: ${v.id}`,
                      );
                      mudarVeiculoAtivo(v.id);
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isActive
                        ? '#00C853'
                        : borderColor,
                      backgroundColor: isActive
                        ? 'rgba(0,200,83,0.1)'
                        : cardColor,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Icone
                      size={16}
                      color={
                        isActive ? '#00C853' : textMuted
                      }
                    />
                    <Text
                      style={{
                        color: isActive
                          ? '#00C853'
                          : textColor,
                        fontWeight: isActive
                          ? 'bold'
                          : 'normal',
                        fontSize: 14,
                      }}
                    >
                      {v.modelo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop:
                veiculosDisponiveis.length > 0 ? 8 : 20,
              paddingBottom: 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ========================================================= */}
          {/* CATEGORIA 1: CAPITAL E AQUISIÇÃO */}
          {/* ========================================================= */}
          <AccordionSection
            title="1. Posse e Capital"
            icon={<Banknote size={20} color="#00C853" />}
            isComplete={statusSecoes.capitalCompleto}
            initialExpanded={!statusSecoes.capitalCompleto}
            onHelpClick={() =>
              openHelp(
                'Posse e Capital',
                'Por que esta seção existe?\n\nAqui mapeamos o desgaste do seu bem e os custos de aquisição. Sem isso, você consome o seu próprio patrimônio sem perceber, achando que faturou lucro limpo.',
              )
            }
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              <BotaoAquisicao
                tipo="proprio_quitado"
                label="Próprio (Quitado)"
              />
              <BotaoAquisicao
                tipo="financiado"
                label="Financiado"
              />
              <BotaoAquisicao
                tipo="alugado"
                label="Alugado"
              />
              <BotaoAquisicao
                tipo="consorcio"
                label="Consórcio"
              />
              <BotaoAquisicao
                tipo="emprestado"
                label="Emprestado"
              />
            </View>

            {/* Renderização Condicional baseada na Aquisição */}
            {!isAlugado && (
              <>
                <InputFinanceiro
                  label="Valor Atual na FIPE"
                  value={form.valor_veiculo_fipe}
                  onChangeText={(v) =>
                    handleChange('valor_veiculo_fipe', v)
                  }
                  placeholder="Ex: 25000.00"
                  icon={<Car size={18} color={textMuted} />}
                  suffix="R$"
                />
                <View
                  style={{ flexDirection: 'row', gap: 12 }}
                >
                  <View style={{ flex: 1 }}>
                    <InputFinanceiro
                      label="Vida Útil (Anos)"
                      value={form.depreciacao_real_estimada}
                      onChangeText={(v) =>
                        handleChange(
                          'depreciacao_real_estimada',
                          v,
                        )
                      }
                      placeholder="Ex: 3"
                      icon={
                        <Gauge
                          size={18}
                          color={textMuted}
                        />
                      }
                      suffix="Anos"
                      onHelp={() =>
                        openHelp(
                          'Vida Útil do Veículo',
                          'Em quantos anos você pretende recuperar o valor pago pela máquina? Dividiremos o valor do veículo por este tempo para garantir que a sua operação gere dinheiro para comprar outra máquina no futuro. O padrão sugerido é de 3 anos.',
                        )
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputFinanceiro
                      label="Taxa Selic (Perda)"
                      value={form.custo_oportunidade_selic}
                      onChangeText={(v) =>
                        handleChange(
                          'custo_oportunidade_selic',
                          v,
                        )
                      }
                      placeholder="Carregando..."
                      icon={
                        <Sparkles
                          size={18}
                          color="#FFC107" // Destaca que é uma info "Mágica" do Banco Central
                        />
                      }
                      suffix="%"
                      onHelp={() =>
                        openHelp(
                          'Taxa Selic Automática',
                          'Taxa básica de juros definida pelo Banco Central. O app busca essa taxa automaticamente para calcular quanto o seu dinheiro renderia se estivesse parado no banco em vez de investido no veículo.',
                        )
                      }
                    />
                  </View>
                </View>
              </>
            )}

            {form.tipo_aquisicao === 'financiado' && (
              <InputFinanceiro
                label="Parcela do Financiamento"
                value={form.juros_financiamento_mensal}
                onChangeText={(v) =>
                  handleChange(
                    'juros_financiamento_mensal',
                    v,
                  )
                }
                placeholder="Ex: 650.00"
                icon={
                  <Banknote size={18} color={textMuted} />
                }
                suffix="R$/mês"
              />
            )}
            {form.tipo_aquisicao === 'alugado' && (
              <View
                style={{ flexDirection: 'row', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <InputFinanceiro
                    label="Diária do Aluguel"
                    value={form.diaria_aluguel}
                    onChangeText={(v) =>
                      handleChange('diaria_aluguel', v)
                    }
                    placeholder="Ex: 45.00"
                    icon={
                      <Banknote
                        size={18}
                        color={textMuted}
                      />
                    }
                    suffix="R$/dia"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputFinanceiro
                    label="Caução Retido"
                    value={form.caucao_aluguel_mensalizado}
                    onChangeText={(v) =>
                      handleChange(
                        'caucao_aluguel_mensalizado',
                        v,
                      )
                    }
                    placeholder="Ex: 0"
                    icon={
                      <Shield size={18} color={textMuted} />
                    }
                    suffix="R$/mês"
                  />
                </View>
              </View>
            )}
            {form.tipo_aquisicao === 'consorcio' && (
              <InputFinanceiro
                label="Taxa de Consórcio"
                value={form.taxa_administracao_consorcio}
                onChangeText={(v) =>
                  handleChange(
                    'taxa_administracao_consorcio',
                    v,
                  )
                }
                placeholder="Ex: 400.00"
                icon={
                  <Banknote size={18} color={textMuted} />
                }
                suffix="R$/mês"
              />
            )}
          </AccordionSection>

          {/* ========================================================= */}
          {/* CATEGORIA 2 & 3: BUROCRACIA E CUSTOS FIXOS */}
          {/* ========================================================= */}
          <AccordionSection
            title="2. Impostos e Fixos"
            icon={<FileText size={20} color="#00C853" />}
            isComplete={statusSecoes.burocraciaCompleta}
            initialExpanded={
              !statusSecoes.burocraciaCompleta
            }
            onHelpClick={() =>
              openHelp(
                'Impostos e Fixos',
                'Custos que você paga mesmo se a máquina ficar parada na garagem o mês inteiro. É essencial diluir isto no seu custo por minuto de operação.',
              )
            }
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Seguro Anual"
                  value={form.seguro_comercial_anual}
                  onChangeText={(v) =>
                    handleChange(
                      'seguro_comercial_anual',
                      v,
                    )
                  }
                  placeholder="Ex: 1500"
                  icon={
                    <Shield size={18} color={textMuted} />
                  }
                  suffix="R$/ano"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Plano Internet"
                  value={form.plano_dados_mensal}
                  onChangeText={(v) =>
                    handleChange('plano_dados_mensal', v)
                  }
                  placeholder="Ex: 60"
                  icon={
                    <Smartphone
                      size={18}
                      color={textMuted}
                    />
                  }
                  suffix="R$/mês"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Guia MEI (DAS)"
                  value={form.imposto_mei_mensal}
                  onChangeText={(v) =>
                    handleChange('imposto_mei_mensal', v)
                  }
                  placeholder="Ex: 75.60"
                  icon={
                    <FileText size={18} color={textMuted} />
                  }
                  suffix="R$/mês"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Rastreador"
                  value={form.rastreador_telemetria_mensal}
                  onChangeText={(v) =>
                    handleChange(
                      'rastreador_telemetria_mensal',
                      v,
                    )
                  }
                  placeholder="Ex: 50"
                  icon={
                    <MapPin size={18} color={textMuted} />
                  }
                  suffix="R$/mês"
                />
              </View>
            </View>

            {!isBike && !isAlugado && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.inputWrapper}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={[
                            styles.inputLabel,
                            {
                              color: textMuted,
                              marginBottom: 0,
                            },
                          ]}
                        >
                          Estado (UF)
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: bgColor,
                            borderColor,
                          },
                        ]}
                        onPress={() =>
                          setModalEstadoAberto(true)
                        }
                        activeOpacity={0.7}
                      >
                        <View style={styles.inputIcon}>
                          <MapPin
                            size={18}
                            color={textMuted}
                          />
                        </View>
                        <Text
                          style={{
                            color: textColor,
                            fontSize: 14,
                            flex: 1,
                            fontWeight: 'bold',
                          }}
                        >
                          {form.estado_uf || 'Selecione'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputFinanceiro
                      label="IPVA Anual"
                      value={form.ipva_anual}
                      onChangeText={(v) =>
                        handleChange('ipva_anual', v)
                      }
                      placeholder="Auto (UF)"
                      icon={
                        <Sparkles
                          size={18}
                          color="#FFC107"
                        />
                      }
                      suffix="R$/ano"
                      onHelp={() =>
                        calcularIPVAAutomatico()
                      }
                    />
                  </View>
                </View>

                <View
                  style={{ flexDirection: 'row', gap: 12 }}
                >
                  <View style={{ flex: 1 }}>
                    <InputFinanceiro
                      label="Licenciamento"
                      value={
                        form.licenciamento_detran_anual
                      }
                      onChangeText={(v) =>
                        handleChange(
                          'licenciamento_detran_anual',
                          v,
                        )
                      }
                      placeholder="Ex: 150"
                      icon={
                        <FileText
                          size={18}
                          color={textMuted}
                        />
                      }
                      suffix="R$/ano"
                    />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
              </>
            )}
          </AccordionSection>

          {/* ========================================================= */}
          {/* CATEGORIA 4: CUSTOS VARIÁVEIS (O DESGASTE) */}
          {/* ========================================================= */}
          <AccordionSection
            title="3. O Custo de Rodar"
            icon={<Wrench size={20} color="#00C853" />}
            isComplete={statusSecoes.operacaoCompleta}
            initialExpanded={!statusSecoes.operacaoCompleta}
            onHelpClick={() =>
              openHelp(
                'O Custo de Rodar',
                'Estes são os custos que só acontecem quando a roda gira (Desgaste Variável). É o núcleo do seu Índice de KM (IKM).',
              )
            }
          >
            {!isBike && (
              <View
                style={{ flexDirection: 'row', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <InputFinanceiro
                    label="Consumo (KM/L)"
                    value={form.rendimento_energia_unidade}
                    onChangeText={(v) =>
                      handleChange(
                        'rendimento_energia_unidade',
                        v,
                      )
                    }
                    placeholder="Ex: 12.5"
                    icon={
                      isEletrico ? (
                        <Zap size={18} color={textMuted} />
                      ) : (
                        <Droplets
                          size={18}
                          color={textMuted}
                        />
                      )
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputFinanceiro
                    label="Preço Energia"
                    value={form.preco_energia_unidade}
                    onChangeText={(v) =>
                      handleChange(
                        'preco_energia_unidade',
                        v,
                      )
                    }
                    placeholder="Ex: 5.80"
                    icon={
                      <Banknote
                        size={18}
                        color={textMuted}
                      />
                    }
                    suffix="R$"
                  />
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Óleo/Revisão"
                  value={form.valor_oleo_filtros}
                  onChangeText={(v) =>
                    handleChange('valor_oleo_filtros', v)
                  }
                  placeholder="Ex: 250"
                  icon={
                    <Droplets size={18} color={textMuted} />
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Ciclo Óleo"
                  value={form.intervalo_oleo_filtros_km}
                  onChangeText={(v) =>
                    handleChange(
                      'intervalo_oleo_filtros_km',
                      v,
                    )
                  }
                  placeholder="Ex: 10000"
                  icon={
                    <Gauge size={18} color={textMuted} />
                  }
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Par de Pneus"
                  value={form.valor_jogo_pneus}
                  onChangeText={(v) =>
                    handleChange('valor_jogo_pneus', v)
                  }
                  placeholder="Ex: 1200"
                  icon={
                    <CircleDot
                      size={18}
                      color={textMuted}
                    />
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Vida dos Pneus"
                  value={form.durabilidade_pneus_km}
                  onChangeText={(v) =>
                    handleChange('durabilidade_pneus_km', v)
                  }
                  placeholder="Ex: 40000"
                  icon={
                    <Gauge size={18} color={textMuted} />
                  }
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Freios (Pastilha)"
                  value={form.valor_manutencao_freios}
                  onChangeText={(v) =>
                    handleChange(
                      'valor_manutencao_freios',
                      v,
                    )
                  }
                  placeholder="Ex: 180"
                  icon={
                    <Activity size={18} color={textMuted} />
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Ciclo Freios"
                  value={form.intervalo_freios_km}
                  onChangeText={(v) =>
                    handleChange('intervalo_freios_km', v)
                  }
                  placeholder="Ex: 20000"
                  icon={
                    <Gauge size={18} color={textMuted} />
                  }
                />
              </View>
            </View>

            {!isEletrico && (
              <View
                style={{ flexDirection: 'row', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <InputFinanceiro
                    label="Correia/Relação"
                    value={form.valor_kit_transmissao}
                    onChangeText={(v) =>
                      handleChange(
                        'valor_kit_transmissao',
                        v,
                      )
                    }
                    placeholder="Ex: 600"
                    icon={
                      <Wrench size={18} color={textMuted} />
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputFinanceiro
                    label="Durabilidade"
                    value={form.durabilidade_transmissao_km}
                    onChangeText={(v) =>
                      handleChange(
                        'durabilidade_transmissao_km',
                        v,
                      )
                    }
                    placeholder="Ex: 60000"
                    icon={
                      <Gauge size={18} color={textMuted} />
                    }
                  />
                </View>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Imprevistos/Mês"
                  value={form.manutencao_imprevista_mensal}
                  onChangeText={(v) =>
                    handleChange(
                      'manutencao_imprevista_mensal',
                      v,
                    )
                  }
                  placeholder="Ex: 100"
                  icon={
                    <AlertTriangle
                      size={18}
                      color={textMuted}
                    />
                  }
                  suffix="R$/mês"
                  onHelp={() =>
                    openHelp(
                      'Imprevistos Mensais',
                      'Valor mensal reservado para cobrir furos de pneu, queimas de lâmpada e multas inesperadas. Sugerimos em torno de R$ 50 a R$ 150 por mês.',
                    )
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Lavagens/Mês"
                  value={form.limpeza_higienizacao_mensal}
                  onChangeText={(v) =>
                    handleChange(
                      'limpeza_higienizacao_mensal',
                      v,
                    )
                  }
                  placeholder="Ex: 60"
                  icon={
                    <Droplets size={18} color={textMuted} />
                  }
                  suffix="R$"
                />
              </View>
            </View>
          </AccordionSection>

          {/* ========================================================= */}
          {/* CATEGORIA 5 & 6: FATOR HUMANO E EQUIPAMENTOS */}
          {/* ========================================================= */}
          <AccordionSection
            title="4. O Motorista"
            icon={<Briefcase size={20} color="#00C853" />}
            isComplete={statusSecoes.humanoCompleto}
            initialExpanded={!statusSecoes.humanoCompleto}
            onHelpClick={() =>
              openHelp(
                'O Fator Humano',
                'A máquina mais importante da operação é você. Comer na rua, usar o celular e tirar férias custam dinheiro e devem ser pagos pela sua operação.',
              )
            }
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Almoço/Dia"
                  value={form.alimentacao_diaria}
                  onChangeText={(v) =>
                    handleChange('alimentacao_diaria', v)
                  }
                  placeholder="Ex: 25"
                  icon={
                    <Briefcase
                      size={18}
                      color={textMuted}
                    />
                  }
                  suffix="R$"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Água/Apoio Dia"
                  value={form.consumo_apoio_diario}
                  onChangeText={(v) =>
                    handleChange('consumo_apoio_diario', v)
                  }
                  placeholder="Ex: 5"
                  icon={
                    <Droplets size={18} color={textMuted} />
                  }
                  suffix="R$"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Fundo Saúde/Mês"
                  value={form.plano_saude_mensal}
                  onChangeText={(v) =>
                    handleChange('plano_saude_mensal', v)
                  }
                  placeholder="Ex: 120"
                  icon={
                    <Shield size={18} color={textMuted} />
                  }
                  suffix="R$"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Provisão Férias"
                  value={form.provisao_ferias_mensal}
                  onChangeText={(v) =>
                    handleChange(
                      'provisao_ferias_mensal',
                      v,
                    )
                  }
                  placeholder="Ex: 200"
                  icon={
                    <Banknote size={18} color={textMuted} />
                  }
                  suffix="R$"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Valor Celular"
                  value={form.valor_smartphone}
                  onChangeText={(v) =>
                    handleChange('valor_smartphone', v)
                  }
                  placeholder="Ex: 1500"
                  icon={
                    <Smartphone
                      size={18}
                      color={textMuted}
                    />
                  }
                  suffix="R$"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Vida Útil Cel."
                  value={form.vida_util_smartphone_meses}
                  onChangeText={(v) =>
                    handleChange(
                      'vida_util_smartphone_meses',
                      v,
                    )
                  }
                  placeholder="Ex: 24"
                  icon={
                    <Smartphone
                      size={18}
                      color={textMuted}
                    />
                  }
                  suffix="Meses"
                />
              </View>
            </View>
          </AccordionSection>

          {/* ========================================================= */}
          {/* CATEGORIA 7: OPERAÇÃO E PLATAFORMA */}
          {/* ========================================================= */}
          <AccordionSection
            title="5. Operação e Metas"
            icon={<Target size={20} color="#00C853" />}
            isComplete={statusSecoes.plataformaCompleta}
            initialExpanded={
              !statusSecoes.plataformaCompleta
            }
            onHelpClick={() =>
              openHelp(
                'Operação e Metas',
                'Onde definimos a ineficiência do aplicativo (Dead Miles) e o quanto você quer colocar no bolso (lucro livre) ao final do mês.',
              )
            }
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Dias na Semana"
                  value={form.dias_trabalhados_semana}
                  onChangeText={(v) =>
                    handleChange(
                      'dias_trabalhados_semana',
                      v,
                    )
                  }
                  placeholder="Ex: 6"
                  icon={
                    <Activity size={18} color={textMuted} />
                  }
                  suffix="Dias"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Horas por Dia"
                  value={form.horas_por_dia}
                  onChangeText={(v) =>
                    handleChange('horas_por_dia', v)
                  }
                  placeholder="Ex: 8"
                  icon={
                    <Target size={18} color={textMuted} />
                  }
                  suffix="h/dia"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="KM Rodado/Dia"
                  value={form.km_por_dia}
                  onChangeText={(v) =>
                    handleChange('km_por_dia', v)
                  }
                  placeholder="Ex: 120"
                  icon={
                    <Gauge size={18} color={textMuted} />
                  }
                  suffix="KM"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Roda Vazio (%)"
                  value={form.percentual_dead_miles}
                  onChangeText={(v) =>
                    handleChange('percentual_dead_miles', v)
                  }
                  placeholder="Ex: 25"
                  icon={<Car size={18} color={textMuted} />}
                  suffix="%"
                  onHelp={() =>
                    openHelp(
                      'Dead Miles (Roda Vazio)',
                      'É o percentual de tempo/KM que você gasta se deslocando até o passageiro/restaurante ou voltando de áreas ruins sem estar ganhando dinheiro. Se roda 100km e 25km são vazios, digite 25.',
                    )
                  }
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Espera Média"
                  value={form.tempo_espera_medio_minutos}
                  onChangeText={(v) =>
                    handleChange(
                      'tempo_espera_medio_minutos',
                      v,
                    )
                  }
                  placeholder="Ex: 5"
                  icon={
                    <Activity size={18} color={textMuted} />
                  }
                  suffix="Min"
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="Meta de Lucro Livre"
                  value={
                    form.salario_liquido_mensal_desejado
                  }
                  onChangeText={(v) =>
                    handleChange(
                      'salario_liquido_mensal_desejado',
                      v,
                    )
                  }
                  placeholder="Ex: 3000.00"
                  icon={
                    <Banknote size={18} color={textMuted} />
                  }
                  suffix="R$/mês"
                />
              </View>
            </View>
          </AccordionSection>

          {/* ESPAÇO EXTRA DINÂMICO PARA O TECLADO */}
          <View
            style={{
              height: isKeyboardVisible ? 200 : 120,
            }}
          />
        </ScrollView>

        {/* BOTÃO FIXO NO RODAPÉ */}
        {!isKeyboardVisible && (
          <View
            style={[
              styles.footerFixed,
              {
                backgroundColor: bgColor,
                borderTopColor: borderColor,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.btnSalvar}
              activeOpacity={0.9}
              onPress={() => {
                console.log(
                  '[CalculadoraMCScreen] Botão "Auditar e Salvar Índices" clicado. Status das seções:',
                  statusSecoes,
                );

                // Verifica se todos os booleanos do validador são verdadeiros
                const tudoCompleto = Object.values(
                  statusSecoes,
                ).every((status) => status === true);

                if (!tudoCompleto) {
                  showCustomAlert(
                    'Auditoria Incompleta',
                    'Ainda existem secções pendentes (marcadas a vermelho). Se guardares agora, os teus cálculos podem não ser 100% precisos.\n\nQueres guardar na mesma?',
                    [
                      {
                        text: 'Rever Campos',
                        style: 'cancel',
                      },
                      {
                        text: 'Sim, Guardar',
                        onPress: () => calcularESalvar(),
                      },
                    ],
                  );
                } else {
                  calcularESalvar();
                }
              }}
            >
              <Save size={20} color="#0A0A0A" />
              <Text style={styles.btnSalvarTexto}>
                Auditar e Salvar Índices
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      <ModalExplicativo
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        titulo={helpContent.title}
        textoExplicativo={helpContent.text}
      />

      {/* MODAL DE ESTADOS */}
      <Modal
        visible={modalEstadoAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalEstadoAberto(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: cardColor,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor,
              maxHeight: '80%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: textColor,
                }}
              >
                Selecione o Estado
              </Text>
              <TouchableOpacity
                onPress={() => setModalEstadoAberto(false)}
                style={{
                  padding: 8,
                  backgroundColor: isDark
                    ? '#222'
                    : '#F5F5F5',
                  borderRadius: 12,
                }}
              >
                <X size={20} color={textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'center',
                }}
              >
                {listaEstados.map((uf) => (
                  <TouchableOpacity
                    key={uf}
                    onPress={() => {
                      handleChange('estado_uf', uf);
                      calcularIPVAAutomatico(uf as any);
                      setModalEstadoAberto(false);
                    }}
                    style={{
                      width: '22%',
                      paddingVertical: 12,
                      alignItems: 'center',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor:
                        form.estado_uf === uf
                          ? '#00C853'
                          : borderColor,
                      backgroundColor:
                        form.estado_uf === uf
                          ? 'rgba(0,200,83,0.1)'
                          : bgColor,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          form.estado_uf === uf
                            ? '#00C853'
                            : textColor,
                        fontWeight: 'bold',
                      }}
                    >
                      {uf}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
