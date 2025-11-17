// app/(tabs)/explore.tsx
import { Background } from "@/components/ui/background";
import { WelcomeTitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton, GoogleButton } from "@/components/ui/button";
import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Footer from "@/components/footer";

export default function ExploreScreen() {
  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/icons/leaf.png")}
          style={styles.logo}
        />

        <WelcomeTitle text="Bem vindo!" />
        <Text style={styles.subtitle}>Cadastre-se</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome:</Text>
          <Input placeholder="Nome" size="size-327" variant="default" />

          <Text style={styles.label}>Sobrenome:</Text>
          <Input placeholder="Sobrenome" size="size-327" variant="default" />

          <Text style={styles.label}>Telefone:</Text>
          <Input placeholder="Telefone" size="size-327" variant="default" />

          <LoginButton onPress={() => console.log("Entrar pressionado")} />
          <GoogleButton onPress={() => console.log("Google pressionado")} />

          <Text style={styles.registerText}>
            Não possui uma conta?
            <Text style={styles.registerLink}> Fazer cadastro</Text>
          </Text>
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
  logo: {
    width: 115,
    height: 125,
    marginBottom: 20,
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
  registerText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  registerLink: {
    color: "#6BC24A",
    fontWeight: "600",
  },
});
