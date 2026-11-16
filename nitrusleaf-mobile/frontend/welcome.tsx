import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Background } from "@/components/ui/background";
import { LoginButton, SignUpButton } from "@/components/ui/button";
import NitrusleafLogoPhrase from "@/assets/images/nitrusleaf-logo-phrase.svg";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/i18n/LanguageContext";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { t } = useLanguage();

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
      <StatusBar style="dark" />

      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          },
        ]}
      >
        <View style={styles.topRightToggle}>
          <LanguageToggle />
        </View>

        <View
          style={[
            styles.logoContainer,
            { paddingTop: screenHeight * 0.04 },
          ]}
        >
          <NitrusleafLogoPhrase width={logoWidth} height={logoHeight} />
        </View>

        <View style={styles.buttonGroup}>
          <LoginButton
            onPress={handleLoginNavigation}
            title={t("welcome_login")}
          />
          <SignUpButton
            onPress={handleRegisterNavigation}
            title={t("welcome_register")}
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
  topRightToggle: {
    alignSelf: "flex-end",
    marginTop: 8,
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
