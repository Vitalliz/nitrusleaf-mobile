// app/index.tsx - WELCOME/ACCESS PAGE
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Background } from "@/components/ui/background";
import { LoginButton, GoogleButton2 } from "@/components/ui/button";

import WaveBg from "@/assets/images/wave-bg.svg";
import NitrusleafLogo from "@/assets/images/nistrusleaf-logo.svg"

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginNavigation = () => {
    router.push("/login");
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  const handleGoogleLogin = () => {
    // Implementar lógica de login social
  };

  return (
    <Background>
      <View style={styles.container}>
        
        {/* Logo e Título Central */}
        
        <View style={styles.logoSection}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>Nitrus</Text>
            
            <NitrusleafLogo width={58} height={64}/>
            <Text style={styles.brandText}>Leaf</Text>
          </View>
          <Text style={styles.subtitle}>App de análise de folha da mexerica</Text>
        </View>

        {/* Grupo de Botões de Ação */}
        <View style={styles.buttonGroup}>
          
          <LoginButton 
            onPress={handleLoginNavigation} 
            title="Entrar" // Caso seu componente aceite title, senão ele usará o padrão interno
          />

          <TouchableOpacity 
            style={styles.outlineButton} 
            onPress={handleRegisterNavigation}
          >
            <Text style={styles.outlineButtonText}>Cadastrar-se</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>ou</Text>
            <View style={styles.line} />
          </View>

          <GoogleButton2 onPress={handleGoogleLogin} />
          
        </View>

      </View>

      {/* Onda laranja na base */}
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
    justifyContent: "center", // Centraliza o conteúdo principal
    paddingHorizontal: 38,
    gap: 60, // Espaço entre a logo e os botões
  },
  logoSection: {
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 48,
    fontWeight: "600",
    color: "#4A4A4A", // Ajuste conforme a cor do seu design
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  buttonGroup: {
    width: "100%",
    gap: 15,
  },
  // Estilo para o botão "Cadastrar-se" que é vazado no print
  outlineButton: {
    width: "100%",
    height: 56, // Altura padrão dos seus botões
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#6BC24A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  outlineButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6BC24A",
  },
  // Reutilizando seus estilos de divisória
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#98979F",
  },
  orText: {
    marginHorizontal: 10,
    color: "#98979F",
  },
  waveContainer: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
  },
});