import {
  ChevronRight,
  Info,
  Plus,
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/origemganhosInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/(tabs)/origemganhosDynamicStyles';
// Importando a Lógica, Estilos e Componentes
import { HeaderOrigem } from '../../components/telas/OrigemGanhos/HeaderOrigem';
import { ItemOrigem } from '../../components/telas/OrigemGanhos/ItemOrigem';
import { ModalNovaOrigem } from '../../components/telas/OrigemGanhos/ModalNovaOrigem';
import { Colors } from '../../constants/theme';
import { useOrigemGanhos } from '../../hooks/OrigemGanhos/useOrigemGanhos';
import { useTema } from '../../hooks/modo_tema';
import { styles } from '../../styles/telas/OrigemGanhos/OrigemGanhosStyles';

/**
 * Executa a função de origem ganhos screen.
 */
export default function OrigemGanhosScreen() {
  const { t } = useTranslation();
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
        style={inlineStyles.inline1}
        keyboardShouldPersistTaps="handled"
      >
        <View style={inlineStyles.inline2}>
          {origens.map((item) => (
            <ItemOrigem
              key={item.id}
              item={item}
              isSelecionado={selecionados.includes(item.id)}
              onToggle={toggleOrigem}
            />
          ))}
        </View>

        {/* Botão de Adicionar Nova Origem */}
        <View
          style={inlineStyles.inline3}
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
              {t('origem_ganhos.adicionar_plataforma')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View
          style={dynamicInlineStyles.inline1({ cardColor, isDark, borderColor })}
        >
          <Info size={20} color={primaryColor} />
          <Text
            style={dynamicInlineStyles.inline2({ textMuted })}
          >
            {t('origem_ganhos.info')}
          </Text>
        </View>
      </ScrollView>

      {/* Footer com botão de Concluir */}
      <View
        style={dynamicInlineStyles.inline3({ isDark, borderColor })}
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
            style={inlineStyles.inline4}
          >
            {t('origem_ganhos.finalizar')}
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
