import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  CheckCircle2,
  Gauge,
  AlertCircle,
  RefreshCw,
  Settings2,
  Trash2,
} from 'lucide-react-native';
import { styles } from '../../../styles/telas/Garagem/garagemStyles';
import { useRouter } from 'expo-router';
import { useTema } from '../../../hooks/modo_tema';
import {
  VEICULOS_CONFIG,
  TipoVeiculo,
} from '../../../type/typeVeiculos';

interface Props {
  v: any;
  onAtivar: (v: any) => void;
  onExcluir: (v: any) => void;
}

export const CardVeiculoGaragem = ({
  v,
  onAtivar,
  onExcluir,
}: Props) => {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const isAtivo = v.ativo === 1;

  const renderIcon = (size: number, color: string) => {
    // Pega as definições do veículo do nosso dicionário ou cai no padrão 'moto'
    const tipo = (v.tipo as TipoVeiculo) || 'moto';
    const config =
      VEICULOS_CONFIG[tipo] || VEICULOS_CONFIG.moto;
    const Icone = config.icone;
    return <Icone size={size} color={color} />;
  };

  return (
    <View
      style={[
        styles.cardVeiculo,
        {
          borderColor: isAtivo
            ? '#00C853'
            : isDark
              ? '#222'
              : '#E0E0E0',
          backgroundColor: isAtivo
            ? isDark
              ? '#161616'
              : '#FFFFFF'
            : isDark
              ? '#111'
              : '#F5F5F5',
          opacity: isAtivo ? 1 : 0.8,
        },
      ]}
    >
      <View style={styles.cardInner}>
        {/* Cabeçalho do Card */}
        <View style={styles.cardHeaderInfo}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={[
                styles.iconVeiculoBox,
                {
                  backgroundColor: isAtivo
                    ? 'rgba(0, 200, 83, 0.1)'
                    : isDark
                      ? '#202020'
                      : '#E0E0E0',
                },
              ]}
            >
              {renderIcon(
                32,
                isAtivo
                  ? '#00C853'
                  : isDark
                    ? '#444'
                    : '#888',
              )}
            </View>
            <View>
              <Text
                style={[
                  styles.modeloText,
                  {
                    color: isAtivo
                      ? isDark
                        ? '#FFF'
                        : '#000'
                      : isDark
                        ? '#AAA'
                        : '#555',
                  },
                ]}
              >
                {v.modelo}
              </Text>
              <Text
                style={[
                  styles.placaText,
                  {
                    color: isAtivo
                      ? '#00C853'
                      : isDark
                        ? '#666'
                        : '#888',
                  },
                ]}
              >
                {v.placa}
              </Text>
            </View>
          </View>

          {isAtivo && (
            <View style={styles.badgeAtivo}>
              <CheckCircle2
                size={10}
                color="#0A0A0A"
                strokeWidth={3}
              />
              <Text style={styles.badgeAtivoText}>
                Ativo
              </Text>
            </View>
          )}
        </View>

        {/* Informações de KM e Saúde */}
        <View style={styles.gridInfo}>
          <View style={styles.boxInfo}>
            <View style={styles.boxInfoLabelContainer}>
              <Gauge size={12} color="#444" />
              <Text style={styles.boxInfoLabel}>KM</Text>
            </View>
            <Text
              style={[
                styles.boxInfoValor,
                { color: isDark ? '#FFF' : '#000' },
              ]}
            >
              {v.km_atual?.toLocaleString() || '0'}
            </Text>
          </View>
          <View style={styles.boxInfo}>
            <View style={styles.boxInfoLabelContainer}>
              <AlertCircle
                size={12}
                color={isAtivo ? '#00C853' : '#444'}
              />
              <Text style={styles.boxInfoLabel}>Saúde</Text>
            </View>
            <Text
              style={[
                styles.boxInfoValor,
                {
                  color: isAtivo
                    ? '#00C853'
                    : isDark
                      ? '#666'
                      : '#888',
                },
              ]}
            >
              {isAtivo ? 'Excelente' : 'Inativo'}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.acoesContainer}>
          {!isAtivo ? (
            <TouchableOpacity
              style={[
                styles.btnAtivar,
                { borderColor: '#00C853', borderWidth: 1 },
              ]}
              onPress={() => onAtivar(v)}
              activeOpacity={0.8}
            >
              <RefreshCw size={16} color="#00C853" />
              <Text
                style={[
                  styles.btnAtivarTexto,
                  { color: '#00C853' },
                ]}
              >
                Ativar Máquina
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnGerir}
              onPress={() => router.push('/oficina')}
              activeOpacity={0.8}
            >
              <Settings2 size={18} color="#0A0A0A" />
              <Text style={styles.btnGerirTexto}>
                Gerir Oficina
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.btnApagar,
              {
                backgroundColor: isDark
                  ? '#222'
                  : '#E0E0E0',
                borderColor: isDark ? '#333' : '#D0D0D0',
                borderWidth: 1,
              },
            ]}
            onPress={() => onExcluir(v)}
            activeOpacity={0.8}
          >
            <Trash2 size={18} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Marca de água no fundo */}
      <View style={styles.watermark}>
        {renderIcon(
          160,
          isAtivo
            ? isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.05)'
            : isDark
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(0,0,0,0.02)',
        )}
      </View>
    </View>
  );
};
