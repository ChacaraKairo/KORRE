import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import {
  VEICULOS_CONFIG,
  TipoVeiculo,
} from '../../type/typeVeiculos';
import type { Veiculo } from '../../types/database';

import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/perfilInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/(tabs)/perfilDynamicStyles';
import { HeaderPerfil } from '../../components/telas/Perfil/HeaderPerfil';
import { CardUsuario } from '../../components/telas/Perfil/CardUsuario';
import { MetaFinanceira } from '../../components/telas/Perfil/MetaFinanceira';
import { VeiculoResumo } from '../../components/telas/Perfil/VeiculoResumo';
import { AcoesGrid } from '../../components/telas/Perfil/AcoesGrid';
import { ModalEditarPerfil } from '../../components/telas/Perfil/ModalEditarPerfil';

/**
 * Executa a função de perfil screen.
 */
export default function PerfilScreen() {
  const { t } = useTranslation();
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
    listarVeiculosDoUsuario,
    trocarVeiculoAtivo,
  } = usePerfil();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const [modalEditAberto, setModalEditAberto] =
    useState(false);
  const [modalTrocaAberto, setModalTrocaAberto] =
    useState(false);
  const [veiculosDisponiveis, setVeiculosDisponiveis] =
    useState<Veiculo[]>([]);

  /**
   * Executa a função de abrir modal troca.
   */
  const abrirModalTroca = async () => {
    const lista = await listarVeiculosDoUsuario();
    setVeiculosDisponiveis(lista);
    setModalTrocaAberto(true);
  };

  /**
   * Executa a função de selecionar veiculo ativo.
   */
  const selecionarVeiculoAtivo = async (id: number) => {
    const trocou = await trocarVeiculoAtivo(id);
    if (trocou) {
      setModalTrocaAberto(false);
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
            {t('perfil.sair')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalEditarPerfil
        visivel={modalEditAberto}
        onClose={() => setModalEditAberto(false)}
        onSalvoSucesso={() => carregarDados()}
      />

      <Modal
        visible={modalTrocaAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalTrocaAberto(false)}
      >
        <View style={inlineStyles.inline1}>
          <View style={dynamicInlineStyles.inline1({ isDark })}>
            <View style={inlineStyles.inline2}>
              <Text style={dynamicInlineStyles.inline2({ isDark })}>
                {t('garagem.trocar_veiculo')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalTrocaAberto(false)}
                style={dynamicInlineStyles.inline3({ isDark })}
              >
                <X
                  size={20}
                  color={isDark ? '#888' : '#555'}
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    onPress={() => selecionarVeiculoAtivo(v.id)}
                    style={dynamicInlineStyles.inline4({
                      isAtivo,
                      isDark,
                    })}
                  >
                    <View
                      style={dynamicInlineStyles.inline5({
                        isDark,
                      })}
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
                    <View style={inlineStyles.inline3}>
                      <Text
                        style={dynamicInlineStyles.inline6({
                          isDark,
                        })}
                      >
                        {v.modelo}
                      </Text>
                      <Text
                        style={dynamicInlineStyles.inline7({
                          isDark,
                        })}
                      >
                        {v.placa || t('common.sem_placa')}
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
