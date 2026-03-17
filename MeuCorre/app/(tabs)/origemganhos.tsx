import {
  ChevronRight,
  Info,
  Plus,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Importando a Lógica, Estilos e Componentes
import { HeaderOrigem } from '../../components/telas/OrigemGanhos/HeaderOrigem';
import { ItemOrigem } from '../../components/telas/OrigemGanhos/ItemOrigem';
import { ModalNovaOrigem } from '../../components/telas/OrigemGanhos/ModalNovaOrigem';
import { useOrigemGanhos } from '../../hooks/OrigemGanhos/useOrigemGanhos';
import { styles } from '../../styles/telas/OrigemGanhos/OrigemGanhosStyles';

export default function OrigemGanhosScreen() {
  // Puxando toda a lógica do nosso Hook
  const {
    busca,
    setBusca,
    selecionados,
    toggleOrigem,
    modalAberto,
    setModalAberto,
    novoNome,
    setNovoNome,
    novoIcone,
    setNovoIcone,
    novaCor,
    setNovaCor,
    origens,
    adicionarOrigem,
    concluirConfiguracao,
  } = useOrigemGanhos();

  return (
    <View style={styles.container}>
      <HeaderOrigem busca={busca} setBusca={setBusca} />

      {/* ScrollView principal da tela */}
      <ScrollView style={{ flex: 1 }}>
        {/* === INÍCIO DA ÁREA ALTERADA === */}
        {/* Renderização da lista de origens (Limitada a 4 itens visíveis) */}
        <View style={{ maxHeight: 340 }}>
          {/* Ajuste este valor se necessário para caber exatamente 4 itens na sua tela */}
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ padding: 20, gap: 10 }}
          >
            {origens.map((item) => (
              <ItemOrigem
                key={item.id}
                item={item}
                isSelecionado={selecionados.includes(
                  item.id,
                )}
                onToggle={toggleOrigem}
              />
            ))}
          </ScrollView>
        </View>
        {/* === FIM DA ÁREA ALTERADA === */}

        {/* Botão de Adicionar Nova Origem */}
        <View
          style={{ paddingHorizontal: 20, marginTop: 5 }}
        >
          <TouchableOpacity
            onPress={() => setModalAberto(true)}
            style={styles.btnAddManual}
            activeOpacity={0.7}
          >
            <View style={styles.btnAddIcon}>
              <Plus
                size={22}
                color="#00C853"
                strokeWidth={3}
              />
            </View>
            <Text style={styles.btnAddText}>
              ADICIONAR OUTRA ORIGEM
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: '#161616',
            margin: 20,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Info size={20} color="#00C853" />
          <Text
            style={{
              color: '#888',
              marginLeft: 10,
              flex: 1,
              fontSize: 12,
            }}
          >
            Cada cor e ícone escolhido será usado no seu
            Dashboard para organizar os seus lucros.
          </Text>
        </View>
      </ScrollView>

      {/* Footer com botão de Concluir */}
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderColor: '#161616',
        }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: '#00C853',
              padding: 15,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
            selecionados.length === 0 && { opacity: 0.5 },
          ]}
          onPress={concluirConfiguracao}
          disabled={selecionados.length === 0}
        >
          <Text
            style={{
              color: '#0A0A0A',
              fontWeight: 'bold',
              fontSize: 16,
              marginRight: 10,
            }}
          >
            Concluir Configuração
          </Text>
          <ChevronRight size={20} color="#0A0A0A" />
        </TouchableOpacity>
      </View>

      <ModalNovaOrigem
        visible={modalAberto}
        nome={novoNome}
        setNome={setNovoNome}
        icone={novoIcone}
        setIcone={setNovoIcone}
        cor={novaCor}
        setCor={setNovaCor}
        onSave={adicionarOrigem}
        onClose={() => setModalAberto(false)}
      />
    </View>
  );
}
