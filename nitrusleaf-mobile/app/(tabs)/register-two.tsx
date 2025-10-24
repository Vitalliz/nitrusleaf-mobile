// app/(tabs)/explore.tsx
import { Background } from "@/components/ui/background";
import { WelcomeTitle, Subtitle } from "@/components/ui/label";
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
          style={{ width: 115, height: 125, marginBottom: 20 }}
        />
        <WelcomeTitle text="Bem vindo!" />
        <Subtitle text="Cadastre-se" style={styles.subtitle} />
        
        <View style={styles.form}>
          <Text style={styles.label}>E-mail ou número:</Text>
          <Input 
            placeholder="E-mail ou número de telefone"
            size="size-327"
            variant="default"
          />
          
          <View style={styles.passwordSection}>
            <Text style={styles.sectionTitle}>Senha</Text>
            <Input 
              placeholder="Digite sua senha"
              size="size-327"
              variant="default"
              secureTextEntry={true}/>
          </View>
          
          <LoginButton onPress={() => console.log("Entrar pressionado")} />
          <GoogleButton onPress={() => console.log("Google pressionado")} />
          
          <Text style={styles.loginText}>
            Já possui uma conta? <Text style={styles.loginLink}>Entrar</Text>
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
  subtitle: {
    marginTop: 8,
    marginBottom: 40,
    fontWeight: "bold",
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
  passwordSection: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#2B2B2B",
    marginBottom: 8,
    alignSelf: "flex-start",
    marginLeft: 16,
    fontWeight: "600",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  loginLink: {
    color: "#6BC24A",
    fontWeight: "600",
  },
});