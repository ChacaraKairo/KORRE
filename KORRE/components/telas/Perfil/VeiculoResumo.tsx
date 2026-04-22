import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  ArrowLeftRight,
  Settings2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router'; // Adicionado para a navegação
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';
import {
  VEICULOS_CONFIG,
  TipoVeiculo,
} from '../../../type/typeVeiculos';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';

interface Props {
  veiculo: any;
  // Opcional: Função que você pode passar do perfil.tsx para abrir um modal de troca de veículo
  onTrocarVeiculo?: () => void;
}

export const VeiculoResumo = ({
  veiculo,
  onTrocarVeiculo,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={[
          styles.secaoTitle,
          {
            color: isDark ? '#FFFFFF' : '#000000',
            marginBottom: 8,
          },
        ]}
      >
        A Tua Máquina
      </Text>

      <View
        style={[
          styles.cardVeiculo,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12, // Reduzido para ficar mais estreito
            paddingHorizontal: 16,
            marginBottom: 0,
            borderRadius: 20,
          },
        ]}
      >
        {/* Esquerda: Ícone, Modelo e Placa */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <View
            style={[
              styles.veiculoIconBox,
              {
                padding: 10,
                marginRight: 12,
                borderRadius: 12,
              },
            ]}
          >
            {(() => {
              const tipo =
                (veiculo?.tipo as TipoVeiculo) || 'moto';
              const Icone =
                VEICULOS_CONFIG[tipo]?.icone ||
                VEICULOS_CONFIG.moto.icone;
              return <Icone size={20} color="#00C853" />;
            })()}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.veiculoModelo,
                {
                  color: isDark ? '#FFFFFF' : '#000000',
                  fontSize: 14,
                  marginBottom: 2,
                },
              ]}
              numberOfLines={1} // Evita quebra de linha se o nome for muito grande
            >
              {veiculo?.modelo || 'Nenhum veículo'}
            </Text>
            <Text
              style={[
                styles.veiculoPlaca,
                {
                  color: isDark ? '#888' : '#555',
                  fontSize: 12,
                  marginTop: 0,
                },
              ]}
            >
              {veiculo?.placa || 'Adiciona um veículo'}
            </Text>
          </View>
        </View>

        {/* Direita: Botões de Ação */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Botão: Trocar Veículo */}
          <TouchableOpacity
            onPress={
              onTrocarVeiculo ||
              (() =>
                showCustomAlert(
                  'Trocar',
                  'Abrir modal de troca de veículo',
                ))
            }
            style={{
              padding: 8,
              backgroundColor: isDark
                ? '#0A0A0A'
                : '#F5F5F5',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? '#333' : '#E0E0E0',
            }}
          >
            <ArrowLeftRight
              size={18}
              color={isDark ? '#FFF' : '#333'}
            />
          </TouchableOpacity>

          {/* Botão: Ir para a Garagem / Oficina */}
          <TouchableOpacity
            onPress={() => router.push('/garagem')} // Rota para a tela Oficina/Garagem que criamos antes
            style={{
              padding: 8,
              backgroundColor: 'rgba(0, 200, 83, 0.1)',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(0, 200, 83, 0.3)',
            }}
          >
            <Settings2 size={18} color="#00C853" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
