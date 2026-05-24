import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  TrendingUp,
} from 'lucide-react-native';
import { useTermometroMEI } from '../../../hooks/relatorios/useTermometroMEI';
import { styles } from '../../../styles/generated/components/telas/Relatorios/temometro_meiStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/Relatorios/temometro_meiInlineStyles';

/**
 * Executa a função de formatar moeda.
 */
const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Executa a função de termometro mei.
 */
export function TermometroMEI() {
  const { dados, loading, alternarDasPago } = useTermometroMEI();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#10B981" />
        <Text style={styles.loadingText}>
          Analisando faturamento MEI...
        </Text>
      </View>
    );
  }

  /**
   * Executa a função de get cor.
   */
  const getCor = (percent: number) => {
    if (percent >= 90) return '#EF4444';
    if (percent >= 75) return '#F59E0B';
    return '#10B981';
  };

  const dasColor = dados.das.pago
    ? '#10B981'
    : dados.das.vencido
      ? '#EF4444'
      : '#B45309';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Termometro MEI</Text>
          <Text style={styles.subtitle}>Ano fiscal 2026</Text>
        </View>
        {(dados.projecaoEstouro || dados.alerta) && (
          <AlertTriangle color="#EF4444" size={24} />
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Faturamento do mes</Text>
          <Text
            style={[
              styles.valor,
              { color: getCor(dados.mensal.porcentagem) },
            ]}
          >
            {dados.mensal.porcentagem.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${dados.mensal.porcentagem}%`,
                backgroundColor: getCor(
                  dados.mensal.porcentagem,
                ),
              },
            ]}
          />
        </View>
        <Text style={styles.subTextInline}>
          {formatarMoeda(dados.mensal.total)} de{' '}
          {formatarMoeda(dados.mensal.limite)}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            Pode faturar no mes
          </Text>
          <Text style={styles.metricValue}>
            {formatarMoeda(dados.restanteMes)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Media mensal</Text>
          <Text style={styles.metricValue}>
            {formatarMoeda(dados.mediaMensal)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            Pode faturar no ano
          </Text>
          <Text style={styles.metricValue}>
            {formatarMoeda(dados.restanteAno)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Projecao anual</Text>
          <Text
            style={[
              styles.metricValue,
              dados.projecaoEstouro && { color: '#EF4444' },
            ]}
          >
            {formatarMoeda(dados.projecaoAnual)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Acumulado no ano</Text>
          <Text
            style={[
              styles.valor,
              { color: getCor(dados.anual.porcentagem) },
            ]}
          >
            {dados.anual.porcentagem.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${dados.anual.porcentagem}%`,
                backgroundColor: getCor(
                  dados.anual.porcentagem,
                ),
              },
            ]}
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.subText}>
            Total: {formatarMoeda(dados.anual.total)}
          </Text>
          <Text style={styles.subText}>
            Limite: {formatarMoeda(dados.anual.limite)}
          </Text>
        </View>
      </View>

      {dados.projecaoEstouro ? (
        <View style={[styles.alertBox, styles.alertError]}>
          <TrendingUp color="#EF4444" size={20} />
          <Text style={styles.alertText}>
            <Text style={inlineStyles.inline1}>
              Risco de desenquadramento:{' '}
            </Text>
            No ritmo atual, sua projecao anual excede o
            limite do MEI.
          </Text>
        </View>
      ) : dados.alerta ? (
        <View style={[styles.alertBox, styles.alertWarning]}>
          <AlertTriangle color="#B45309" size={20} />
          <Text
            style={[styles.alertText, { color: '#B45309' }]}
          >
            Voce atingiu 80% do limite. Planeje os proximos
            faturamentos com cautela.
          </Text>
        </View>
      ) : (
        <View style={[styles.alertBox, styles.alertSuccess]}>
          <CheckCircle color="#10B981" size={20} />
          <Text
            style={[styles.alertText, { color: '#166534' }]}
          >
            Faturamento saudavel. Voce esta operando dentro
            da margem de seguranca.
          </Text>
        </View>
      )}

      {dados.proporcional.mesesAtivos < 12 && (
        <View style={styles.proporcionalInfo}>
          <Calendar color="#6B7280" size={14} />
          <Text style={styles.proporcionalText}>
            Limite proporcional a{' '}
            {dados.proporcional.mesesAtivos} meses de
            atividade.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.dasCard,
          dados.das.pago
            ? styles.dasPago
            : dados.das.vencido
              ? styles.dasVencido
              : styles.dasPendente,
        ]}
        activeOpacity={0.8}
        onPress={alternarDasPago}
      >
        <Bell color={dasColor} size={20} />
        <View style={styles.dasTextBox}>
          <Text style={styles.dasTitle}>
            {dados.das.pago
              ? 'DAS deste mes marcado como pago'
              : `Lembrar DAS ate dia ${dados.das.vencimentoDia}`}
          </Text>
          <Text style={styles.dasSubtitle}>
            Toque aqui para{' '}
            {dados.das.pago ? 'desmarcar' : 'marcar como pago'}.
            O KORRE tambem avisa perto do vencimento.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
