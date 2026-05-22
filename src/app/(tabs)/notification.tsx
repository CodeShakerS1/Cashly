import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Notificações</Text>

          <Ionicons name="notifications" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.alertCard}>
          <View style={styles.row}>
            <Ionicons name="warning" size={20} color="#FFD600" />

            <Text style={styles.alertTitle}> ALERTA TETO DE GASTO</Text>
          </View>

          <Text style={styles.alertText}>
            Ei, Josefa! Você já usou 70% (R$95,50) do seu teto estipulado de
            R$120,00 para
            <Text style={styles.greenText}> Alimentação.</Text>
          </Text>

          <Text style={styles.alertText}>Hora de segurar o delivery?</Text>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill}>
              <Text style={styles.progressText}>70%</Text>

              <View style={styles.redEnd} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color="#6CFF2B"
            />

            <Text style={styles.cardTitle}> Receita Recebida</Text>
          </View>

          <Text style={styles.cardText}>
            R$ 2000,00 de salário adicionados!
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Feather name="trending-up" size={24} color="#6CFF2B" />

            <Text style={styles.cardTitle}> Insight da Semana</Text>
          </View>

          <Text style={styles.cardText}>
            Você gastou 7% a menos com transporte esta semana.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="warning" size={20} color="#FFD600" />

            <Text style={styles.cardTitle}> Atenção: Transporte</Text>
          </View>

          <Text style={styles.cardText}>
            Restam apenas R$ 80,00 na sua categoria transporte.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,
    marginBottom: 30,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  alertCard: {
    backgroundColor: "#0D0D0D",
    borderRadius: 25,
    padding: 20,
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#0D0D0D",
    borderRadius: 25,
    padding: 20,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  alertTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  alertText: {
    color: "#D9D9D9",
    fontSize: 16,
    lineHeight: 24,
  },

  cardText: {
    color: "#D9D9D9",
    fontSize: 16,
    lineHeight: 24,
  },

  greenText: {
    color: "#6CFF2B",
    fontWeight: "700",
  },

  progressBackground: {
    width: "100%",
    height: 18,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    marginTop: 18,
    overflow: "hidden",
  },

  progressFill: {
    width: "85%",
    height: "100%",
    backgroundColor: "#6CFF2B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  progressText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginRight: 8,
    fontSize: 12,
  },

  redEnd: {
    width: 18,
    height: "100%",
    backgroundColor: "#FF2B2B",
  },
});
