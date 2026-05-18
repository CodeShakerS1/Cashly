import { ChartBar } from "@/src/components/Chart/Chart";
import { Header } from "@/src/components/Header/Header";
import { themas } from "@/src/theme/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/src/contexts/auth";

type Dashboard = {
  categories: { categoryName: string; icon: any; total: number }[];
  weeklyChart: { day: string; total: number }[];
  totalBalance: number;
  weeklyExpensesTotal: number;
};

export default function Index() {
  const router = useRouter();

  const [periodo, setPeriodo] = useState("Semana Atual");
  const [week, setWeek] = useState<"current" | "previous">("current");

  const [erro, setErro] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      async function DashboardUser() {
        try {
          setLoading(true);
          setErro("");

          const response = await fetch(
            `http://localhost:8080/dashboard/${user?.id}?week=${week}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            setErro("Erro ao carregar");
            return;
          }

          const data = await response.json();

          console.log("Resposta:", data);

          setDashboard(data);
        } catch (error) {
          setErro("Erro de conexão: " + error);
        } finally {
          setLoading(false);
        }
      }
      if (user?.id) {
        DashboardUser();
      }
    }, [user, week]),
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (erro) {
    return <Text>Erro: {erro}</Text>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.box1}>
          <Image source={{ uri: user?.photo }} style={styles.icone} />
          <Text style={styles.text}>Olá, {user?.name}</Text>
        </View>

        <TouchableOpacity onPress={() => router.navigate("/notification")}>
          <MaterialIcons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.caixaDinheiro}>
        <Text style={styles.text}>Saldo total</Text>
        <Text style={styles.text2}>
          R$ {dashboard?.totalBalance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.relacao}>
        <TouchableOpacity
          style={[
            styles.button,
            periodo === "Semana Passada" && styles.buttonAtivo,
          ]}
          onPress={() => {
            setPeriodo("Semana Passada");
            setWeek("previous");
          }}
        >
          <Text style={styles.text3}>Semana Passada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            periodo === "Semana Atual" && styles.buttonAtivo,
          ]}
          onPress={() => {
            setPeriodo("Semana Atual");
            setWeek("current");
          }}
        >
          <Text style={styles.text3}>Semana Atual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chart}>
        <View style={styles.chartInner}>
          {dashboard?.weeklyChart && (
            <ChartBar DadosWeek={dashboard.weeklyChart} />
          )}
        </View>

        <View style={{ alignItems: "flex-end", width: 80 }}>
          {dashboard?.weeklyExpensesTotal !== undefined && (
            <Header DadosWeekTotal={dashboard.weeklyExpensesTotal} />
          )}
        </View>
      </View>

      <View style={styles.categoria}>
        <Text style={styles.text4}>Categorias</Text>
      </View>

      <View style={styles.lista}>
        {dashboard?.categories.map((item) => (
          <View key={item.categoryName} style={styles.item}>
            <MaterialIcons name={item.icon} size={18} color="#fff" />
            <Text style={styles.nome}>{item.categoryName}</Text>
            <Text style={styles.valor}>{item.total.toFixed(2)}</Text>
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
    backgroundColor: themas.colors.primary,
  },
  chart: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themas.colors.gray,
    maxWidth: 500,
    padding: 16,
    borderRadius: 20,
    margin: 20,
    flexDirection: "row",
  },
  chartInner: {
    flex: 3,
    paddingRight: 10,
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
    flex: 1,
    textAlign: "center",
    marginLeft: 10,
    alignItems: "center",
  },
  valor: {
    color: themas.colors.platinium,
    fontWeight: "bold",
    textAlign: "right",
    minWidth: 40,
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
