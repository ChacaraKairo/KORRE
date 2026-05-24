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

import { inlineStyles } from '../../../styles/generated-inline/components/telas/Cadastro/RestaurarFluxoCadastroInlineStyles';
/**
 * Executa a função de restaurar fluxo cadastro.
 */
export function RestaurarFluxoCadastro() {
  const { selecionarArquivo, carregando } =
    useRestaurarBackup();

  return (
    <View
      style={inlineStyles.inline1}
    >
      <View style={inlineStyles.inline2}>
        <Text
          style={inlineStyles.inline3}
        >
          Já usou o KORRE antes?
        </Text>
        <Text style={inlineStyles.inline4}>
          Importe seu backup para pular o cadastro.
        </Text>
      </View>

      <TouchableOpacity
        onPress={selecionarArquivo}
        disabled={carregando}
        style={inlineStyles.inline5}
      >
        {carregando ? (
          <ActivityIndicator color="#0A0A0A" size="small" />
        ) : (
          <>
            <UploadCloud size={18} color="#0A0A0A" />
            <Text
              style={inlineStyles.inline6}
            >
              Importar
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
