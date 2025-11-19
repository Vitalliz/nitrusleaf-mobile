// components/footer.tsx - FOOTER PROFISSIONAL COM NAVEGAÇÃO
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Menu() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleCamera = () => {
    // Navega para a tela do menuzinho com a folha
    router.push('/(tabs)/menu');
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
          <Image
            source={require('@/assets/images/icons/camera-white.png')}
            style={{ width: 36, height: 28 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => handleNavigation('/(tabs)/history')}
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