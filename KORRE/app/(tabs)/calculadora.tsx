import React, { useState } from 'react';
import {
  StatusBar,
  View,
} from 'react-native';
import HeaderCalculadoraFlex from '../../components/telas/CalculadoraFlex/HeaderCalculadoraFlex';
import MainCalculadoraFlex from '../../components/telas/CalculadoraFlex/MainCalculadoraFlex';
import ModalAjuda from '../../components/telas/CalculadoraFlex/ModalAjuda';
import { useTema } from '../../hooks/modo_tema';

import { styles } from '../../styles/generated/app/(tabs)/calculadoraStyles';
export default function CalculadoraFlexScreen() {
  const [modalAjuda, setModalAjuda] = useState(false);
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0A0A0A' : '#F5F5F5'}
      />

      <ModalAjuda
        modalAjuda={modalAjuda}
        setModalAjuda={setModalAjuda}
      />
      <HeaderCalculadoraFlex
        setModalAjuda={setModalAjuda}
      />
      <MainCalculadoraFlex />
    </View>
  );
}
