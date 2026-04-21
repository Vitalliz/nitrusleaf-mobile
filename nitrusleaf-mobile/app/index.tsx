// app/index.tsx - SPLASH SCREEN
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import NitrusleafLogo from '@/assets/images/nitrusleaf-logo.svg';
import WaveBgBig from '@/assets/images/wave-bg-big.svg';

export default function SplashScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(isSignedIn ? '/(tabs)/home' : '/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, isSignedIn]);

  return (
    <View style={styles.container}>
      <NitrusleafLogo width={316} height={100} />
      <View style={styles.waveContainer}>
        <WaveBgBig width="100%" height={200} preserveAspectRatio="none" />
      </View>
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
  waveContainer: {
    position: 'absolute', 
    bottom: -1,         
    left: 0,
    right: 0,
    width: '100%',
  },
});