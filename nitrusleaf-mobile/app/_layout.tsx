// app/_layout.tsx - ROOT LAYOUT COM AUTHPROVIDER
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Text } from 'react-native';
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
        {/* Rotas Públicas (antes de login) */}
        <Stack.Screen name="History/field-three" options={{ headerShown: false }} />
        {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="analysis-form"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />

        {/* Rotas Autenticadas (com abas) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}