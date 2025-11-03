// app/(tabs)/menu.tsx - Tela do menuzinho com background da análise
import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleCapture = () => {
    // Ação principal (ex.: abrir câmera real no futuro)
    console.log('Capturar');
  };

  const handleLocation = () => {
    router.push('/(tabs)/analysis');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/icons/analise_exemplo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Badge superior "ESCANEANDO" */}
      <View style={styles.topBadgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ESCANEANDO</Text>
          <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 8 }} />
        </View>
      </View>

      {/* Controles inferiores */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.sideButton} onPress={handleBack}>
          <Ionicons name="return-down-back" size={28} color="#2B2B2B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <Ionicons name="camera" size={36} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={handleLocation}>
          <Ionicons name="location" size={28} color="#2B2B2B" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBadgeContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#57B33E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6BC24A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});


