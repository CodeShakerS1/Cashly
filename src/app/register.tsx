import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Logo from "../assets/images/logo.png";
import { themas } from "../theme/themes";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateFields() {
    const trimmedEmail = email.trim();

    if (!name.trim() || !trimmedEmail || !password || !confirmPassword) {
      return "Preencha todos os campos";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Insira um e-mail válido";
    }

    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      return "As senhas não coincidem";
    }

    return null;
  }

  async function handleRegister() {
    const validationError = validateFields();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const registerResponse = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          photo: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
        }),
      });

      if (!registerResponse.ok) {
        const errorMessage = await registerResponse.text();
        throw new Error(errorMessage || "Erro ao cadastrar usuário");
      }
      router.replace("/login");
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err.message || "Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          <View style={styles.topBox}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.midBox}>
            <Text style={styles.title}>Crie sua conta</Text>

            <View style={styles.inputBox}>
              <MaterialIcons
                name="person"
                size={20}
                color={themas.colors.secundary}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputBox}>
              <MaterialIcons
                name="email"
                size={20}
                color={themas.colors.secundary}
              />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputBox}>
              <MaterialIcons
                name="lock"
                size={20}
                color={themas.colors.secundary}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputBox}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                color={themas.colors.secundary}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.bottomText}>
              Ao continuar você concorda com os nossos
              <Text style={{ color: themas.colors.primary }}> Termos de Uso </Text>e
              <Text style={{ color: themas.colors.primary }}>
                {" "}Política de Privacidade{" "}
              </Text>
              .
            </Text>
          </View>

          <View style={styles.bottomBox}>
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Text>
            </TouchableOpacity>

            <Link href="/login" push asChild>
              <TouchableOpacity style={{ width: "100%" }}>
                <Text style={styles.bottomLinkText}>
                  Já tem uma conta?
                  <Text style={{ color: themas.colors.primary }}> Entrar</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.colors.bgScreen,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  content: {
    width: "100%",
    maxWidth: 450,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  topBox: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  midBox: {
    width: "100%",
    alignItems: "center",
  },
  bottomBox: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    color: themas.colors.secundary,
    marginBottom: 15,
  },
  inputBox: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: themas.colors.bgInputs,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    color: themas.colors.secundary,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    backgroundColor: themas.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomText: {
    fontSize: 13,
    color: themas.colors.secundary,
    marginTop: 15,
    textAlign: "center",
    lineHeight: 18,
  },
  bottomLinkText: {
    fontSize: 14,
    color: themas.colors.secundary,
    marginTop: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});