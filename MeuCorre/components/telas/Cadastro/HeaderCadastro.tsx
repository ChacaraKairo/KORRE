// Arquivo: src/components/telas/Cadastro/HeaderCadastro.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

interface HeaderProps {
  tipoVeiculo?: any;
}

export const HeaderCadastro: React.FC<HeaderProps> = () => {
  return (
    <View style={headerStyles.header}>
      {/* Container que faz o corte (Crop) */}
      <View style={headerStyles.imageCropContainer}>
        <Image
          source={require('../../../assets/images/android-icon-monochrome.png')}
          style={headerStyles.logoAumentada}
          resizeMode="cover" // Mudado para cover para preencher a área antes do corte
        />
      </View>
      <Text style={headerStyles.subtitulo}>
        Configure seu perfil e assuma o controle do seu
        corre.
      </Text>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 40, // Reduzi um pouco a margem superior para compensar a logo maior
    marginBottom: 30,
  },
  imageCropContainer: {
    width: 160, // Largura total visível
    height: 110, // Altura visível (menor que a imagem para cortar)
    overflow: 'hidden', // REGRA MÁGICA: Esconde o que passar do tamanho da View
    justifyContent: 'center', // Centraliza a imagem verticalmente
    alignItems: 'center', // Centraliza a imagem horizontalmente
    marginBottom: 16,
    // Garante que não há fundos ou bordas aparecendo
  },
  logoAumentada: {
    width: 160, // Tamanho real renderizado (bem maior)
    height: 160, // Tamanho real renderizado (bem maior)
    // Como a View tem height 110, 50px (25px em cima, 25px embaixo) serão cortados
  },
  subtitulo: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
