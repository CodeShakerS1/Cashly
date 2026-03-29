import { themas } from "@/src/theme/themes";
import { totalGastos } from "@/src/utils/data";
import { StyleSheet, Text, View } from "react-native";

export function Header() {
  return (
    <View style={styles.conteiner}>
      <Text style={styles.text1}> Total de Gastos</Text>
      <Text style={styles.text2}>
        R${" "}
        {totalGastos.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  text1: {
    fontSize: 13,
    color: themas.colors.secundary,
    fontWeight: "medium",
  },
  text2: {
    fontSize: 15,
    fontWeight: "bold",
    color: themas.colors.secundary,
  },
});
