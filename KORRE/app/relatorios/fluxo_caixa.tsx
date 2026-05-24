import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { inlineStyles } from '../../styles/generated-inline/app/relatorios/fluxo_caixaInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/relatorios/fluxo_caixaDynamicStyles';
// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useFluxoCaixa } from '../../hooks/relatorios/useFluxoCaixa';
import { styles } from '../../styles/telas/Relatorios/fluxoCaixaStyles';
import { safeBack } from '../../utils/navigation/safeBack';

/**
 * Executa a função de fluxo caixa screen.
 */
export default function FluxoCaixaScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    loading,
    periodo,
    tipoVisao,
    resumo,
    registosDiarios,
    alterarPeriodo,
    toggleVisao,
  } = useFluxoCaixa();

  // Cores Temáticas
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  /**
   * Executa a função de formatar moeda.
   */
  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const isPositivo = resumo.saldoFinal >= 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
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
          onPress={() => safeBack(router)}
        >
          <ArrowLeft size={20} color={textColor} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: textColor }]}
        >
          Fluxo de Caixa
        </Text>
        <View style={inlineStyles.inline1} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FILTROS DE VISÃO */}
        <View
          style={inlineStyles.inline2}
        >
          <TouchableOpacity
            style={dynamicInlineStyles.inline1({ tipoVisao, cardColor, borderColor })}
            onPress={() =>
              tipoVisao !== 'mensal' && toggleVisao()
            }
          >
            <Text
              style={dynamicInlineStyles.inline2({ tipoVisao, textMuted })}
            >
              Visão Mensal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicInlineStyles.inline3({ tipoVisao, cardColor, borderColor })}
            onPress={() =>
              tipoVisao !== 'semanal' && toggleVisao()
            }
          >
            <Text
              style={dynamicInlineStyles.inline4({ tipoVisao, textMuted })}
            >
              Visão Semanal
            </Text>
          </TouchableOpacity>
        </View>

        {/* NAVEGAÇÃO DE PERÍODO */}
        <View style={styles.periodoContainer}>
          <TouchableOpacity
            onPress={() => alterarPeriodo('anterior')}
            style={styles.periodoBtn}
          >
            <ChevronLeft size={24} color={textColor} />
          </TouchableOpacity>
          <Text
            style={[
              styles.periodoTexto,
              { color: textColor },
            ]}
          >
            {periodo}
          </Text>
          <TouchableOpacity
            onPress={() => alterarPeriodo('proximo')}
            style={styles.periodoBtn}
          >
            <ChevronRight size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00C853"
            style={inlineStyles.inline3}
          />
        ) : (
          <>
            {/* CARTÃO PRINCIPAL: SALDO DO PERÍODO */}
            <View
              style={[
                styles.cardPrincipal,
                {
                  backgroundColor: cardColor,
                  borderColor: isPositivo
                    ? '#00C853'
                    : '#EF4444',
                },
              ]}
            >
              <Text
                style={[
                  styles.labelPrincipal,
                  { color: textMuted },
                ]}
              >
                Saldo do Período
              </Text>
              <Text
                style={[
                  styles.valorPrincipal,
                  { color: textColor },
                ]}
              >
                {formatarMoeda(resumo.saldoFinal)}
              </Text>

              <View
                style={[
                  styles.badgeStatus,
                  {
                    backgroundColor: isPositivo
                      ? 'rgba(0, 200, 83, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                  },
                ]}
              >
                {isPositivo ? (
                  <CheckCircle2 size={16} color="#00C853" />
                ) : (
                  <AlertCircle size={16} color="#EF4444" />
                )}
                <Text
                  style={[
                    styles.badgeTexto,
                    {
                      color: isPositivo
                        ? '#00C853'
                        : '#EF4444',
                    },
                  ]}
                >
                  {isPositivo
                    ? 'Caixa Saudável'
                    : 'Caixa no Vermelho'}
                </Text>
              </View>
            </View>

            {/* ENTRADAS E SAÍDAS MINI CARDS */}
            <View style={styles.linhaResumo}>
              <View
                style={[
                  styles.cardMini,
                  {
                    backgroundColor: cardColor,
                    borderColor,
                  },
                ]}
              >
                <ArrowUpCircle
                  size={32}
                  color="#00C853"
                  strokeWidth={1.5}
                />
                <View>
                  <Text
                    style={[
                      styles.cardMiniLabel,
                      { color: textMuted },
                    ]}
                  >
                    Entradas
                  </Text>
                  <Text
                    style={[
                      styles.cardMiniValor,
                      { color: '#00C853' },
                    ]}
                  >
                    {formatarMoeda(resumo.entradas)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardMini,
                  {
                    backgroundColor: cardColor,
                    borderColor,
                  },
                ]}
              >
                <ArrowDownCircle
                  size={32}
                  color="#EF4444"
                  strokeWidth={1.5}
                />
                <View>
                  <Text
                    style={[
                      styles.cardMiniLabel,
                      { color: textMuted },
                    ]}
                  >
                    Saídas
                  </Text>
                  <Text
                    style={[
                      styles.cardMiniValor,
                      { color: '#EF4444' },
                    ]}
                  >
                    {formatarMoeda(resumo.saidas)}
                  </Text>
                </View>
              </View>
            </View>

            {/* LISTA DIÁRIA */}
            <Text
              style={[
                styles.sectionTitle,
                { color: textColor },
              ]}
            >
              Histórico Diário
            </Text>

            {registosDiarios.length === 0 ? (
              <View
                style={inlineStyles.inline4}
              >
                <Text
                  style={dynamicInlineStyles.inline5({ textMuted })}
                >
                  Nenhum registo encontrado neste período.
                </Text>
              </View>
            ) : (
              registosDiarios.map((dia) => {
                const diaPositivo = dia.saldoDia >= 0;
                return (
                  <View
                    key={dia.id}
                    style={[
                      styles.diaContainer,
                      {
                        backgroundColor: cardColor,
                        borderColor,
                      },
                    ]}
                  >
                    {/* Cabeçalho do Dia */}
                    <View
                      style={[
                        styles.diaHeader,
                        { borderBottomColor: borderColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.diaData,
                          { color: textColor },
                        ]}
                      >
                        {dia.dataFormatada}
                      </Text>
                      <Text
                        style={[
                          styles.diaSaldo,
                          {
                            color: diaPositivo
                              ? '#00C853'
                              : '#EF4444',
                          },
                        ]}
                      >
                        {diaPositivo ? '+' : ''}
                        {formatarMoeda(dia.saldoDia)}
                      </Text>
                    </View>

                    {/* Detalhe de Entradas e Saídas do Dia */}
                    <View style={styles.diaValores}>
                      <View style={styles.diaValorRow}>
                        <ArrowUpCircle
                          size={14}
                          color="#00C853"
                        />
                        <Text
                          style={[
                            styles.diaValorTexto,
                            { color: textMuted },
                          ]}
                        >
                          {formatarMoeda(dia.entradas)}
                        </Text>
                      </View>

                      <View style={styles.diaValorRow}>
                        <ArrowDownCircle
                          size={14}
                          color="#EF4444"
                        />
                        <Text
                          style={[
                            styles.diaValorTexto,
                            { color: textMuted },
                          ]}
                        >
                          {formatarMoeda(dia.saidas)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
