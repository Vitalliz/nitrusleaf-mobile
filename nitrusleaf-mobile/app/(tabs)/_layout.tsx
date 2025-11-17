import { Stack } from 'expo-router';

 export default function TabsLayout() {
   return (
     <Stack
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen name='register' />
       <Stack.Screen name='explore' />
       <Stack.Screen name='maps' />
       <Stack.Screen name='history' />
       <Stack.Screen name='profile' />
    </Stack>
   );
 }
