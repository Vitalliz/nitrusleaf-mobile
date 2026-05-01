// app/index.tsx - SPLASH SCREEN
import NitrusleafLogo from "@/assets/images/nitrusleaf-logo.svg";
import WaveBgBig from "@/assets/images/wave-bg-big.svg";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return; 

    const timer = setTimeout(() => {
      router.replace(isSignedIn ? "/(tabs)/AI/home" : "/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isSignedIn]);

  return (
    <View style={styles.container}>
      <NitrusleafLogo width={316} height={100} />
      <View style={styles.waveContainer}>
        <WaveBgBig width="100%" height={200} preserveAspectRatio="none" />
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
  logo: {
    width: 316,
    height: 100,
    resizeMode: "contain",
  },
  waveContainer: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    width: "100%",
  },
});
