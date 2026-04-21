import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { themas } from "../theme/themes";

export default function Modal() {
  const router = useRouter();

  return (
    <View style={styles.modalExterna}>
      <View style={styles.modalInterna}>
        <View style={styles.topo}>
          <Text style={styles.text1}>Nova Transação</Text>
          <Text style={styles.text2}>O que você gostaria de adicionar?</Text>
        </View>

        <TouchableOpacity
          style={styles.despesa}
          onPress={() => {
            router.push("/expense");
          }}
        >
          <View style={styles.icon}>
            <MaterialIcons name="arrow-drop-up" size={18} color="#fff" />
            <MaterialIcons name="wallet" size={18} color="#fff" />
            <Text style={styles.text3}>Adicionar Despesa</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.receita}
          onPress={() => {
            router.push("/revenue");
          }}
        >
          <View style={styles.icon}>
            <MaterialIcons name="arrow-drop-down" size={18} color="#fff" />
            <MaterialIcons name="wallet" size={18} color="#fff" />
            <Text style={styles.text3}>Adicionar Receita</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelar} onPress={() => router.back()}>
          <Text style={styles.text3}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text1: {
    color: themas.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalExterna: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalInterna: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: themas.colors.bgScreen,
    borderRadius: 10,
    width: "80%",
    height: "80%",
  },
  text2: {
    color: themas.colors.secundary,
    fontSize: 12,
  },
  despesa: {
    height: "30%",
    width: "70%",
    backgroundColor: themas.colors.bgInputs,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  receita: {
    height: "30%",
    width: "70%",
    backgroundColor: themas.colors.primary,
    borderRadius: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelar: {
    backgroundColor: "red",
    padding: 7,
    borderRadius: 10,
    paddingHorizontal: 30,
    marginTop: 5,
  },
  text3: {
    color: themas.colors.secundary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  topo: {
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
