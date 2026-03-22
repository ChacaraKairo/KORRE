import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LogOut, X } from 'lucide-react-native';

import { usePerfil } from '../../hooks/perfil_user/usePerfil';
import { styles } from '../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../hooks/modo_tema';
import db from '../../database/DatabaseInit';
import {
  VEICULOS_CONFIG,
  TipoVeiculo,
} from '../../type/typeVeiculos';

// Sub-componentes
import { HeaderPerfil } from '../../components/telas/Perfil/HeaderPerfil';
import { CardUsuario } from '../../components/telas/Perfil/CardUsuario';
import { MetaFinanceira } from '../../components/telas/Perfil/MetaFinanceira';
import { VeiculoResumo } from '../../components/telas/Perfil/VeiculoResumo';
import { AcoesGrid } from '../../components/telas/Perfil/AcoesGrid';
import { ModalEditarPerfil } from '../../components/telas/Perfil/ModalEditarPerfil';

export default function PerfilScreen() {
  const {
    usuario,
    veiculo,
    meta,
    tipoMeta,
    setMeta,
    loading,
    salvarMeta,
    realizarLogout,
    carregarDados,
    alterarFoto,
  } = usePerfil();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Estado que controla a visibilidade do modal de edição
  const [modalEditAberto, setModalEditAberto] =
    useState(false);

  // Estados para o Modal de Troca de Veículo
  const [modalTrocaAberto, setModalTrocaAberto] =
    useState(false);
  const [veiculosDisponiveis, setVeiculosDisponiveis] =
    useState<any[]>([]);

  // Carrega os veículos e abre o modal na própria tela
  const abrirModalTroca = async () => {
    try {
      const lista = await db.getAllAsync(
        'SELECT * FROM veiculos ORDER BY ativo DESC, id ASC',
      );
      setVeiculosDisponiveis(lista);
      setModalTrocaAberto(true);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const trocarVeiculoAtivo = async (id: number) => {
    try {
      await db.runAsync('UPDATE veiculos SET ativo = 0');
      await db.runAsync(
        'UPDATE veiculos SET ativo = 1 WHERE id = ?',
        [id],
      );
      setModalTrocaAberto(false);
      carregarDados(); // Recarrega os dados do perfil (incluindo o novo veículo ativo)
    } catch (error) {
      console.error('Erro ao trocar veiculo:', error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
    >
      <HeaderPerfil />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Passamos a função para abrir o modal ao clicar no botão de editar */}
        <CardUsuario
          usuario={usuario}
          onEditPress={() => setModalEditAberto(true)}
          onCameraPress={alterarFoto}
        />

        <MetaFinanceira
          meta={meta}
          setMeta={setMeta}
          salvarMeta={salvarMeta}
          tipoMeta={tipoMeta}
        />

        <VeiculoResumo
          veiculo={veiculo}
          onTrocarVeiculo={abrirModalTroca}
        />

        <AcoesGrid />

        <TouchableOpacity
          style={[
            styles.btnLogout,
            {
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderColor: isDark ? '#222' : '#E0E0E0',
              borderWidth: 1,
            },
          ]}
          onPress={realizarLogout}
        >
          <LogOut size={18} color="#F44336" />
          <Text
            style={[
              styles.btnLogoutTexto,
              { color: '#F44336' },
            ]}
          >
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Renderização do Modal */}
      <ModalEditarPerfil
        visivel={modalEditAberto}
        onClose={() => setModalEditAberto(false)}
        onSalvoSucesso={() => carregarDados()}
      />

      {/* Modal de Troca de Veículo */}
      <Modal
        visible={modalTrocaAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalTrocaAberto(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
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
              padding: 20,
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
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: isDark ? '#FFF' : '#000',
                }}
              >
                Trocar Veículo
              </Text>
              <TouchableOpacity
                onPress={() => setModalTrocaAberto(false)}
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
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {veiculosDisponiveis.map((v) => {
                const isAtivo = v.ativo === 1;
                const tipo =
                  (v.tipo as TipoVeiculo) || 'moto';
                const Icone =
                  VEICULOS_CONFIG[tipo]?.icone ||
                  VEICULOS_CONFIG.moto.icone;

                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => trocarVeiculoAtivo(v.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      marginBottom: 12,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: isAtivo
                        ? '#00C853'
                        : isDark
                          ? '#333'
                          : '#E0E0E0',
                      backgroundColor: isAtivo
                        ? 'rgba(0,200,83,0.1)'
                        : isDark
                          ? '#0A0A0A'
                          : '#F5F5F5',
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: isDark
                          ? '#161616'
                          : '#FFF',
                        marginRight: 12,
                      }}
                    >
                      <Icone
                        size={24}
                        color={
                          isAtivo
                            ? '#00C853'
                            : isDark
                              ? '#888'
                              : '#555'
                        }
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: isDark ? '#FFF' : '#000',
                        }}
                      >
                        {v.modelo}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isDark ? '#888' : '#555',
                        }}
                      >
                        {v.placa || 'Sem placa'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
