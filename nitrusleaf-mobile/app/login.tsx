// app/login.tsx - LOGIN PAGE
import { Background } from "@/components/ui/background";
import { WelcomeTitle, WelcomeSubtitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton, GoogleButton2 } from "@/components/ui/button";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import WaveBg from "@/assets/images/wave-bg.svg";
import Leaf from "@/assets/images/leaf.svg";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSignedIn) router.replace("/(tabs)/home");
  }, [isSignedIn, router]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Por favor, preencha email e senha");
      return;
    }

    try {
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (e: any) {
      alert(e?.message ?? "Falha ao entrar.");
    }
  };

  const handleGoogleLogin = () => {
    // Login com Google - funcionalidade a ser implementada
    // Implementar login com Google aqui
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <Background>
      <View style={styles.container}>

        <View style={styles.titleBox}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Leaf width={58} height={64} />  
          <WelcomeTitle text="Bem vindo!" style={{ fontSize: 28, fontWeight: "700" }} />
          <WelcomeSubtitle text="Entre na sua conta" style={{ fontSize: 20, color: "#777" }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.subtitle}>E-mail ou número de telefone:</Text>
          <Input
            placeholder="Email ou número de telefone"
            size="full"
            variant="default"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha:</Text>
          <Input
            placeholder="Digite sua senha"
            size="full"
            variant="default"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <View style={styles.optionsRow}>
            <View style={styles.rememberMe}>
              <TouchableOpacity style={styles.checkbox} />
              <Text style={styles.rememberText}>Lembre-se de mim</Text>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ width: "100%" }}>
          <LoginButton  onPress={handleLogin} disabled={isLoading} />
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.line} />
          </View>
          <GoogleButton2 onPress={handleGoogleLogin} />
        </View>
          
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Não possui uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Fazer cadastro</Text>
          </TouchableOpacity>
        </View>
      
      </View>
      {/* Onda laranja na base (ao fundo) */}
      <View style={styles.waveContainer}>
        <WaveBg width="100%" height={140} />
      </View>

    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 38,
    paddingTop: 60,
  },
  titleBox: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 30,
    gap: 10
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#2B2B2B",
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 16,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "600",
  },

  // Divider dos botões
  divider: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 16,
  width: "100%",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  orText: {
    marginHorizontal: 10,
    color: "#999",
  },

  // Select "Lembre-se de mim" e "Esqueci a senha"
  optionsRow: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  paddingHorizontal: 10,
  },

  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
  },

  rememberText: {
    fontSize: 14,
    color: "#666",
  },

  forgotPassword: {
    fontSize: 14,
    color: "#2F80ED",
  },
  // Footer
  waveContainer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  bottom: -10
  },
});
