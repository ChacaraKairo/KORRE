import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Warehouse,
  ClipboardList,
  X,
} from 'lucide-react-native';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useTema } from '../../../hooks/modo_tema';
import db from '../../../database/DatabaseInit';
import { useRouter } from 'expo-router';
import {
  VEICULOS_CONFIG,
  TipoVeiculo,
} from '../../../type/typeVeiculos';

interface VeiculoProps {
  veiculo: {
    tipo: TipoVeiculo;
    modelo: string;
    placa: string;
  } | null;
  rendimento: string;
  onGaragem?: () => void;
  onOficina: () => void;
}

export const VeiculoCard: React.FC<VeiculoProps> = ({
  veiculo,
  rendimento,
  onGaragem,
  onOficina,
}) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  return (
    <View
      style={[
        styles.cardPreto,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#222' : '#E0E0E0',
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.veiculoHeader}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <View style={styles.veiculoIconeBadge}>
            {(() => {
              // Lógica de Ícones Dinâmica baseada no typeVeiculos
              const tipo =
                (veiculo?.tipo as TipoVeiculo) || 'moto';
              const Icone =
                VEICULOS_CONFIG[tipo]?.icone ||
                VEICULOS_CONFIG.moto.icone;
              return <Icone size={32} color="#0A0A0A" />;
            })()}
          </View>
          <View>
            <Text
              style={[
                styles.veiculoTextoPrimario,
                { color: isDark ? '#FFF' : '#000' },
              ]}
            >
              {veiculo?.modelo || 'Sem Veículo'}
            </Text>
            <Text
              style={[
                styles.veiculoTextoSecundario,
                { color: isDark ? '#888' : '#555' },
              ]}
            >
              {veiculo?.placa || '---'}
            </Text>
          </View>
        </View>

        <View style={styles.eficienciaContainer}>
          <Text
            style={[
              styles.eficienciaLabel,
              { color: isDark ? '#666' : '#888' },
            ]}
          >
            EFICIÊNCIA
          </Text>
          <Text
            style={[
              styles.eficienciaValor,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            R$ {rendimento}/km
          </Text>
        </View>
      </View>

      <View style={styles.acoesVeiculoRow}>
        <TouchableOpacity
          style={[
            styles.btnAcaoVeiculo,
            {
              backgroundColor: isDark
                ? '#0A0A0A'
                : '#F5F5F5',
            },
          ]}
          onPress={() => router.push('/garagem' as any)}
        >
          <Warehouse size={18} color="#00C853" />
          <Text style={styles.btnAcaoVeiculoTexto}>
            Garagem
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnAcaoVeiculo,
            {
              backgroundColor: isDark
                ? '#0A0A0A'
                : '#F5F5F5',
            },
          ]}
          onPress={onOficina}
        >
          <ClipboardList size={18} color="#00C853" />
          <Text style={styles.btnAcaoVeiculoTexto}>
            Oficina
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
