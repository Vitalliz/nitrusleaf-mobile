// app/_layout.tsx
import { Stack } from "expo-router";
import { TabBar } from "@/components/menu";
import { View, StyleSheet } from "react-native";

export default function RootLayout() {
  const handleTabPress = (tabName: string) => {
    console.log(`Navegar para: ${tabName}`);
    // Aqui você pode implementar a navegação entre as telas
  };

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <TabBar onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});