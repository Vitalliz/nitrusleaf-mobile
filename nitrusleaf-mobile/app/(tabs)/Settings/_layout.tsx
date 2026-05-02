import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="register-propriety" />
        <Stack.Screen name="register-propriety-two" />
        </Stack>
    );
}