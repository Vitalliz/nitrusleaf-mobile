import React from "react";
import { StyleSheet, View, useWindowDimensions, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Background } from "@/components/ui/background";
import { LoginButton, SignUpButton } from "@/components/ui/button";
import NitrusleafLogoPhrase from "@/assets/images/nitrusleaf-logo-phrase.svg";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const handleLoginNavigation = () => {
    router.push("/login");
  };

  const handleRegisterNavigation = () => {
    router.push("/register");
  };

  const logoWidth = Math.min(screenWidth * 0.78, 310);
  const logoHeight = logoWidth * (86 / 255);

  return (
    <Background>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View 
        style={[
          styles.container, 
          { 
            paddingTop: insets.top, 
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          }
        ]}
      >
        <View 
          style={[
            styles.logoContainer, 
            { paddingTop: screenHeight * 0.06 } 
          ]}
        >
          <NitrusleafLogoPhrase width={logoWidth} height={logoHeight} />
        </View>

        {/* Rodapé fixo */}
        <View style={styles.buttonGroup}>
          <LoginButton 
            onPress={handleLoginNavigation} 
            title="Entrar" 
          />
          <SignUpButton 
            onPress={handleRegisterNavigation}
            title="Cadastrar-se"
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: 14,
  },
});