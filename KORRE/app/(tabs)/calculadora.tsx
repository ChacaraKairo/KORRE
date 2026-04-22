import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import HeaderCalculadoraFlex from '../../components/telas/CalculadoraFlex/HeaderCalculadoraFlex';
import MainCalculadoraFlex from '../../components/telas/CalculadoraFlex/MainCalculadoraFlex';
import ModalAjuda from '../../components/telas/CalculadoraFlex/ModalAjuda';
import { useTema } from '../../hooks/modo_tema';

export default function CalculadoraFlexScreen() {
  const [modalAjuda, setModalAjuda] = useState(false);
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const { origem } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => {
      if (origem === 'login') {
        router.replace('/(auth)/login');
      } else {
        router.replace('/dashboard');
      }
      return true; // Impede o comportamento padrão de voltar do sistema
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [origem, router]);

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
        origem={origem as string}
      />
      <MainCalculadoraFlex />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
