// src/app/(telas)/oficina.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useOficina } from '../../hooks/oficina/useOficina';
import { styles } from '../../styles/telas/Oficina/oficinaStyles';
import { useTema } from '../../hooks/modo_tema';

// Componentes
import { CardVeiculoOficina } from '../../components/telas/Oficina/CardVeiculoOficina';
import { ModalNovoItem } from '../../components/telas/Oficina/ModalNovoItem';
import { ModalResetManutencao } from '../../components/telas/Oficina/ModalResetManutencao';
import { GridItensManutencao } from '../../components/telas/Oficina/GridItensManutencao';

export default function OficinaScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    loading,
    refreshing,
    onRefresh,
    veiculoConsultado,
    itensVisiveis,
    modalNovoItem,
    setModalNovoItem,
    modalReset,
    setModalReset,
    calcularProgresso,
    getStatusResumo,
    handleReset,
    handleConfirmReset,
    carregarDados,
  } = useOficina();

  const statusResumo = getStatusResumo();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnIcon}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#666" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? '#FFF' : '#000' },
          ]}
        >
          Oficina
        </Text>

        <TouchableOpacity
          style={[
            styles.btnIcon,
            { borderColor: '#00C853' },
          ]}
          onPress={() => setModalNovoItem(true)}
        >
          <Plus size={20} color="#00C853" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00C853"
            />
          }
        >
          <CardVeiculoOficina
            veiculo={veiculoConsultado}
            statusResumo={statusResumo}
            onOpenSelector={() => router.push('/garagem')}
          />

          {/* Grid de Itens com lógica encapsulada */}
          <GridItensManutencao
            veiculoId={veiculoConsultado?.id}
            itens={itensVisiveis}
            calcularProgresso={calcularProgresso}
            handleReset={handleReset}
          />
        </ScrollView>
      )}

      {/* Modal de Novo Item */}
      <ModalNovoItem
        visible={modalNovoItem}
        onClose={() => setModalNovoItem(false)}
        veiculoId={veiculoConsultado?.id}
        onRefresh={carregarDados}
      />

      {/* Modal de Reset (Renovação de Ciclo) */}
      <ModalResetManutencao
        visible={modalReset.visivel}
        onClose={() =>
          setModalReset({
            visivel: false,
            item: null,
            ultimoValor: 0,
          })
        }
        onConfirm={handleConfirmReset}
        itemNome={modalReset.item?.nome || ''}
        itemIcone={modalReset.item?.icone || 'wrench'}
        itemIntervaloKm={modalReset.item?.intervalo_km}
        itemIntervaloMeses={
          modalReset.item?.intervalo_meses
        }
        kmAtual={veiculoConsultado?.km_atual || 0}
        ultimoValor={modalReset.ultimoValor}
        isVirtual={modalReset.item?.isVirtual}
      />
    </SafeAreaView>
  );
}
