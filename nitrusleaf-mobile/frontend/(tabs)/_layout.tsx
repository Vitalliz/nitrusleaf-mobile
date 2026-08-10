import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TabsLayout() {
  const { isInitializing, isSignedIn } = useAuth();

  if (!isInitializing && !isSignedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarStyle: { display: 'none', height: 0 },
    }}><Tabs.Screen name="AI" /><Tabs.Screen name="History" /><Tabs.Screen name="Maps" /><Tabs.Screen name="Settings" /><Tabs.Screen name="add-property" options={{ href: null }} />
      <Tabs.Screen name="maps-heat" options={{ href: null }} />
      <Tabs.Screen name="maps-location" options={{ href: null }} />
      <Tabs.Screen name="pe-details" options={{ href: null }} />
      <Tabs.Screen name="property-details" options={{ href: null }} />
    </Tabs>
  );
}
