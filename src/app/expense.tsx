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

type PaymentOption = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

type Category = {
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
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption | null>(
    null,
  );
  const [categories, setcategories] = useState<Category[]>([]);
  const [numberError, setNumberError] = useState("");

  const handleNumber = (text: string) => {
    setNumber(text.replace(/[^0-9,]/g, ""));

    setNumberError("");
  };

  const paymentOptions: PaymentOption[] = [
    { label: "PIX", icon: "grid-view" },
    { label: "Débito", icon: "credit-card" },
    { label: "Crédito", icon: "credit-card" },
    { label: "Dinheiro", icon: "paid" },
  ];

  const paymentMethodMap: Record<string, string> = {
    PIX: "Pix",
    Débito: "Debit",
    Crédito: "Credit",
    Dinheiro: "Cash",
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `http://localhost:8080/category/user/${user?.id}`,
        );
        const data: Category[] = await response.json();
        setcategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    if (user?.id) {
      fetchCategories();
    }
  }, [user?.id]);

  function selectOption(opcao: PaymentOption) {
    setSelectedMethod(opcao);
    setModalVisible(false);
  }

  async function AddExpense() {
    const parsed = parseFloat(number.replace(",", "."));

    if (!number || isNaN(parsed)) {
      setNumberError("Digite um valor válido");
      return;
    }

    if (parsed > 99999999) {
      setNumberError("Valor muito alto");
      return;
    }

    setNumberError("");
    try {
      const response = await fetch("http://localhost:8080/expense", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: text,
          amount: parsed,
          method: paymentMethodMap[selectedMethod?.label ?? ""],
          userId: user?.id,
          categoryId: selectedCategoryId,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        console.error("Erro na requisição:", response.status);
        setNumberError("Erro ao salvar, tente novamente");
        return;
      }

      const selectedCategory = categories.find(
        (cat) => cat.categoryid === selectedCategoryId,
      );

      router.push({
        pathname: "/(tabs)/details",
        params: {
          categoryId: selectedCategoryId,
          categoryName: selectedCategory?.categoryname,
          categoryIcon: selectedCategory?.icon,
          categoryLimit: selectedCategory?.limitAmount,
        },
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  const categoriesDropdown = categories.map((cat) => ({
    label: cat.categoryname,
    value: cat.categoryid,
    icon: cat.icon,
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
            <Text style={styles.headerText}>Nova </Text>
            <Text style={styles.highlightText}>Despesa</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nome da Despesa</Text>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Adicionar Nome"
          placeholderTextColor="#777"
        />

        <Text style={styles.sectionTitle}>Valor da Despesa</Text>
        <View
          style={[
            styles.containerInput,
            numberError ? { borderColor: "red" } : null,
          ]}
        >
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
        {numberError ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {numberError}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>Categoria</Text>
        <Dropdown
          data={categoriesDropdown}
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
          placeholder="Selecione a Categoria"
          renderRightIcon={() => (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color={themas.colors.primary}
            />
          )}
          onChange={(item) => setSelectedCategoryId(item.value)}
          renderItem={(item) => (
            <View style={styles.dropdownBox}>
              <View style={styles.dropdownIconBox}>
                <MaterialIcons
                  name={item.icon as any}
                  size={18}
                  color={themas.colors.primary}
                />
              </View>

              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </View>
          )}
          renderLeftIcon={() => {
            const selected = categoriesDropdown.find(
              (c) => c.value === selectedCategoryId,
            );
            return selected ? (
              <View style={styles.dropdownIconBox}>
                <MaterialIcons
                  name={selected.icon as any}
                  size={18}
                  color={themas.colors.primary}
                />
              </View>
            ) : null;
          }}
        />

        <Text style={styles.sectionTitle}>Método</Text>
        <TouchableOpacity
          style={styles.methodSelector}
          onPress={() => setModalVisible(true)}
        >
          {selectedMethod ? (
            <View style={styles.selectedMethodRow}>
              <MaterialIcons
                name={selectedMethod.icon}
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

              {paymentOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionCard}
                  onPress={() => selectOption(item)}
                >
                  <MaterialIcons name={item.icon} size={24} color="#5BBF26" />
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
  headerText: {
    color: themas.colors.secundary,
    fontSize: 18,
    fontWeight: "400",
  },
  highlightText: {
    color: themas.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  dropdownItemContainer: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  sectionTitle: {
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
  dropdownBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },
  selectedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: themas.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dropdownIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: themas.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dropdownItemText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
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
