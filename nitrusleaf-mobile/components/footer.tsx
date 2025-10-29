// components/footer.tsx - FOOTER PROFISSIONAL COM NAVEGAÇÃO
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Footer() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleCamera = () => {
    // Aqui você pode adicionar lógica da câmera depois
    console.log('Camera pressed');
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => handleNavigation('/(tabs)/home')}
      >
        <Ionicons name="home" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => handleNavigation('/(tabs)/explore')}
      >
        <Ionicons name="image" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.cameraButtonContainer}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleCamera}
        >
          <Ionicons name="camera" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => handleNavigation('/(tabs)/maps')}
      >
        <Ionicons name="bar-chart" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => handleNavigation('/(tabs)/profile')}
      >
        <Ionicons name="person" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F9AA33',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonContainer: {
    marginBottom: 20,
  },
  cameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6BC24A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});