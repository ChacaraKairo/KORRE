// KORRE/components/telas/Cadastro/HeaderCadastro.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  View,
} from 'react-native';

import { headerStyles } from '../../../styles/generated/components/telas/Cadastro/HeaderCadastroStyles';
interface HeaderProps {
  tipoVeiculo?: any;
}

export const HeaderCadastro: React.FC<HeaderProps> = () => {
  const { t } = useTranslation();
  return (
    <View style={headerStyles.header}>
      {/* Container que faz o corte (Crop) */}
      <View style={headerStyles.imageCropContainer}>
        <Image
          source={require('../../../assets/images/favicon.png')}
          style={headerStyles.logoAumentada}
          resizeMode="contain"
        />
      </View>
      <Text style={headerStyles.subtitulo}>
        {t('cadastro.subtitulo')}
      </Text>
    </View>
  );
};

