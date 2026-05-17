// app/_layout.tsx - ROOT LAYOUT COM AUTHPROVIDER
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import React from "react";

export default function RootLayout() {
  const theme = useColorScheme() ?? "light";
  const bg = Colors[theme].background;
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-foot" />
        <Stack.Screen name="analysis-form" />
      </Stack>
    </AuthProvider>
  );
}
