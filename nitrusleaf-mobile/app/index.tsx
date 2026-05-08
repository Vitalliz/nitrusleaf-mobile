import NitrusleafLogo from "@/assets/images/nitrusleaf-logo.svg";
import WaveBgBig from "@/assets/images/wave-bg-big.svg";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";

// Obtém a largura da tela do dispositivo para garantir o preenchimento total
const { width: screenWidth } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    // Aguarda o carregamento do estado de autenticação
    if (isLoading) return; 

    const timer = setTimeout(() => {
      // Redireciona para a home se logado, ou para welcome se não
      router.replace(isSignedIn ? "/(tabs)/AI/home" : "/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isSignedIn]);

  return (
    <View style={styles.container}>
      {/* Logo centralizada do projeto Nitrusleaf */}
      <NitrusleafLogo width={316} height={100} />

      <View style={styles.waveContainer}>
        {/* SVG configurado para esticar e ocupar 100% da largura horizontal */}
        <WaveBgBig 
          width={screenWidth} 
          height={200} 
          preserveAspectRatio="none" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E8",
    justifyContent: "center",
    alignItems: "center",
  },
  waveContainer: {
    position: "absolute",
    bottom: -1, // Pequeno ajuste para evitar falhas visuais no rodapé
    left: 0,
    right: 0,
    width: "100%",
  },
});