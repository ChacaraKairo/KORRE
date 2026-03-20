import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LogOut } from 'lucide-react-native';

import { usePerfil } from '../../hooks/perfil_user/usePerfil';
import { styles } from '../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../hooks/modo_tema';

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

        <VeiculoResumo veiculo={veiculo} />

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
    </View>
  );
}
