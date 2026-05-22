import { useAuth } from "@/src/contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button } from "../components/Button";
import { themas } from "../theme/themes";

type OpcaoPagamento = {
  icone: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

type Categoria = {
  categoryid: number;
  categoryname: string;
  icon: string;
  limitAmount: number;
  userId: number;
};

export default function ExpenseScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<OpcaoPagamento | null>(
    null,
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const handleNumber = (text: string) => {
    setNumber(text.replace(/[^0-9]/g, ""));
  };

  const opcoes: OpcaoPagamento[] = [
    { label: "PIX", icone: "grid-view" },
    { label: "Débito", icone: "credit-card" },
    { label: "Crédito", icone: "credit-card" },
    { label: "Dinheiro", icone: "paid" },
  ];

  const opcaoMap: Record<string, string> = {
    PIX: "Pix",
    Débito: "Debit",
    Crédito: "Credit",
    Dinheiro: "Cash",
  };

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await fetch(
          `http://localhost:8080/category/user/${user?.id}`,
        );
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    if (user?.id) {
      fetchCategorias();
    }
  }, [user?.id]);

  function SelectOption(opcao: OpcaoPagamento) {
    setSelectedMethod(opcao);
    setModalVisible(false);
  }

  async function AddExpense() {
    try {
      const response = await fetch("http://localhost:8080/expense", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: text,
          amount: parseFloat(number.replace(",", ".")),
          method: opcaoMap[selectedMethod?.label ?? ""],
          userId: user?.id,
          categoryId: selectedCategoryId,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await response.json();
      console.log("Resposta:", data);
      router.push("/(tabs)/category");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  const categoriasDropdown = categorias.map((cat) => ({
    label: cat.categoryname,
    value: cat.categoryid,
  }));

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.textWhite}>Nova </Text>
            <Text style={styles.textGreen}>Despesa</Text>
          </View>
        </View>

        <Text style={styles.subTitle}>Nome da Despesa</Text>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Adicionar Nome"
          placeholderTextColor="#777"
        />

        <Text style={styles.subTitle}>Valor da Despesa</Text>
        <View style={styles.containerInput}>
          <Text style={styles.prefix}>R$</Text>
          <TextInput
            style={styles.inputClean}
            onChangeText={handleNumber}
            value={number}
            placeholder="0,00"
            placeholderTextColor="#777"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>Categoria</Text>
        <Dropdown
          data={categoriasDropdown}
          labelField="label"
          valueField="value"
          style={styles.dropdown}
          containerStyle={styles.containerStyle}
          itemContainerStyle={styles.dropdownItemContainer}
          activeColor="#1a1a1a"
          backgroundColor="transparent"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.dropdownText}
          maxHeight={150}
          value={selectedCategoryId}
          itemTextStyle={{
            color: "#FFF",
            fontSize: 15,
          }}
          placeholder="Selecione a Categoria"
          renderRightIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color={themas.colors.primary}
            />
          )}
          onChange={(item) => setSelectedCategoryId(item.value)}
        />

        <Text style={styles.subTitle}>Método</Text>
        <TouchableOpacity
          style={styles.methodSelector}
          onPress={() => setModalVisible(true)}
        >
          {selectedMethod ? (
            <View style={styles.selectedMethodRow}>
              <MaterialIcons
                name={selectedMethod.icone}
                size={24}
                color={themas.colors.primary}
              />
              <Text style={styles.selectedMethodText}>
                {selectedMethod.label}
              </Text>
            </View>
          ) : (
            <Text style={styles.placeholderStyle}>Selecione um método</Text>
          )}
          <MaterialIcons
            name="keyboard-arrow-down"
            size={22}
            color={themas.colors.primary}
          />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um método:</Text>

              {opcoes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionCard}
                  onPress={() => SelectOption(item)}
                >
                  <MaterialIcons name={item.icone} size={24} color="#5BBF26" />
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelLink}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Button titulo="Adicionar Despesa" onPress={AddExpense} />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: themas.colors.bgScreen,
  },
  container: {
    margin: 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  textContainer: {
    flexDirection: "row",
  },
  textWhite: {
    color: themas.colors.secundary,
    fontSize: 18,
    fontWeight: "400",
  },
  textGreen: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  dropdownItemContainer: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  subTitle: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 25,
    marginBottom: 5,
  },
  input: {
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 15,
    backgroundColor: themas.colors.bgInputs,
    borderColor: themas.colors.primary,
    color: themas.colors.secundary,
    borderWidth: 1,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },
  prefix: {
    fontSize: 16,
    color: themas.colors.primary,
    marginRight: 5,
  },
  inputClean: {
    flex: 1,
    color: themas.colors.secundary,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: themas.colors.primary,
    height: 58,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#777",
  },
  selectedTextStyle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },
  containerStyle: {
    backgroundColor: "#111",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingVertical: 8,
  },
  methodSelector: {
    backgroundColor: themas.colors.bgInputs,
    height: 60,
    borderRadius: 13,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },
  dropdownText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },
  selectedMethodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMethodText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#000",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionCard: {
    width: "100%",
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },
  optionLabel: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  cancelLink: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
  },
});
