// components/TopProfile.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopProfileProps {
  userName?: string;
  userPhoto?: string;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  showGreeting?: boolean;
}

export const TopProfile = ({ 
  userName = 'Paulo', 
  userPhoto,
  onMenuPress,
  onProfilePress,
  showGreeting = true 
}: TopProfileProps) => {
  return (
    <View style={styles.container}>
      {/* Foto do usuário no início (esquerda) */}
      <TouchableOpacity 
        style={styles.photoContainer}
        onPress={onProfilePress}
      >
        {userPhoto ? (
          <Image 
            source={{ uri: userPhoto }} 
            style={styles.userPhoto}
          />
        ) : (
          <View style={styles.placeholderPhoto}>
            <Ionicons name="person" size={24} color="#666" />
          </View>
        )}
      </TouchableOpacity>

      {/* Saudação no centro */}
      {showGreeting && (
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Olá, {userName}!</Text>
        </View>
      )}

      {/* Menu hamburguer no final (direita) */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onMenuPress}
      >
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: 80,
  },
  photoContainer: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFA62B',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 18,
  },
  placeholderPhoto: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
});