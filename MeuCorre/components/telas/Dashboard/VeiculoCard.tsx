import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {
  Bike,
  Car,
  Motorbike,
  Bus,
  ArrowLeftRight,
  ClipboardList,
  X,
} from 'lucide-react-native';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useTema } from '../../../hooks/modo_tema';
import db from '../../../database/DatabaseInit';
import { useRouter } from 'expo-router';

interface VeiculoProps {
  veiculo: {
    tipo: 'moto' | 'carro' | 'bicicleta' | 'van';
    modelo: string;
    placa: string;
  } | null;
  rendimento: string;
  onTrocar: () => void;
  onOficina: () => void;
}

export const VeiculoCard: React.FC<VeiculoProps> = ({
  veiculo,
  rendimento,
  onTrocar,
  onOficina,
}) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  const [modalAberto, setModalAberto] = useState(false);
  const [listaVeiculos, setListaVeiculos] = useState<any[]>(
    [],
  );

  const abrirModal = async () => {
    setModalAberto(true);
    const veiculos = await db.getAllAsync(
      'SELECT * FROM veiculos ORDER BY ativo DESC, id ASC',
    );
    setListaVeiculos(veiculos);
  };

  const selecionarVeiculo = async (id: number) => {
    await db.runAsync('UPDATE veiculos SET ativo = 0');
    await db.runAsync(
      'UPDATE veiculos SET ativo = 1 WHERE id = ?',
      [id],
    );
    setModalAberto(false);
    router.replace('/dashboard' as any); // Força a atualização do Dashboard
  };

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
            {/* Lógica de Ícones Dinâmica */}
            {(!veiculo || veiculo.tipo === 'moto') && (
              <Motorbike size={32} color="#0A0A0A" />
            )}
            {veiculo?.tipo === 'bicicleta' && (
              <Bike size={32} color="#0A0A0A" />
            )}
            {veiculo?.tipo === 'carro' && (
              <Car size={32} color="#0A0A0A" />
            )}
            {veiculo?.tipo === 'van' && (
              <Bus size={32} color="#0A0A0A" />
            )}
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
          onPress={abrirModal}
        >
          <ArrowLeftRight size={18} color="#00C853" />
          <Text style={styles.btnAcaoVeiculoTexto}>
            Trocar
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
                  onPress={() => selecionarVeiculo(item.id)}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};
