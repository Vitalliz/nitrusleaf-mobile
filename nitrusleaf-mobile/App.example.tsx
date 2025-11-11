// Exemplo de como estruturar o root layout com AuthProvider
// Copie e adapte este arquivo para app/_layout.tsx quando estiver pronto

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Componente de layout interno que tem acesso ao AuthContext
function RootLayoutNav() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    // Mostrar splash screen enquanto carrega
    return (
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {isSignedIn ? (
        // Rotas autenticadas
        <>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animationEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="modal" 
            options={{
              presentation: "modal",
            }}
          />
        </>
      ) : (
        // Rotas públicas
        <>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              animationEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
              animationEnabled: true,
            }} 
          />
          <Stack.Screen 
            name="register" 
            options={{ 
              headerShown: false,
              animationEnabled: true,
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }} 
          />
        </>
      )}
    </Stack>
  );
}

// Componente raiz com AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}