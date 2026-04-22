// src/components/telas/Cadastro/RestaurarFluxoCadastro.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { UploadCloud } from 'lucide-react-native';
import { useRestaurarBackup } from '../../../hooks/cadastro/useRestaurarBackup';

export function RestaurarFluxoCadastro() {
  const { selecionarArquivo, carregando } =
    useRestaurarBackup();

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 20,
        padding: 16,
        backgroundColor: '#161616',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text
          style={{
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          Já usou o MeuCorre antes?
        </Text>
        <Text style={{ color: '#888', fontSize: 12 }}>
          Importe seu backup para pular o cadastro.
        </Text>
      </View>

      <TouchableOpacity
        onPress={selecionarArquivo}
        disabled={carregando}
        style={{
          backgroundColor: '#00C853',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {carregando ? (
          <ActivityIndicator color="#0A0A0A" size="small" />
        ) : (
          <>
            <UploadCloud size={18} color="#0A0A0A" />
            <Text
              style={{
                color: '#0A0A0A',
                fontWeight: 'bold',
              }}
            >
              Importar
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
