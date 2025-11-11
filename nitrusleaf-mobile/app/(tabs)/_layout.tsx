// app/(tabs)/_layout.tsx - SEM TABBAR (USANDO FOOTER CUSTOM)
import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
<<<<<<< HEAD
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
      {/* <Stack.Screen name="register-two" options={{ headerShown: false }} /> */}
=======
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='explore' />
      <Stack.Screen name='maps' />
      <Stack.Screen name='history' />
      <Stack.Screen name='profile' />
>>>>>>> main
    </Stack>
  );
}
