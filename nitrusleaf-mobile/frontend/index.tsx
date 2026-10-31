import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import NitrusleafLogo from '@/assets/images/nitrusleaf-logo.svg';
import WaveBgBig from '@/assets/images/wave-bg-big.svg';
import { Palette } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isInitializing, isSignedIn } = useAuth();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    if (isInitializing) return;

    const timer = setTimeout(() => {
      router.replace(isSignedIn ? '/(tabs)/AI/home' : '/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, isInitializing, isSignedIn]);

  const BLEED_OFFSET = 20;
  const logoWidth = screenWidth * 0.72;
  const logoHeight = logoWidth * (100 / 316);
  const waveHeight = screenHeight * 0.33;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[styles.contentArea, { paddingBottom: waveHeight * 0.35 }]}>
        <NitrusleafLogo width={logoWidth} height={logoHeight} />
      </View>

      <View style={[styles.waveContainer, { bottom: -BLEED_OFFSET }]}>
        <WaveBgBig
          width={screenWidth}
          height={waveHeight + BLEED_OFFSET}
          preserveAspectRatio="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
  },
});
