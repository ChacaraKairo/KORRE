import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useTermometroMEI } from '../../../hooks/relatorios/useTermometroMEI';
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Calendar,
} from 'lucide-react-native';

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export function TermometroMEI() {
  const { dados, loading } = useTermometroMEI();

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#10B981" />
        <Text style={styles.loadingText}>
          Analisando faturamento MEI...
        </Text>
      </View>
    );

  const getCor = (percent: number) => {
    if (percent >= 90) return '#EF4444'; // Perigo
    if (percent >= 75) return '#F59E0B'; // Atenção
    return '#10B981'; // Seguro
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Termômetro MEI</Text>
          <Text style={styles.subtitle}>
            Ano Fiscal 2026
          </Text>
        </View>
        {(dados.projecaoEstouro || dados.alerta) && (
          <AlertTriangle color="#EF4444" size={24} />
        )}
      </View>

      {/* --- FATURAMENTO MENSAL (Média R$ 6.750) --- */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Mês Atual</Text>
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

      {/* --- FATURAMENTO ANUAL (R$ 81.000 ou Proporcional) --- */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Acumulado no Ano</Text>
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

      {/* --- BOX DE STATUS / ALERTAS --- */}
      {dados.projecaoEstouro ? (
        <View style={[styles.alertBox, styles.alertError]}>
          <TrendingUp color="#EF4444" size={20} />
          <Text style={styles.alertText}>
            <Text style={{ fontWeight: '700' }}>
              Risco de Desenquadramento:{' '}
            </Text>
            No ritmo atual, sua projeção anual excede o
            limite do MEI.
          </Text>
        </View>
      ) : dados.alerta ? (
        <View
          style={[styles.alertBox, styles.alertWarning]}
        >
          <AlertTriangle color="#B45309" size={20} />
          <Text
            style={[styles.alertText, { color: '#B45309' }]}
          >
            Você atingiu 80% do limite. Planeje seus
            próximos faturamentos com cautela.
          </Text>
        </View>
      ) : (
        <View
          style={[styles.alertBox, styles.alertSuccess]}
        >
          <CheckCircle color="#10B981" size={20} />
          <Text
            style={[styles.alertText, { color: '#166534' }]}
          >
            Faturamento saudável. Você está operando dentro
            da margem de segurança.
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  card: { marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  valor: { fontSize: 16, fontWeight: '800' },
  progressBg: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 5 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  subText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  subTextInline: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'right',
  },
  alertBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
  },
  alertSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  alertWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  alertError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  alertText: {
    fontSize: 13,
    color: '#991B1B',
    flex: 1,
    lineHeight: 18,
  },
  proporcionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 5,
  },
  proporcionalText: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});
