import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bike,
  Car,
  CheckCircle2,
  Motorbike,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTema } from '../../../../hooks/modo_tema';

// --- Helper para renderização dinâmica do ícone ---
const getIconeVeiculo = (
  tipo: string | undefined,
  isActive: boolean,
  colorActive: string,
  colorMuted: string,
) => {
  const size = 16;
  const color = isActive ? colorActive : colorMuted;

  switch (tipo) {
    case 'moto':
      return <Motorbike size={size} color={color} />;
    case 'bicicleta':
      return <Bike size={size} color={color} />;
    case 'caminhao':
    case 'van':
      return <Truck size={size} color={color} />;
    case 'carro_eletrico':
      return <Zap size={size} color={color} />;
    case 'carro':
    default:
      return <Car size={size} color={color} />;
  }
};

interface Veiculo {
  id: number;
  modelo: string;
  placa: string;
  ativo: number;
  tipo:
    | 'moto'
    | 'carro'
    | 'caminhao'
    | 'van'
    | 'bicicleta'
    | 'carro_eletrico';
}

interface CalculadoraHeaderProps {
  veiculoAtivo: Veiculo | null;
  veiculosDisponiveis: Veiculo[];
  onMudarVeiculo: (veiculo: Veiculo) => void; // Atualizado para receber o objeto completo
  percentualCompletude: number;
}

export const CalculadoraHeader: React.FC<
  CalculadoraHeaderProps
> = ({
  veiculoAtivo,
  veiculosDisponiveis,
  onMudarVeiculo,
  percentualCompletude,
}) => {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#AAA' : '#666';
  const bgColor = isDark ? '#000' : '#FFF';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      {/* Topo: Voltar e Título */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        <View>
          <Text
            style={[styles.title, { color: textColor }]}
          >
            Auditoria Financeira
          </Text>
          <Text
            style={[styles.subtitle, { color: textMuted }]}
          >
            Refine seus índices de lucro
          </Text>
        </View>
      </View>

      {/* Seletor de Veículos (Horizontal) */}
      <View style={styles.selectorContainer}>
        <Text style={[styles.label, { color: textMuted }]}>
          Veículo em análise:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {veiculosDisponiveis.map((v) => {
            const isActive = veiculoAtivo?.id === v.id;

            return (
              <TouchableOpacity
                key={v.id}
                onPress={() => onMudarVeiculo(v)}
                style={[
                  styles.veiculoChip,
                  {
                    borderColor: isActive
                      ? '#00C853'
                      : isDark
                        ? '#333'
                        : '#E0E0E0',
                    backgroundColor: isActive
                      ? 'rgba(0, 200, 83, 0.1)'
                      : 'transparent',
                  },
                ]}
              >
                {getIconeVeiculo(
                  v.tipo,
                  isActive,
                  '#00C853',
                  textMuted,
                )}

                <Text
                  style={[
                    styles.veiculoText,
                    {
                      color: isActive
                        ? '#00C853'
                        : textColor,
                    },
                  ]}
                >
                  {v.modelo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Barra de Completude */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <View style={styles.row}>
            <Sparkles size={16} color="#00C853" />
            <Text
              style={[
                styles.progressLabel,
                { color: textColor },
              ]}
            >
              Precisão dos Dados:{' '}
              {percentualCompletude.toFixed(0)}%
            </Text>
          </View>
          {percentualCompletude === 100 && (
            <CheckCircle2 size={16} color="#00C853" />
          )}
        </View>

        <View
          style={[
            styles.progressBg,
            {
              backgroundColor: isDark ? '#222' : '#E0E0E0',
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              { width: `${percentualCompletude}%` },
            ]}
          />
        </View>
        <Text
          style={[styles.helperText, { color: textMuted }]}
        >
          {percentualCompletude < 100
            ? 'Preencha mais campos para um semáforo ultra-preciso.'
            : 'Excelente! Seus índices agora são 100% confiáveis.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(120, 120, 120, 0.1)',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 20,
  },
  veiculoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  veiculoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C853',
    borderRadius: 4,
  },
  helperText: {
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
