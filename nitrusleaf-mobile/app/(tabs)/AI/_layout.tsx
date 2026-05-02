import { Stack } from 'expo-router';
import React from 'react';

export default function AILayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="result" />
        <Stack.Screen name="analysis-summary" />
        </Stack>
    );
}