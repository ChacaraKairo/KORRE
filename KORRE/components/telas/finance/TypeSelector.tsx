import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TypeSelectorProps {
  tipo: 'ganho' | 'despesa';
  setTipo: (tipo: 'ganho' | 'despesa') => void;
}

export const TypeSelector = ({
  tipo,
  setTipo,
}: TypeSelectorProps) => (
  <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
    <View
      style={{
        backgroundColor: 'rgba(33, 33, 33, 0.5)',
        padding: 6,
        borderRadius: 16,
        flexDirection: 'row',
        gap: 4,
        borderColor: '#333',
        borderWidth: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => setTipo('ganho')}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor:
            tipo === 'ganho' ? '#00C853' : 'transparent',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: '900',
            textTransform: 'uppercase',
            color: tipo === 'ganho' ? '#000' : '#888',
          }}
        >
          Entrada (+)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setTipo('despesa')}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor:
            tipo === 'despesa' ? '#D50000' : 'transparent',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: '900',
            textTransform: 'uppercase',
            color: tipo === 'despesa' ? '#FFF' : '#888',
          }}
        >
          Saída (-)
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
