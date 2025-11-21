import { Stack } from 'expo-router';
import React from 'react';

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
