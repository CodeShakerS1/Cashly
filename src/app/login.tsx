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
} from "react-native";
import Logo from "../assets/images/logo.png";
import { themas } from "../theme/themes";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = () => {
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    setErro("");
    router.replace("/tabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.boxMid}>
        <Text style={styles.text}>Bem vindo de volta!</Text>

        <View style={styles.boxInput}>
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

        <View style={styles.boxInput}>
          <MaterialIcons
            name="lock"
            size={20}
            color={themas.colors.secundary}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity style={styles.boxForgot}>
          <Text style={styles.textForgot}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boxBottom}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.textButton}>Entrar</Text>
        </TouchableOpacity>

        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        <Link href="/register" push asChild>
          <TouchableOpacity>
            <Text style={styles.textBottom}>
              Não tem conta?
              <Text style={{ color: themas.colors.primary }}>
                {" "}Cadastre-se
              </Text>
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
    height: "100%",
    backgroundColor: themas.colors.bgScreen,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  boxTop: {
    height: Dimensions.get("window").height / 2.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  boxMid: {
    height: Dimensions.get("window").height / 3,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 37,
  },
  boxBottom: {
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
  boxInput: {
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
  text: {
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
  textButton: {
    fontSize: 22,
    color: themas.colors.secundary,
    fontWeight: "bold",
  },
  textBottom: {
    fontSize: 14,
    color: themas.colors.secundary,
    paddingTop: 10,
  },
  boxForgot: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 10,
  },
  textForgot: {
    color: themas.colors.primary,
    fontSize: 14,
    fontWeight: "500",
    paddingRight: 10,
  },

  erroText: {
    color: "red",
    fontSize: 14,
    marginTop: 15,
    textAlign: "center",
    fontWeight: "500",
  },
});