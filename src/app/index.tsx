import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function App() {
  const [mensagem, setMensagem] = useState("React Native está funcionando 🚀");

  function alterarMensagem() {
    setMensagem("Você clicou no botão!");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{mensagem}</Text>
      <Button title="Testar botão" onPress={alterarMensagem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  titulo: {
    fontSize: 22,
    marginBottom: 20,
  },
});