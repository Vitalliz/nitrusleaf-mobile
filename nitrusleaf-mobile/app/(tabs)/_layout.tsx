import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

 export default function TabsLayout() {
   const { isLoading, isSignedIn } = useAuth();

   if (!isLoading && !isSignedIn) {
     return <Redirect href="/login" />;
   }

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
