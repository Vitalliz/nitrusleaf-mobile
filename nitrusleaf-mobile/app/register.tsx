import { Background } from "@/components/ui/background";
import { WelcomeTitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, isSignedIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (isSignedIn) router.replace("/(tabs)/home");
  }, [isSignedIn, router]);

  const handleRegister = async () => {
    try {
      if (!name.trim() || !email.trim() || !phone.trim() || !cpf.trim() || !password.trim() || !passwordConfirmation.trim()) {
        alert("Preencha todos os campos, incluindo CPF.");
        return;
      }

      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        cpf: cpf.trim(),
        password,
        passwordConfirmation,
      });

      router.replace("/(tabs)/home");
    } catch (e: any) {
      alert(e?.message ?? "Erro ao cadastrar.");
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Image source={require("@/assets/images/icons/leaf.png")} style={styles.logo} />

        <WelcomeTitle text="Bem vindo!" />
        <Text style={styles.subtitle}>Cadastre-se</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome completo:</Text>
          <Input placeholder="Nome e sobrenome" size="size-327" variant="default" value={name} onChangeText={setName} />

          <Text style={styles.label}>E-mail:</Text>
          <Input placeholder="email@exemplo.com" size="size-327" variant="default" value={email} onChangeText={setEmail} />

          <Text style={styles.label}>Telefone:</Text>
          <Input placeholder="(xx) xxxxx-xxxx" size="size-327" variant="default" value={phone} onChangeText={setPhone} />

          <Text style={styles.label}>CPF:</Text>
          <Input placeholder="000.000.000-00" size="size-327" variant="default" value={cpf} onChangeText={setCpf} />

          <Text style={styles.label}>Senha:</Text>
          <Input placeholder="Crie uma senha" size="size-327" variant="default" value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={styles.label}>Confirmar senha:</Text>
          <Input placeholder="Repita a senha" size="size-327" variant="default" value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry />

          <LoginButton onPress={handleRegister} disabled={isLoading} title="Cadastrar" />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")} disabled={isLoading}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Image source={require("@/assets/images/icons/wave-laranja.png")} style={styles.wave} resizeMode="cover" />
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
  logo: {
    width: 115,
    height: 125,
    marginBottom: 20,
  },
  wave: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    width: "100%",
    zIndex: -1,
    pointerEvents: "none",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 24,
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
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "600",
  },
});

