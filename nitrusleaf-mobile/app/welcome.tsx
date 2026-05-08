import { Background } from "@/components/ui/background";
import { LoginButton, SignUpButton } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native"; // Adicionado Dimensions
import NitrusleafLogo from "@/assets/images/nitrusleaf-logo.svg";
import WaveBg from "@/assets/images/wave-bg.svg";

// Obtém a largura da tela do dispositivo
const { width: screenWidth } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginNavigation = () => {
    router.push("/login");
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  return (
    <Background>
      <View style={styles.container}>

        <View style={styles.logoSection}>
          <NitrusleafLogo width={316} height={96} />
          {/* Subtítulo do projeto Nitrusleaf */}
          <Text style={styles.subtitle}>App de análise de folha da mexerica</Text>
        </View>

        {/* Grupo de Botões de Ação */}
        <View style={styles.buttonGroup}>
          <LoginButton 
            onPress={handleLoginNavigation} 
            title="Entrar" 
          />
          <SignUpButton 
            onPress={handleRegisterNavigation}
          />
        </View>

      </View>

      {/* Onda laranja na base configurada para ocupar 100% da largura */}
      <View style={styles.waveContainer}>
        <WaveBg 
          width={screenWidth} 
          height={140} 
          preserveAspectRatio="none" 
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 38,
    gap: 60,
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
    bottom: -1, // Ajustado para -1 para evitar frestas no fundo da tela
    left: 0,
    right: 0,
  },
});