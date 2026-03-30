import { ChartBar } from "@/src/components/Chart/Chart";
import { Header } from "@/src/components/Header/Header";
import { themas } from "@/src/theme/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Categorias = {
  id: number;
  icone: keyof typeof MaterialIcons.glyphMap;
  nome: string;
  valor: string;
};

export default function Index() {
  const categorias: Categorias[] = [
    { id: 1, icone: "restaurant", nome: "Alimentação", valor: "R$ 120,00" },
    { id: 2, icone: "directions-car", nome: "Transporte", valor: "R$ 250,00" },
    { id: 3, icone: "shopping-bag", nome: "Pessoal", valor: "R$ 150,00" },
  ];

  const router = useRouter();

  const [periodo, setPeriodo] = useState("Mês Atual");

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.box1}>
          <Image
            source={require("../../assets/images/usuario.png")}
            style={styles.icone}
          />
          <Text style={styles.text}>Olá, Josefa</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => router.navigate("/notification")}>
            <MaterialIcons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.caixaDinheiro}>
        <Text style={styles.text}>Saldo total</Text>
        <Text style={styles.text2}>R$ 123,79</Text>
      </View>
      <View style={styles.relacao}>
        <TouchableOpacity
          style={[
            styles.button,
            periodo === "Semana Passada" && styles.buttonAtivo,
          ]}
          onPress={() => setPeriodo("Semana Passada")}
        >
          <Text style={styles.text3}>Semana Passada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            periodo === "Nesta Semana" && styles.buttonAtivo,
          ]}
          onPress={() => setPeriodo("Nesta Semana")}
        >
          <Text style={styles.text3}>Nesta Semana</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chart}>
        <Header />
        <View style={styles.chartInner}>
          <ChartBar />
        </View>
      </View>
      <View style={styles.categoria}>
        <Text style={styles.text4}>Categorias</Text>
      </View>
      <View style={styles.lista}>
        {categorias.map((item) => (
          <View key={item.id} style={styles.item}>
            <MaterialIcons name={item.icone as any} size={18} color="#fff" />
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.valor}>{item.valor}</Text>
          </View>
        ))}
      </View>
      <View style={styles.rota}>
        <TouchableOpacity onPress={() => router.navigate("/(tabs)/category")}>
          <Text style={styles.text5}>Ver Todas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themas.colors.bgScreen,
  },
  container: {
    backgroundColor: themas.colors.bgScreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    margin: 20,
  },
  box1: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: themas.colors.secundary,
    fontSize: 18,
  },
  text2: {
    color: themas.colors.secundary,
    fontSize: 25,
    fontWeight: "bold",
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  caixaDinheiro: {
    height: "15%",
    gap: 5,
    backgroundColor: themas.colors.primary,
    padding: 15,
    borderRadius: 20,
    margin: 20,
    marginTop: 0,
  },
  relacao: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: themas.colors.gray,
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 2,
    padding: 3,
    marginLeft: 20,
  },
  text3: {
    color: themas.colors.secundary,
    fontSize: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 17,
  },
  buttonAtivo: {
    backgroundColor: themas.colors.gray,
  },
  chart: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themas.colors.gray,
    padding: 16,
    borderRadius: 20,
    margin: 20,
    flexDirection: "row-reverse",
  },
  chartInner: {
    flex: 2,
    overflow: "hidden",
  },
  categoria: {
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: -10,
  },
  text4: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "bold",
  },
  lista: {
    padding: 7,
    gap: 8,
    margin: 13,
    marginTop: -1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themas.colors.gray,
    borderRadius: 10,
    padding: 6,
  },
  nome: {
    color: themas.colors.platinium,
    marginLeft: 10,
  },
  valor: {
    color: themas.colors.platinium,
    fontWeight: "bold",
  },
  text5: {
    color: themas.colors.platinium,
    fontSize: 12,
    fontWeight: "medium",
    marginTop: -16,
    marginRight: 22,
  },
  rota: {
    alignItems: "flex-end",
  },
});
