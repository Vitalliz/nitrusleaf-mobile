// app/welcome.tsx
import { Background } from "@/components/ui/background";
import { LoginButton, SignUpButton } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NitrusleafLogo from "@/assets/images/nitrusleaf-logo.svg";
import WaveBg from "@/assets/images/wave-bg.svg";


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

        <View style={styles.logoSection}>
          <NitrusleafLogo width={316} height={96} />
          <Text style={styles.subtitle}>App de análise de folha da mexerica</Text>
        </View>

        {/* Grupo de Botões de Ação */}
        <View style={styles.buttonGroup}>
          
          <LoginButton 
            onPress={handleLoginNavigation} 
            title="Entrar" // Caso seu componente aceite title, senão ele usará o padrão interno
          />
          <SignUpButton 
            onPress={handleRegisterNavigation}
          />
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
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  buttonGroup: {
    width: "100%",
    gap: 15,
  },
  waveContainer: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
  },
});