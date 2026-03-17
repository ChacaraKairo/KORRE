import React, { useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import HeaderCalculadoraFlex from "../components/telas/CalculadoraFlex/HeaderCalculadoraFlex";
import MainCalculadoraFlex from "../components/telas/CalculadoraFlex/MainCalculadoraFlex";
import ModalAjuda from "../components/telas/CalculadoraFlex/ModalAjuda";

export default function CalculadoraFlexScreen() {
  const [modalAjuda, setModalAjuda] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <ModalAjuda modalAjuda={modalAjuda} setModalAjuda={setModalAjuda} />
      <HeaderCalculadoraFlex setModalAjuda={setModalAjuda} />
      <MainCalculadoraFlex />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
});
