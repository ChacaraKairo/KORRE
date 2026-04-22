import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Check,
  Briefcase,
  Smartphone,
  Car,
  Navigation,
  Package,
  Truck,
  Zap,
  ShoppingBag,
} from 'lucide-react-native';
import { styles } from '../../../styles/telas/OrigemGanhos/OrigemGanhosStyles';

const IconComponents: any = {
  Smartphone,
  Car,
  Navigation,
  Package,
  Truck,
  Briefcase,
  Zap,
  ShoppingBag,
};

interface ItemOrigemProps {
  item: any;
  isSelecionado: boolean;
  onToggle: (id: number) => void;
}

export const ItemOrigem: React.FC<ItemOrigemProps> = ({
  item,
  isSelecionado,
  onToggle,
}) => {
  const Icon = IconComponents[item.iconId] || Briefcase;

  return (
    <TouchableOpacity
      style={[
        styles.itemCard,
        isSelecionado && { borderColor: item.cor },
      ]}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: `${item.cor}15` },
          ]}
        >
          <Icon size={20} color={item.cor} />
        </View>
        <View>
          <Text
            style={[
              styles.itemName,
              isSelecionado && { color: '#FFF' },
            ]}
          >
            {item.nome}
          </Text>
          <Text style={styles.itemCategory}>
            {item.categoria}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.checkbox,
          isSelecionado && {
            backgroundColor: item.cor,
            borderColor: item.cor,
          },
        ]}
      >
        {isSelecionado && (
          <Check
            size={14}
            color="#0A0A0A"
            strokeWidth={4}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
