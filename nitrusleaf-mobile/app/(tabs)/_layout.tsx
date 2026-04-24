import { Stack } from 'expo-router';
import React from 'react';

 export default function TabsLayout() {
   return (
     <Stack
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen name='AI/home' />
       <Stack.Screen name='fields' />
       <Stack.Screen name='maps' />
       <Stack.Screen name='profile-edit' />
       <Stack.Screen name='profile' />
    </Stack>
   );
 }
