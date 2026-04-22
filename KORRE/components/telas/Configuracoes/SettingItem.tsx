import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Configuracoes/configuracoesStyles';

interface Props {
  icon: any; // O componente Lucide icon
  title: string;
  subtitle?: string;
  action?: 'toggle' | 'link';
  value?: {
    current?: boolean;
    setter?: (val: boolean) => void;
    label?: string;
  };
  onClick?: () => void;
  isDark: boolean;
  isLast?: boolean; // Para remover a borda do último item da lista
}

export const SettingItem = ({
  icon: Icon,
  title,
  subtitle,
  action = 'link',
  value,
  onClick,
  isDark,
  isLast = false,
}: Props) => {
  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#666' : '#888';
  const iconBg = isDark ? '#202020' : '#F0F0F0';

  return (
    <TouchableOpacity
      activeOpacity={action === 'link' ? 0.7 : 1}
      onPress={action === 'link' ? onClick : undefined}
      style={[
        styles.itemContainer,
        {
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
    >
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: iconBg },
          ]}
        >
          <Icon size={20} color="#00C853" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.itemTitle, { color: textColor }]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.itemSubtitle,
                { color: textMuted },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {action === 'toggle' && value?.setter ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => value.setter!(!value.current)}
          style={[
            styles.toggleTrack,
            {
              backgroundColor: value.current
                ? '#00C853'
                : isDark
                  ? '#333'
                  : '#CCC',
            },
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              {
                alignSelf: value.current
                  ? 'flex-end'
                  : 'flex-start',
              },
            ]}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.itemRight}>
          {value?.label && (
            <Text
              style={[
                styles.itemLabel,
                { color: textMuted },
              ]}
            >
              {value.label}
            </Text>
          )}
          <ChevronRight size={16} color={textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
};
