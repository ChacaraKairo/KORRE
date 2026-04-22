// MeuCorre/app/(tabs)/origemganhos.tsx
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
import { Colors } from '../../constants/theme';
import { useOrigemGanhos } from '../../hooks/OrigemGanhos/useOrigemGanhos';
import { useTema } from '../../hooks/modo_tema';
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

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Centralização de cores usando o tema global
  const currentColors = isDark ? Colors.dark : Colors.light;
  const bgColor = isDark
    ? currentColors.background
    : currentColors.backgroundSecondary;
  const cardColor = currentColors.card;
  const borderColor = currentColors.border;
  const textColor = currentColors.text;
  const textMuted = currentColors.textSecondary;
  const primaryColor = currentColors.primary; // Verde Korre do constants/theme.ts

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      <HeaderOrigem busca={busca} setBusca={setBusca} />

      {/* ScrollView principal da tela */}
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* === INÍCIO DA ÁREA ALTERADA === */}
        {/* Renderização da lista de origens (Limitada a 4 itens visíveis com View fixa) */}
        <View style={{ padding: 20, gap: 10 }}>
          {origens.slice(0, 4).map((item) => (
            <ItemOrigem
              key={item.id}
              item={item}
              isSelecionado={selecionados.includes(item.id)}
              onToggle={toggleOrigem}
            />
          ))}
        </View>
        {/* === FIM DA ÁREA ALTERADA === */}

        {/* Botão de Adicionar Nova Origem */}
        <View
          style={{ paddingHorizontal: 20, marginTop: 5 }}
        >
          <TouchableOpacity
            onPress={() => setModalAberto(true)}
            style={[
              styles.btnAddManual,
              {
                backgroundColor: cardColor,
                borderColor: borderColor,
                borderWidth: 1,
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.btnAddIcon}>
              <Plus
                size={22}
                color={primaryColor}
                strokeWidth={3}
              />
            </View>
            <Text
              style={[
                styles.btnAddText,
                { color: textColor },
              ]}
            >
              ADICIONAR NOVA PLATAFORMA
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: cardColor,
            margin: 20,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: isDark ? 0 : 1,
            borderColor: borderColor,
          }}
        >
          <Info size={20} color={primaryColor} />
          <Text
            style={{
              color: textMuted,
              marginLeft: 10,
              flex: 1,
              fontSize: 12,
            }}
          >
            Cada cor e ícone escolhido será usado no seu
            Dashboard para organizar os seus ganhos no
            Korre.
          </Text>
        </View>
      </ScrollView>

      {/* Footer com botão de Concluir */}
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderColor: isDark ? cardColor : borderColor,
        }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: primaryColor,
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
            Finalizar Escolha
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
