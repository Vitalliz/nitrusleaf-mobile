import { Stack } from 'expo-router';
import React from 'react';

export default function HistoryLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="fields" />
        <Stack.Screen name="field-feet" />
        <Stack.Screen name="field-three" />
        <Stack.Screen name="field-analysis" />
        </Stack>
    );
}