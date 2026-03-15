import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { financeStyles as styles } from '../../../styles/telas/Finance/financeStyles';

interface CategoryGridProps {
  categorias: Array<{
    id: string;
    icon: any;
    nome?: string;
  }>;
  categoriaSelecionada: string;
  onSelect: (id: string) => void;
  mainColor: string;
}

export const CategoryGrid = ({
  categorias,
  categoriaSelecionada,
  onSelect,
  mainColor,
}: CategoryGridProps) => (
  <View style={styles.gridContainer}>
    <Text style={styles.gridTitle}>
      Selecionar Categoria
    </Text>
    <View style={styles.gridInner}>
      {categorias.map((cat) => {
        const Icon = cat.icon;
        const isSelected = categoriaSelecionada === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[
              styles.categoryButton,
              {
                borderColor: isSelected
                  ? mainColor
                  : '#333',
                backgroundColor: isSelected
                  ? 'rgba(255,255,255,0.05)'
                  : 'transparent',
              },
            ]}
          >
            <Icon
              size={24}
              color={isSelected ? mainColor : '#666'}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.categoryText,
                { color: isSelected ? mainColor : '#666' },
              ]}
            >
              {cat.nome || cat.id}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);
