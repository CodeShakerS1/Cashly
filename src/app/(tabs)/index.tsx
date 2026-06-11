import { ChartBar } from "@/src/components/Chart/Chart";
import { Header } from "@/src/components/Header/Header";
import { themas } from "@/src/theme/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/src/contexts/auth";

import { LoadingCoin } from "@/src/components/login/login";

type Dashboard = {
  categories: {
    categoryName: string;
    icon: any;
    total: number;
    limitAmount: number;
  }[];
  weeklyChart: { day: string; total: number }[];
  totalBalance: number;
  weeklyExpensesTotal: number;
};

export default function Index() {
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState("Semana Atual");
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
    return <LoadingCoin />;
  }

  if (erro) {
    return <Text>Erro: {erro}</Text>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.photo }} style={styles.icon} />
          <Text style={styles.balanceLabel}>Olá, {user?.name}</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.navigate("/notification")}
        >
          <MaterialIcons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo total</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("/record")}
        >
          <MaterialIcons name="schedule" size={20} color="white" />
        </TouchableOpacity>

        <Text style={styles.balanceAmount}>
          R$ {dashboard?.totalBalance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.statusSelector}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedPeriod === "Semana Passada" && styles.statusButtonActive,
          ]}
          onPress={() => {
            setSelectedPeriod("Semana Passada");
            setWeek("previous");
          }}
        >
          <Text style={styles.periodSelectorText}>Semana Passada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedPeriod === "Semana Atual" && styles.statusButtonActive,
          ]}
          onPress={() => {
            setSelectedPeriod("Semana Atual");
            setWeek("current");
          }}
        >
          <Text style={styles.periodSelectorText}>Semana Atual</Text>
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

      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Categorias</Text>
      </View>

      <View style={styles.categoryList}>
        {dashboard?.categories.slice(0, 3).map((item) => (
          <View key={item.categoryName} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <MaterialIcons name={item.icon} size={18} color="#fff" />
              <Text style={styles.categoryName}>{item.categoryName}</Text>
              <Text style={styles.categoryValue}>{item.total.toFixed(2)}</Text>
            </View>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((item.total / item.limitAmount) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.viewAllContainer}>
        <TouchableOpacity onPress={() => router.navigate("/(tabs)/category")}>
          <Text style={styles.viewAllText}>Ver Todas</Text>
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
  profileContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  balanceLabel: {
    color: themas.colors.secundary,
    fontSize: 18,
  },
  balanceAmount: {
    color: themas.colors.secundary,
    fontSize: 25,
    fontWeight: "bold",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: themas.colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    height: "15%",
    gap: 5,
    backgroundColor: themas.colors.primary,
    padding: 15,
    borderRadius: 20,
    margin: 20,
    marginTop: 0,
  },
  statusSelector: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: themas.colors.gray,
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 2,
    padding: 3,
    marginLeft: 20,
  },
  periodSelectorText: {
    color: themas.colors.secundary,
    fontSize: 15,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 17,
  },
  statusButtonActive: {
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
  categorySection: {
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: -15,
  },
  sectionTitle: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "bold",
  },
  categoryList: {
    gap: 7,
    margin: 16,
  },
  categoryCard: {
    backgroundColor: themas.colors.gray,
    borderRadius: 10,
    padding: 3,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryName: {
    color: themas.colors.platinium,
    flex: 1,
    textAlign: "center",
    marginLeft: 10,
    alignItems: "center",
  },
  categoryValue: {
    color: themas.colors.platinium,
    fontWeight: "bold",
    textAlign: "right",
    minWidth: 40,
  },
  viewAllText: {
    color: themas.colors.platinium,
    fontSize: 12,
    fontWeight: "500",
    marginTop: -16,
    marginRight: 22,
  },
  viewAllContainer: {
    alignItems: "flex-end",
  },
  progressContainer: {
    width: "100%",
    height: 5,
    backgroundColor: "#222",
    borderRadius: 20,
    marginTop: 5,
    overflow: "hidden",
  },

  progressFill: {
    height: 5,
    backgroundColor: themas.colors.primary,
    borderRadius: 20,
  },
  historyButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});
