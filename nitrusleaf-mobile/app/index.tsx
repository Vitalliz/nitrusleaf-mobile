// app/index.tsx - SPLASH SCREEN
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(isSignedIn ? '/(tabs)/home' : '/welcome');
    }, 900);

    return () => clearTimeout(timer);
  }, [router, isSignedIn]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/icons/Logo.png')}
        style={styles.logo}
      />
      {/* Onda laranja na base da splash (ao fundo) */}
      <Image
        source={require('@/assets/images/icons/wave-laranja.png')}
        style={styles.wave}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 316,
    height: 100,
    resizeMode: 'contain',
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    width: '100%',
    zIndex: -1,
    pointerEvents: 'none',
  },
});