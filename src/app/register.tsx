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
} from "react-native";

import Logo from "../assets/images/logo.png";
import { themas } from "../theme/themes";

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validarCampos() {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      return "Preencha todos os campos";
    }

    if (!email.includes("@")) {
      return "Insira um e-mail válido";
    }

    if (senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }

    if (senha !== confirmarSenha) {
      return "As senhas não coincidem";
    }

    return null;
  }

  async function handleRegister() {
    const erroValidacao = validarCampos();

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      const cadastroResponse = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nome.trim(),
          email: email.trim().toLowerCase(),
          password: senha,
          photo:
            "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
        }),
      });

      if (!cadastroResponse.ok) {
        const mensagemErro = await cadastroResponse.text();
        throw new Error(mensagemErro || "Erro ao cadastrar usuário");
      }
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      setErro(error.message || "Não foi possível conectar ao servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.boxMid}>
        <Text style={styles.text}>Crie sua conta</Text>

        <View style={styles.boxInput}>
          <MaterialIcons
            name="person"
            size={20}
            color={themas.colors.secundary}
          />
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.boxInput}>
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

        <View style={styles.boxInput}>
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
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <View style={styles.boxInput}>
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
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        <Text style={styles.textBottom}>
          Ao continuar você concorda com os nossos
          <Text style={{ color: themas.colors.primary }}> Termos de Uso </Text>e
          <Text style={{ color: themas.colors.primary }}>
            {" "}
            Política de Privacidade{" "}
          </Text>
          .
        </Text>
      </View>

      <View style={styles.boxBottom}>
        <TouchableOpacity
          style={[styles.button, carregando && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={carregando}
        >
          <Text style={styles.textButton}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <Link href="/login" push asChild>
          <TouchableOpacity>
            <Text style={styles.textBottom}>
              Já tem uma conta?
              <Text style={{ color: themas.colors.primary }}> Entrar</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: themas.colors.bgScreen,
    alignItems: "center",
    justifyContent: "center",
  },

  boxTop: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  boxMid: {
    flex: 3,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  boxBottom: {
    flex: 1.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  logo: {
    width: 180,
    height: 180,
  },

  text: {
    fontWeight: "bold",
    fontSize: 22,
    color: themas.colors.secundary,
    marginBottom: 20,
  },

  boxInput: {
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
    width: "85%",
    height: 55,
    borderRadius: 18,
    backgroundColor: themas.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  textButton: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },

  textBottom: {
    fontSize: 14,
    color: themas.colors.secundary,
    marginTop: 15,
    textAlign: "center",
  },

  erroText: {
    color: "red",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});
