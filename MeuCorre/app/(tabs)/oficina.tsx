import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
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
    veiculoConsultado,
    itensVisiveis,
    setListaAberta,
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CardVeiculoOficina
          veiculo={veiculoConsultado}
          statusResumo={statusResumo}
          onOpenSelector={() => setListaAberta(true)}
        />

        <View>
          {itensVisiveis.map((item: any) => (
            <ItemManutencaoCard
              key={item.id}
              item={item}
              info={calcularProgresso(item)}
              onResetPress={() => handleReset(item)}
            />
          ))}
        </View>
      </ScrollView>

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
