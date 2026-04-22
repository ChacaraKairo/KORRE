// src/components/telas/Oficina/GridItensManutencao.tsx
import React from 'react';
import { View } from 'react-native';
import { ItemManutencaoCard } from './ItemManutencaoCard';

interface GridProps {
  veiculoId: number | undefined;
  itens: any[];
  calcularProgresso: (item: any) => any;
  handleReset: (item: any) => void;
}

export const GridItensManutencao: React.FC<GridProps> = ({
  veiculoId,
  itens,
  calcularProgresso,
  handleReset,
}) => {
  return (
    <View>
      {itens.map((item: any) => (
        <ItemManutencaoCard
          // A chave dinâmica garante que ao trocar de veículo, os cards sejam recriados
          key={`${veiculoId || 'v'}_${item.id}`}
          item={item}
          info={calcularProgresso(item)}
          onResetPress={() => handleReset(item)}
        />
      ))}
    </View>
  );
};
