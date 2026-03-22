import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useOficina } from '../../hooks/oficina/useOficina';
import { styles } from '../../styles/telas/Oficina/oficinaStyles';
import { useTema } from '../../hooks/modo_tema';

// Componentes
import { CardVeiculoOficina } from '../../components/telas/Oficina/CardVeiculoOficina';
import { ItemManutencaoCard } from '../../components/telas/Oficina/ItemManutencaoCard';
import { ModalNovoItem } from '../../components/telas/Oficina/ModalNovoItem';
import { ModalResetManutencao } from '../../components/telas/Oficina/ModalResetManutencao';

export default function OficinaScreen() {
  const router = useRouter();
  const {
    logs,
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
    novoItemNome,
    setNovoItemNome,
    novoItemIntervalo,
    setNovoItemIntervalo,
    novoItemTempo,
    setNovoItemTempo,
    novoItemUltimaTrocaKm,
    setNovoItemUltimaTrocaKm,
    novoItemUltimaTrocaData,
    setNovoItemUltimaTrocaData,
    novoItemIcone,
    setNovoItemIcone,
    handleAddNovoItem,
    handleReset,
    handleConfirmReset,
  } = useOficina();

  const statusResumo = getStatusResumo();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

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
              colors={['#00C853']}
              tintColor="#00C853"
            />
          }
        >
          <CardVeiculoOficina
            veiculo={veiculoConsultado}
            statusResumo={statusResumo}
            onOpenSelector={() => router.push('/garagem')}
          />

          <View>
            {itensVisiveis.map((item: any) => (
              <ItemManutencaoCard
                // A chave dinâmica com o id do veículo força o re-render total dos itens na troca
                key={`${veiculoConsultado?.id || 'v'}_${item.id}`}
                item={item}
                info={calcularProgresso(item)}
                onResetPress={() => handleReset(item)}
              />
            ))}

            {/* Console de Logs na Tela */}
            <View
              style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: isDark
                  ? '#111'
                  : '#E0E0E0',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? '#333' : '#CCC',
              }}
            >
              <Text
                style={{
                  color: isDark ? '#00C853' : '#007A33',
                  fontWeight: 'bold',
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                Terminal de Logs do Sistema
              </Text>
              {logs.length === 0 ? (
                <Text
                  style={{
                    color: isDark ? '#888' : '#666',
                    fontSize: 12,
                  }}
                >
                  Nenhum evento registado ainda.
                </Text>
              ) : (
                logs.map((log: string, index: number) => (
                  <Text
                    key={index}
                    style={{
                      color: log.includes('[ERRO]')
                        ? '#EF4444'
                        : isDark
                          ? '#FFF'
                          : '#000',
                      fontSize: 10,
                      marginBottom: 4,
                      fontFamily:
                        Platform.OS === 'ios'
                          ? 'Courier'
                          : 'monospace',
                    }}
                  >
                    {log}
                  </Text>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Modal de Criação de Item */}
      <ModalNovoItem
        visible={modalNovoItem}
        onClose={() => setModalNovoItem(false)}
        onSave={handleAddNovoItem}
        nome={novoItemNome}
        setNome={setNovoItemNome}
        intervalo={novoItemIntervalo}
        setIntervalo={setNovoItemIntervalo}
        tempo={novoItemTempo}
        setTempo={setNovoItemTempo}
        ultimaTrocaKm={novoItemUltimaTrocaKm}
        setUltimaTrocaKm={setNovoItemUltimaTrocaKm}
        ultimaTrocaData={novoItemUltimaTrocaData}
        setUltimaTrocaData={setNovoItemUltimaTrocaData}
        icone={novoItemIcone}
        setIcone={setNovoItemIcone}
      />

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
        itemIntervaloKm={
          modalReset.item?.intervalo_km || null
        }
        itemIntervaloMeses={
          modalReset.item?.intervalo_meses || null
        }
        kmAtual={veiculoConsultado?.km_atual || 0}
        ultimoValor={modalReset.ultimoValor}
        isVirtual={modalReset.item?.isVirtual}
      />
    </SafeAreaView>
  );
}
