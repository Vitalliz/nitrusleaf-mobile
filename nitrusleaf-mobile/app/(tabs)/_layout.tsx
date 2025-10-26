// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
       <Stack.Screen name="home" options={{ headerShown: false }} />{/*
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="register-two" options={{ headerShown: false }} /> */}
    </Stack>
  );
}