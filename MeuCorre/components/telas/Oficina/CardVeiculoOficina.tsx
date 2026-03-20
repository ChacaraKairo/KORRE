import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronDown,
  Bike,
  Motorbike,
  Car,
  Bus,
  Gauge,
  X,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../../styles/telas/Oficina/oficinaStyles';
import { useTema } from '../../../hooks/modo_tema';
import db from '../../../database/DatabaseInit';

interface Props {
  veiculo: any;
  statusResumo: { texto: string; cor: string; bg: string };
  onOpenSelector: () => void;
}

export const CardVeiculoOficina = ({
  veiculo,
  statusResumo,
  onOpenSelector,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  const [modalAberto, setModalAberto] = useState(false);
  const [listaVeiculos, setListaVeiculos] = useState<any[]>(
    [],
  );
  const [carregando, setCarregando] = useState(false);

  const abrirModal = async () => {
    setModalAberto(true);
    setCarregando(true);
    try {
      const veiculos = await db.getAllAsync(
        'SELECT * FROM veiculos ORDER BY ativo DESC, id ASC',
      );
      setListaVeiculos(veiculos);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const selecionarVeiculo = async (id: number) => {
    try {
      await db.runAsync('UPDATE veiculos SET ativo = 0');
      await db.runAsync(
        'UPDATE veiculos SET ativo = 1 WHERE id = ?',
        [id],
      );
      setModalAberto(false);
      // Força a atualização da tela substituindo a rota atual
      router.replace('/oficina' as any);
    } catch (error) {
      console.error('Erro ao trocar veículo:', error);
    }
  };

  return (
    <View
      style={[
        styles.cardVeiculo,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#222' : '#E0E0E0',
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.veiculoHeader}>
        <View>
          <Text
            style={[
              styles.labelAviso,
              { color: isDark ? '#888' : '#555' },
            ]}
          >
            A visualizar:
          </Text>
          <Text
            style={[
              styles.veiculoModelo,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            {veiculo?.modelo || 'Sem Veículo'}
          </Text>
          <Text
            style={[
              styles.veiculoPlaca,
              { color: isDark ? '#888' : '#555' },
            ]}
          >
            {veiculo?.placa || '---'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.btnTrocarVeiculo,
            {
              backgroundColor: isDark
                ? '#0A0A0A'
                : '#F5F5F5',
            },
          ]}
          onPress={abrirModal}
        >
          <ChevronDown size={20} color="#00C853" />
          <View style={styles.iconBox}>
            {(!veiculo?.tipo ||
              veiculo?.tipo === 'moto') && (
              <Motorbike size={20} color="#00C853" />
            )}
            {veiculo?.tipo === 'bicicleta' && (
              <Bike size={20} color="#00C853" />
            )}
            {veiculo?.tipo === 'carro' && (
              <Car size={20} color="#00C853" />
            )}
            {veiculo?.tipo === 'van' && (
              <Bus size={20} color="#00C853" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.veiculoStats}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginBottom: 2,
            }}
          >
            <Gauge size={12} color="#444" />
            <Text
              style={{
                color: '#444',
                fontSize: 8,
                fontWeight: '900',
                textTransform: 'uppercase',
              }}
            >
              KM Atual
            </Text>
          </View>
          <Text
            style={{
              color: isDark ? '#FFF' : '#000',
              fontSize: 16,
              fontWeight: '900',
            }}
          >
            {veiculo?.km_atual?.toLocaleString() || '0'} km
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: statusResumo.bg,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: statusResumo.cor,
            }}
          >
            <Text
              style={{
                color: statusResumo.cor,
                fontSize: 10,
                fontWeight: '900',
                textTransform: 'uppercase',
              }}
            >
              {statusResumo.texto}
            </Text>
          </View>
        </View>
      </View>

      {/* MODAL DE TROCA DE VEÍCULO */}
      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAberto(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: isDark ? '#333' : '#E0E0E0',
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
                  color: isDark ? '#FFF' : '#000',
                  fontSize: 18,
                  fontWeight: '900',
                }}
              >
                Trocar Veículo Ativo
              </Text>
              <TouchableOpacity
                onPress={() => setModalAberto(false)}
                style={{
                  padding: 8,
                  backgroundColor: isDark
                    ? '#222'
                    : '#F5F5F5',
                  borderRadius: 12,
                }}
              >
                <X
                  size={20}
                  color={isDark ? '#888' : '#555'}
                />
              </TouchableOpacity>
            </View>

            {carregando ? (
              <ActivityIndicator
                size="large"
                color="#00C853"
                style={{ marginVertical: 20 }}
              />
            ) : (
              <FlatList
                data={listaVeiculos}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      marginBottom: 12,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: item.ativo
                        ? '#00C853'
                        : isDark
                          ? '#333'
                          : '#E0E0E0',
                      backgroundColor: item.ativo
                        ? 'rgba(0, 200, 83, 0.1)'
                        : isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                    }}
                    onPress={() =>
                      selecionarVeiculo(item.id)
                    }
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        padding: 10,
                        backgroundColor: isDark
                          ? '#161616'
                          : '#FFF',
                        borderRadius: 12,
                        marginRight: 16,
                        borderWidth: 1,
                        borderColor: isDark
                          ? '#222'
                          : '#E0E0E0',
                      }}
                    >
                      {(!item.tipo ||
                        item.tipo === 'moto') && (
                        <Motorbike
                          size={24}
                          color="#00C853"
                        />
                      )}
                      {item.tipo === 'bicicleta' && (
                        <Bike size={24} color="#00C853" />
                      )}
                      {item.tipo === 'carro' && (
                        <Car size={24} color="#00C853" />
                      )}
                      {item.tipo === 'van' && (
                        <Bus size={24} color="#00C853" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: isDark ? '#FFF' : '#000',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}
                      >
                        {item.modelo}
                      </Text>
                      <Text
                        style={{
                          color: isDark ? '#888' : '#555',
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {item.placa || 'Sem placa'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
