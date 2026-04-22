import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bike, Car } from 'lucide-react-native';
import { TipoVeiculo } from '../../../hooks/types/index';
import { veiculoSelectorStyles as styles } from '../../../styles/telas/Cadastro/componentes/VeiculoSelectorStyles';

interface VeiculoSelectorProps {
  selecionado: TipoVeiculo;
  aoSelecionar: (tipo: TipoVeiculo) => void;
}

export const VeiculoSelector: React.FC<
  VeiculoSelectorProps
> = ({ selecionado, aoSelecionar }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[
        styles.botao,
        selecionado === 'moto' && styles.ativo,
      ]}
      onPress={() => aoSelecionar('moto')}
      activeOpacity={0.8}
    >
      <Bike
        color={selecionado === 'moto' ? '#121212' : '#555'}
        size={32}
      />
      <Text
        style={[
          styles.texto,
          selecionado === 'moto' && styles.textoAtivo,
        ]}
      >
        MOTO
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.botao,
        selecionado === 'carro' && styles.ativo,
      ]}
      onPress={() => aoSelecionar('carro')}
      activeOpacity={0.8}
    >
      <Car
        color={selecionado === 'carro' ? '#121212' : '#555'}
        size={32}
      />
      <Text
        style={[
          styles.texto,
          selecionado === 'carro' && styles.textoAtivo,
        ]}
      >
        CARRO
      </Text>
    </TouchableOpacity>
  </View>
);
