import { themas } from "@/src/theme/themes";
import { totalGastos } from "@/src/utils/data";
import { StyleSheet, Text, View } from "react-native";

export function Header() {
  return (
    <View style={styles.conteiner}>
      <Text style={styles.text1}>Gastos</Text>
      <Text
        style={styles.text2}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
      >
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
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text1: {
    fontSize: 13,
    color: themas.colors.secundary,
    fontWeight: 600,
  },
  text2: {
    fontSize: 13,
    fontWeight: "bold",
    color: themas.colors.secundary,
  },
});
