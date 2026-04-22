import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Trash2,
  Save,
  Bike,
  Car,
} from 'lucide-react-native';
import { useEditarPerfil } from '../../../hooks/perfil_user/useEditarPerfil';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Perfil/perfilStyles'; // Usando os teus estilos base

interface Props {
  visivel: boolean;
  onClose: () => void;
  onSalvoSucesso: () => void; // Função para atualizar a tela de trás quando salvar
}

export const ModalEditarPerfil = ({
  visivel,
  onClose,
  onSalvoSucesso,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    nome,
    setNome,
    senha,
    setSenha,
    tipoMeta,
    setTipoMeta,
    veiculos,
    loading,
    salvarDados,
    apagarVeiculo,
  } = useEditarPerfil(visivel, onClose, onSalvoSucesso);

  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A';
  const borderColor = isDark ? '#333' : '#E0E0E0';
  const inputBg = isDark ? '#0A0A0A' : '#F5F5F5';

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: bgColor,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
            maxHeight: '90%',
          }}
        >
          {/* Header do Modal */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: textColor,
                fontSize: 20,
                fontWeight: '900',
              }}
            >
              Editar Dados
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
                backgroundColor: inputBg,
                borderRadius: 16,
              }}
            >
              <X
                size={20}
                color={isDark ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Secção: Dados Pessoais */}
            <Text
              style={{
                color: '#888',
                fontSize: 12,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Dados Pessoais
            </Text>
            <TextInput
              style={{
                backgroundColor: inputBg,
                color: textColor,
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor,
              }}
              value={nome}
              onChangeText={setNome}
              placeholder="O teu nome"
              placeholderTextColor="#666"
            />
            <TextInput
              style={{
                backgroundColor: inputBg,
                color: textColor,
                padding: 16,
                borderRadius: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor,
              }}
              value={senha}
              onChangeText={setSenha}
              placeholder="Nova senha (opcional)"
              placeholderTextColor="#666"
              secureTextEntry
            />

            {/* Secção: Tipo de Meta */}
            <Text
              style={{
                color: '#888',
                fontSize: 12,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Tipo de Meta Financeira
            </Text>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: inputBg,
                borderRadius: 16,
                padding: 6,
                marginBottom: 24,
                borderWidth: 1,
                borderColor,
              }}
            >
              <TouchableOpacity
                onPress={() => setTipoMeta('diaria')}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor:
                    tipoMeta === 'diaria'
                      ? '#00C853'
                      : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color:
                      tipoMeta === 'diaria'
                        ? '#0A0A0A'
                        : '#888',
                  }}
                >
                  Diária
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTipoMeta('semanal')}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor:
                    tipoMeta === 'semanal'
                      ? '#00C853'
                      : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color:
                      tipoMeta === 'semanal'
                        ? '#0A0A0A'
                        : '#888',
                  }}
                >
                  Semanal
                </Text>
              </TouchableOpacity>
            </View>

            {/* Secção: Gerir Veículos */}
            <Text
              style={{
                color: '#888',
                fontSize: 12,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Gerir Veículos
            </Text>
            {veiculos.length === 0 ? (
              <Text
                style={{ color: '#666', marginBottom: 24 }}
              >
                Nenhum veículo cadastrado.
              </Text>
            ) : (
              veiculos.map((v) => (
                <View
                  key={v.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: inputBg,
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {v.tipo === 'carro' ? (
                      <Car size={20} color={textColor} />
                    ) : (
                      <Bike size={20} color={textColor} />
                    )}
                    <View>
                      <Text
                        style={{
                          color: textColor,
                          fontWeight: 'bold',
                        }}
                      >
                        {v.modelo}
                      </Text>
                      <Text
                        style={{
                          color: '#666',
                          fontSize: 12,
                        }}
                      >
                        {v.placa}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      apagarVeiculo(v.id, v.modelo)
                    }
                    style={{ padding: 8 }}
                  >
                    <Trash2 size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={salvarDados}
            disabled={loading}
            style={{
              backgroundColor: '#00C853',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 18,
              borderRadius: 20,
              marginTop: 16,
              gap: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Save size={20} color="#0A0A0A" />
            )}
            <Text
              style={{
                color: '#0A0A0A',
                fontSize: 16,
                fontWeight: '900',
                textTransform: 'uppercase',
              }}
            >
              Salvar Alterações
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
