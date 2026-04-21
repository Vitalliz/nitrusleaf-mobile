// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userAvatar?: string; // URL da imagem ou require local
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
}

export const Header = ({ 
  title, 
  subtitle, 
  userName,
  userAvatar,
  onMenuPress, 
  onAvatarPress 
}: HeaderProps) => {
  // Pega a primeira letra do nome para fallback
  const getInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : 'R';
  };

  return (
    <View style={styles.container}>
      {/* Avatar/Photo - Esquerda */}
      <TouchableOpacity 
        onPress={onAvatarPress} 
        style={styles.avatarButton}
        activeOpacity={0.7}
      >
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{getInitial()}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Textos - Centro */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Menu Icon - Direita */}
      <TouchableOpacity 
        onPress={onMenuPress} 
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Ionicons name="menu-outline" size={28} color="#2D2D2D" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  avatarButton: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  menuButton: {
    marginLeft: 12,
    padding: 4,
  },
});