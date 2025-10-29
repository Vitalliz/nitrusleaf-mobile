// app/(tabs)/_layout.tsx - SEM TABBAR (USANDO FOOTER CUSTOM)
import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
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
    </Stack>
  );
}
