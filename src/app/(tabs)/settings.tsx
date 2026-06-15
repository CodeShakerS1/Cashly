import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/auth";

async function compressAndConvertToBase64(uri: string): Promise<string> {
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 300 } }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG },
  );

  const base64 = await FileSystem.readAsStringAsync(compressed.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/jpeg;base64,${base64}`;
}

async function updateUser(
  id: string,
  payload: {
    name: string;
    email: string;
    photo: string;
    password?: string;
  },
) {
  const response = await fetch(`http://localhost:8080/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }
}

export default function SettingsScreen() {
  const { user, saveUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const initials = (user?.name ?? "?")[0].toUpperCase();
  const currentPhoto = avatarUri ?? user?.photo ?? null;

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à galeria nas configurações.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    const localUri = result.assets[0].uri;
    setAvatarUri(localUri);
    setAvatarBase64(null);

    try {
      setConverting(true);
      const base64 = await compressAndConvertToBase64(localUri);
      setAvatarBase64(base64);
    } catch {
      Alert.alert("Erro", "Não foi possível converter a imagem.");
      setAvatarUri(null);
    } finally {
      setConverting(false);
    }
  }

  async function handleSave() {
    if (converting) {
      Alert.alert("Aguarde", "A imagem ainda está sendo processada.");
      return;
    }

    if (!user) return;

    if (password.trim() !== "" && password.length < 6) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter pelo menos 6 caracteres.",
      );
      return;
    }

    const newPhoto = avatarBase64 ?? user.photo;

    try {
      setSaving(true);

      const updatePayload: any = {
        name,
        email,
        photo: newPhoto,
      };

      if (password.trim() !== "") {
        updatePayload.password = password;
      }

      await updateUser(user.id, updatePayload);

      saveUser({ ...user, name, email, photo: newPhoto });

      Alert.alert("Sucesso", "Perfil atualizado!");
      setPassword("");
    } catch (error: any) {
      Alert.alert("Erro", error.message ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  function handleSignOut() {
    Alert.alert("Sair", "Tem certeza que deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  }

  const isLoading = converting || saving;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.card}>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.avatarWrapper}
          disabled={isLoading}
        >
          {currentPhoto ? (
            <Image source={{ uri: currentPhoto }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}

          {converting && (
            <View style={styles.overlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}

          <View style={styles.cameraIcon}>
            <Text style={styles.cameraEmoji}>📷</Text>
          </View>
        </TouchableOpacity>

        {avatarBase64 && (
          <Text style={styles.feedback}>✅ Imagem pronta para salvar</Text>
        )}

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nova senha (deixe vazio para manter)"
          placeholderTextColor="#888"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {saving ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.saveText}>
              {converting ? "Processando imagem…" : "Salvar"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 15,
    width: 80,
    height: 80,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5CD338",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 2,
  },
  cameraEmoji: { fontSize: 14 },
  feedback: {
    color: "#5CD338",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 8,
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
    borderWidth: 1,
    borderColor: "#5CD338",
  },
  saveButton: {
    backgroundColor: "#5CD338",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveText: {
    color: "#000",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: { color: "#ff4d4d" },
});
