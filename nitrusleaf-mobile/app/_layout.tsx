// app/_layout.tsx
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light';
  const bg = Colors[theme].background;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg },
      }}
    />
  );
}
