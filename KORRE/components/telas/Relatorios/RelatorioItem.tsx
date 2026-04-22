import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Relatorios/relatoriosStyles';

interface RelatorioItemProps {
  item: any;
  cardColor: string;
  borderColor: string;
  textColor: string;
  textMuted: string;
  isDark: boolean;
  onPress: () => void;
}

export function RelatorioItem({
  item,
  cardColor,
  borderColor,
  textColor,
  textMuted,
  isDark,
  onPress,
}: RelatorioItemProps) {
  const { Icon } = item;

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        { backgroundColor: cardColor, borderColor },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: isDark ? '#222' : '#E8F5E9' },
        ]}
      >
        <Icon size={22} color="#00C853" />
      </View>
      <View style={styles.itemTextContainer}>
        <Text
          style={[styles.itemTitle, { color: textColor }]}
        >
          {item.titulo}
        </Text>
        <Text
          style={[styles.itemDesc, { color: textMuted }]}
        >
          {item.desc}
        </Text>
      </View>
      <ChevronRight size={20} color={textMuted} />
    </TouchableOpacity>
  );
}
