import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function ExpenseScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [value, setValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<OpcaoPagamento | null>(
    null,
  );

  const opcoes: OpcaoPagamento[] = [
    { label: "PIX", icone: "grid-view" },
    { label: "Débito", icone: "credit-card" },
    { label: "Crédito", icone: "credit-card" },
    { label: "Dinheiro", icone: "paid" },
  ];

  const categorias = [
    { label: "Alimentação", value: 1 },
    { label: "Transporte", value: 2 },
    { label: "Assinatura", value: 3 },
    { label: "Pessoal", value: 4 },
    { label: "Saúde", value: 5 },
    { label: "Moradia", value: 6 },
  ];

  function SelectOption(opcao: OpcaoPagamento) {
    setSelectedMethod(opcao);
    setModalVisible(false);
  }

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
          placeholderTextColor="#5BBF26"
        />

        <Text style={styles.subTitle}>Valor da Despesa</Text>
        <View style={styles.containerInput}>
          <Text style={styles.prefix}>R$</Text>
          <TextInput
            style={styles.inputClean}
            onChangeText={setNumber}
            value={number}
            placeholder="0,00"
            placeholderTextColor="#5BBF26"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subTitle}>Categoria</Text>
        <Dropdown
          data={categorias}
          labelField="label"
          valueField="value"
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          maxHeight={150}
          value={value}
          placeholder="Selecione a Categoria"
          containerStyle={styles.containerStyle}
          onChange={(item) => setValue(item.value)}
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

        <Button
          titulo="Adicionar Despesa"
          onPress={() => router.push("/(tabs)/details")}
        />
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
  subTitle: {
    color: themas.colors.secundary,
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 25,
    marginBottom: 5,
  },
  input: {
    height: 60,
    borderRadius: 13,
    paddingHorizontal: 15,
    backgroundColor: themas.colors.bgInputs,
    color: themas.colors.primary,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 13,
    paddingHorizontal: 15,
    height: 60,
  },
  prefix: {
    fontSize: 16,
    color: themas.colors.primary,
    marginRight: 5,
  },
  inputClean: {
    flex: 1,
    color: themas.colors.primary,
    fontSize: 16,
  },
  dropdown: {
    height: 60,
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 13,
    paddingHorizontal: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: themas.colors.primary,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: themas.colors.primary,
  },
  containerStyle: {
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 10,
    borderWidth: 0,
  },
  methodSelector: {
    backgroundColor: themas.colors.bgInputs,
    height: 60,
    borderRadius: 13,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  selectedMethodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMethodText: {
    color: themas.colors.primary,
    fontSize: 16,
    marginLeft: 10,
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
});
