import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.card}>
        {/* Avatar fake */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Josefa"
          placeholderTextColor="#888"
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="josefa@gmail.com"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
        />

        {/* Botão salvar */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Sair */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4cd137",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    color: "#aaa",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#4cd137",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#000",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#ff4d4d",
  },
});