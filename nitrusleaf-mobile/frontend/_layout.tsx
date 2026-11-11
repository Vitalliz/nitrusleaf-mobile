import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { PropertyProvider } from "@/contexts/PropertyContext";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import React from "react";

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme: keyof typeof Colors = scheme === "dark" || scheme === "light" ? scheme : "light";
  const bg = Colors[theme].background;
  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <PropertyProvider>
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
          </Stack>
        </PropertyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
