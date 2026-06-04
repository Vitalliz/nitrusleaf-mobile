// app/(tabs)/_layout.tsx
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TabsLayout() {
  const { isInitializing, isSignedIn } = useAuth();

  if (!isInitializing && !isSignedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      {/* Aba 1 — Home */}
      <Tabs.Screen name="AI" />

      {/* Aba 2 — Histórico */}
      <Tabs.Screen name="History" />

      {/* Aba 4 — Mapas */}
      <Tabs.Screen name="Maps" />

      {/* Aba 5 — Configurações */}
      <Tabs.Screen name="Settings" />

      {/* Rotas extras dentro de (tabs) sem tab bar */}
      <Tabs.Screen name="add-property" options={{ href: null }} />
      <Tabs.Screen name="maps-heat" options={{ href: null }} />
      <Tabs.Screen name="maps-location" options={{ href: null }} />
      <Tabs.Screen name="pe-details" options={{ href: null }} />
      <Tabs.Screen name="property-details" options={{ href: null }} />
    </Tabs>
  );
}
