import { themas } from "@/src/theme/themes";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { LoadingCoin } from "@/src/components/login/login";
import { useAuth } from "@/src/contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

type Record = {
  id: number;
  description: string;
  method: string;
  amount: number;
  date: Date;
  expenseId: number;
  incomeId: number;
};

export default function RecordScreen() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [record, setRecord] = useState<Record[]>([]);
  const [filter, setFilter] = useState<"todos" | "receita" | "despesa">(
    "todos",
  );

  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      async function TransactionUser() {
        try {
          setLoading(true);

          const response = await fetch(
            `http://localhost:8080/transaction/user/${user?.id}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
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

          setRecord(data);
        } catch (error) {
          setErro("Erro de conexão" + error);
        } finally {
          setLoading(false);
        }
      }
      if (user?.id) {
        TransactionUser();
      }
    }, [user]),
  );

  if (loading) {
    return <LoadingCoin />;
  }

  if (erro) {
    return <Text>Erro: {erro}</Text>;
  }

  const filterOptions = [
    { label: "Todos", value: "todos" },
    { label: "Receita", value: "receita" },
    { label: "Despesa", value: "despesa" },
  ];

  const filteredRecords = record.filter((t) => {
    if (filter === "todos") return true;
    if (filter === "despesa") return !!t.expenseId;
    if (filter === "receita") return !!t.incomeId;
  });

  const formatDate = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const Item = ({
    id,
    description,
    method,
    amount,
    date,
    expenseId,
    incomeId,
  }: Record) => (
    <View style={styles.card}>
      <View style={styles.cardBetween}>
        <Text style={styles.description}>{description}</Text>
        <Text style={[styles.amount, { color: expenseId ? "red" : "green" }]}>
          R$ {expenseId ? "- " : "+ "} {amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.row}>{method} | </Text>
        <Text style={styles.row}>{formatDate(String(date))}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.text1}>Histórico</Text>

        <Dropdown
          style={styles.filter}
          data={filterOptions}
          labelField="label"
          valueField="value"
          value={filter}
          containerStyle={styles.containerStyle}
          itemContainerStyle={styles.dropdownItemContainer}
          onChange={(item) => setFilter(item.value)}
          activeColor="#1a1a1a"
          placeholder="Filtrar Por"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          renderRightIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color={themas.colors.platinium}
            />
          )}
          renderItem={(item) => (
            <View style={styles.dropdownBox}>
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </View>
          )}
        />
      </View>
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            description={item.description}
            method={item.method}
            amount={item.amount}
            date={item.date}
            incomeId={item.incomeId}
            expenseId={item.expenseId}
          />
        )}
      />
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
    justifyContent: "flex-end",
    padding: 6,
    margin: 20,
    position: "relative",
  },
  filter: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    color: themas.colors.primary,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
  },
  text2: {
    color: themas.colors.platinium,
    fontSize: 9,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    marginHorizontal: 14,
  },
  cardTop: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  description: {
    color: themas.colors.platinium,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  row: {
    color: "gray",
    fontSize: 11,
  },
  cardBottom: {
    flexDirection: "row",
  },
  cardBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  amount: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    position: "relative",
  },
  modalOverley: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  filtroOpcao: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  containerStyle: {
    backgroundColor: "#111",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  dropdownItemContainer: {
    borderRadius: 13,
    marginVertical: 4,
  },
  placeholderStyle: {
    fontSize: 13,
    color: "#777",
  },
  selectedTextStyle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "400",
  },
  dropdownItemText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "400",
    padding: 3,
  },
  dropdownBox: {
    alignItems: "center",
  },
});
