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
      <Tabs.Screen name="AI" />
      <Tabs.Screen name="History" />
      <Tabs.Screen name="Maps" />
      <Tabs.Screen name="Settings" />
    </Tabs>
  );
}
