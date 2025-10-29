// app/_layout.tsx - ROOT LAYOUT COM AUTHPROVIDER
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  const theme = useColorScheme() ?? "light";
  const bg = Colors[theme].background;

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: bg },
          animationEnabled: true,
        }}
      >
        {/* Rotas Públicas (antes de login) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />

        {/* Rotas Autenticadas (com abas) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}