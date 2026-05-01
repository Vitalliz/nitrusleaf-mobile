// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="AI" options={{ title: 'Home' }} />
      <Tabs.Screen name="History" options={{ title: 'Histórico' }} />
      <Tabs.Screen name="Maps" options={{ title: 'Mapas' }} />
      <Tabs.Screen name="Register" options={{ title: 'Cadastro' }} />
      <Tabs.Screen name="Settings" options={{ title: 'Config' }} />
    </Tabs>
  );
}