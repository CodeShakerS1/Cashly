import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
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

import { useAuth } from "@/src/contexts/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { saveUser } = useAuth();

  async function loginUser() {
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Email ou Senha inválidos");
        return;
      }

      const data = await response.json();
      console.log("Login response:", data);

      saveUser(data);
      router.push("/(tabs)");
    } catch (err) {
      setError("Erro de conexão" + err);
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
            <Text style={styles.title}>Bem vindo de volta!</Text>

            <View style={styles.inputBox}>
              <MaterialIcons
                name="email"
                size={20}
                color={themas.colors.secundary}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
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
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.forgotBox}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBox}>
            <TouchableOpacity style={styles.button} onPress={loginUser}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Link href="/register" push asChild>
              <TouchableOpacity>
                <Text style={styles.bottomText}>
                  Não tem conta?
                  <Text style={{ color: themas.colors.primary }}> Cadastre-se</Text>
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
  },
  content: {
    width: "100%",
    maxWidth: 450,
    alignItems: "center",
  },
  topBox: {
    height: Dimensions.get("window").height / 2.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  midBox: {
    height: Dimensions.get("window").height / 3,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 37,
  },
  bottomBox: {
    height: Dimensions.get("window").height / 4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 18,
    backgroundColor: themas.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: themas.colors.secundary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  inputBox: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: themas.colors.bgInputs,
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 150,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: themas.colors.secundary,
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 50,
  },
  input: {
    width: "80%",
    height: "100%",
    marginLeft: 20,
    color: themas.colors.secundary,
  },
  buttonText: {
    fontSize: 22,
    color: themas.colors.secundary,
    fontWeight: "bold",
  },
  bottomText: {
    fontSize: 14,
    color: themas.colors.secundary,
    paddingTop: 10,
  },
  forgotBox: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 10,
  },
  forgotText: {
    color: themas.colors.primary,
    fontSize: 14,
    fontWeight: "500",
    paddingRight: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
    fontWeight: "500",
  },
});