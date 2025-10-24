// app/(tabs)/explore.tsx
import { Background } from "@/components/ui/background";
import { WelcomeTitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton, GoogleButton2 } from "@/components/ui/button";
import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Footer from "@/components/footer";
import { useRouter } from "expo-router";

export default function ExploreScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login:", { email, password });
    // Aqui você implementa a lógica de login
  };

  const handleGoogleLogin = () => {
    console.log("Login com Google");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/icons/leaf.png")}
          style={{ width: 115, height: 125, marginBottom: 20 }}
        />
        <WelcomeTitle text="Bem vindo!" />
        <Text style={styles.subtitle}>Entre na sua conta</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>E-mail ou número:</Text>
          <Input 
            placeholder="Email ou número de telefone"
            size="size-327"
            variant="default"
            value={email}
            onChangeText={setEmail}
          />
          
          <Text style={styles.label}>Senha:</Text>
          <Input 
            placeholder="Digite sua senha"
            size="size-327"
            variant="default"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          
          <LoginButton onPress={handleLogin} />
          <GoogleButton2 onPress={handleGoogleLogin} />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Não possui uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Fazer cadastro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 40,
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
});