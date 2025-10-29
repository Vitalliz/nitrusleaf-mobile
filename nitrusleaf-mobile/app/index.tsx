// app/index.tsx - SPLASH SCREEN
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000); // 2 segundos de splash

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/icons/Logo.png')}
        style={styles.logo}
      />
      <Image
        source={require('@/assets/images/icons/orange.png')}
        style={styles.orange}
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
  orange: {
    width: 320,
    height: 400,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
});