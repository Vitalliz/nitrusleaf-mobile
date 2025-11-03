// app/register.tsx - REGISTER PAGE
import { Background } from "@/components/ui/background";
import { WelcomeTitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton } from "@/components/ui/button";
import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    console.log("Registro:", formData);
    // Aqui você faria o registro do usuário
    alert("Cadastro realizado com sucesso!");
    router.replace("/login");
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          <Image
            source={require("@/assets/images/icons/leaf.png")}
            style={{ width: 100, height: 110, marginBottom: 15 }}
          />
          <WelcomeTitle text="Criar Conta" />
          <Text style={styles.subtitle}>Cadastre-se para continuar</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Nome Completo:</Text>
            <Input
              placeholder="Seu nome"
              size="size-327"
              variant="default"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />

            <Text style={styles.label}>E-mail:</Text>
            <Input
              placeholder="seu@email.com"
              size="size-327"
              variant="default"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />

            <Text style={styles.label}>Telefone:</Text>
            <Input
              placeholder="(11) 99999-9999"
              size="size-327"
              variant="default"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
            />

            <Text style={styles.label}>Senha:</Text>
            <Input
              placeholder="Digite uma senha"
              size="size-327"
              variant="default"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={true}
            />

            <Text style={styles.label}>Confirmar Senha:</Text>
            <Input
              placeholder="Confirme a senha"
              size="size-327"
              variant="default"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              secureTextEntry={true}
            />

            <LoginButton 
              onPress={handleRegister} 
              title="Cadastrar"
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Já possui uma conta?{" "}
              </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.loginLink}>Fazer login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Onda laranja na base (ao fundo) */}
      <Image
        source={require("@/assets/images/icons/wave-laranja.png")}
        style={styles.wave}
        resizeMode="cover"
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: "#6BC24A",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 30,
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
    marginTop: 20,
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
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    width: '100%',
    zIndex: -1,
    pointerEvents: 'none',
  },
});
