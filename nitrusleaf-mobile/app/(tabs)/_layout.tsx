// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
       <Stack.Screen name="test" options={{ headerShown: false }} />{/*
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="register-two" options={{ headerShown: false }} /> */}
    </Stack>
  );
}