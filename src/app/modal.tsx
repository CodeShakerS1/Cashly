import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { themas } from "../theme/themes";

export default function Modal() {
  const router = useRouter();

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Nova Transação</Text>
          <Text style={styles.subtitleText}>
            O que você gostaria de adicionar?
          </Text>
        </View>

        <TouchableOpacity
          style={styles.expenseButton}
          onPress={() => {
            router.replace("/expense");
          }}
        >
          <View style={styles.icon}>
            <MaterialIcons name="arrow-drop-up" size={18} color="#fff" />
            <MaterialIcons name="wallet" size={18} color="#fff" />
            <Text style={styles.buttonText}>Adicionar Despesa</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.incomeButton}
          onPress={() => {
            router.replace("/income");
          }}
        >
          <View style={styles.icon}>
            <MaterialIcons name="arrow-drop-down" size={18} color="#fff" />
            <MaterialIcons name="wallet" size={18} color="#fff" />
            <Text style={styles.buttonText}>Adicionar Receita</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    color: themas.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: themas.colors.bgScreen,
    borderRadius: 10,
    width: "80%",
    height: "80%",
  },
  subtitleText: {
    color: themas.colors.secundary,
    fontSize: 12,
  },
  expenseButton: {
    height: "30%",
    width: "70%",
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  incomeButton: {
    height: "30%",
    width: "70%",
    backgroundColor: themas.colors.primary,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 7,
    borderRadius: 10,
    paddingHorizontal: 30,
    marginTop: 5,
  },
  buttonText: {
    color: themas.colors.secundary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  header: {
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
