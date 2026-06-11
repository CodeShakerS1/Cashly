import { useAuth } from "@/src/contexts/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { themas } from "../theme/themes";

type PaymentOption = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

export default function IncomeScreen() {
  const { user } = useAuth();

  const router = useRouter();
  const [erro, setErro] = useState("");
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption | null>(
    null,
  );
  const [numberError, setNumberError] = useState("");

  const handleNumber = (text: string) => {
    setNumber(text.replace(/[^0-9,]/g, ""));
    setNumberError("");
  };

  const paymentMethodMap: Record<string, string> = {
    PIX: "Pix",
    Débito: "Debit",
    Crédito: "Credit",
    Dinheiro: "Cash",
  };

  const paymentOptions: PaymentOption[] = [
    { label: "PIX", icon: "grid-view" },
    { label: "Débito", icon: "credit-card" },
    { label: "Crédito", icon: "credit-card" },
    { label: "Dinheiro", icon: "paid" },
  ];

  function selectOption(opcao: PaymentOption) {
    setSelectedMethod(opcao);
    setModalVisible(false);
  }

  async function AddIncome() {
    const parsed = parseFloat(number.replace(",", "."));

    if (!number || isNaN(parsed)) {
      setNumberError("Digite um valor");
      return;
    }

    if (parsed > 99999999) {
      setNumberError("Valor muito alto");
      return;
    }

    setNumberError("");
    try {
      const response = await fetch("http://localhost:8080/income", {
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
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        setErro("Tente novamente");
        return;
      }
      router.back();
    } catch (error) {
      setErro("Erro de conexão" + error);
    }
  }

  return (
    <View style={styles.screen}>
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
            <Text style={styles.highlightText}>Receita</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Nome da Receita</Text>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Adicionar nome"
          placeholderTextColor="#777"
        />

        <Text style={styles.sectionTitle}>Valor da Receita</Text>
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

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <View style={styles.styleButton}>
          <Button titulo="Adicionar Receita" onPress={AddIncome} />
        </View>
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
    margin: 40,
    paddingBottom: 40,
    justifyContent: "center",
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
  sectionTitle: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 25,
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    height: 60,
    justifyContent: "center",
    borderRadius: 13,
    paddingHorizontal: 15,
    backgroundColor: themas.colors.bgInputs,
    color: themas.colors.secundary,
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 13,
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
  placeholderStyle: {
    fontSize: 16,
    color: "#777",
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
  selectedMethodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMethodText: {
    color: themas.colors.secundary,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
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
  styleButton: {
    marginTop: 60,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
