// app/index.tsx - SPLASH SCREEN
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import NitrusleafLogo from '@/assets/images/nitrusleaf-logo.svg';
import WaveBgBig from '@/assets/images/wave-bg-big.svg';


const { width: screenWidth } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isInitializing, isSignedIn } = useAuth();

  useEffect(() => {
    if (isInitializing) return;

    const timer = setTimeout(() => {
      router.replace(isSignedIn ? '/(tabs)/AI/home' : '/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, isInitializing, isSignedIn]);

  return (
    <View style={styles.container}>
      <NitrusleafLogo width={316} height={100} />
      <View style={styles.waveContainer}>
        <WaveBgBig
          width={screenWidth}
          height={200}
          preserveAspectRatio="none"
        />
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
  waveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    width: '100%',
  },
});
