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

  const handleRegister = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      setErro("Email inválido");
      return;
    }

    if (senha.length < 6) {
      setErro("Senha muito curta");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    setErro("");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.boxMid}>
        <Text style={styles.text}>Crie sua conta</Text>

        <View style={styles.boxInput}>
          <MaterialIcons name="person" size={20} color={themas.colors.secundary} />
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.boxInput}>
          <MaterialIcons name="email" size={20} color={themas.colors.secundary} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.boxInput}>
          <MaterialIcons name="lock" size={20} color={themas.colors.secundary} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <View style={styles.boxInput}>
          <MaterialIcons name="lock-outline" size={20} color={themas.colors.secundary} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        <Text style={styles.textBottom}>
          Ao continuar você concorda com os nossos
          <Text style={{ color: themas.colors.primary }}> Termos de Uso </Text>e
          <Text style={{ color: themas.colors.primary }}>
            {" "}Política de Privacidade
          </Text>.
        </Text>
      </View>

      <View style={styles.boxBottom}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.textButton}>Cadastrar</Text>
        </TouchableOpacity>

        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        <Link href="/login" push asChild>
          <TouchableOpacity>
            <Text style={styles.textBottom}>
              Já tem uma conta?{" "}
              <Text style={{ color: themas.colors.primary }}>Entrar</Text>
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
    height: 50,
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
    marginTop: 10,
    textAlign: "center",
  },

  erroText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },
});