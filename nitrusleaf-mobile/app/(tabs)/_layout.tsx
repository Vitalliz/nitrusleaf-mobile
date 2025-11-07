// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
      {/* <Stack.Screen name="register-two" options={{ headerShown: false }} /> */}
    </Stack>
  );
}