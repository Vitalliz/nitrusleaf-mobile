// components/TabBar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const tabItems: TabItem[] = [
  { name: 'home', icon: 'home', label: 'Início' },
  { name: 'maps', icon: 'map', label: 'Mapas' },
  { name: 'camera', icon: 'camera', label: 'Câmera' },
  { name: 'history', icon: 'time', label: 'Histórico' },
  { name: 'profile', icon: 'person', label: 'Perfil' },
];

interface TabBarProps {
  onTabPress?: (tabName: string) => void;
  activeTab?: string;
}

export const TabBar = ({ onTabPress, activeTab = 'maps' }: TabBarProps) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleTabPress = (tabName: string) => {
    onTabPress?.(tabName);
  };

  const handlePressIn = (tabName: string) => {
    setHoveredTab(tabName);
  };

  const handlePressOut = () => {
    setHoveredTab(null);
  };

  const isTabActive = (tabName: string) => activeTab === tabName;
  const isTabHovered = (tabName: string) => hoveredTab === tabName;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabItems.map((tab) => {
          const isActive = isTabActive(tab.name);
          const isHovered = isTabHovered(tab.name);
          const showWhiteBackground = isHovered && !isActive;
          const isCamera = tab.name === 'camera';

          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tabItem,
                isCamera && styles.cameraTabItem
              ]}
              onPress={() => handleTabPress(tab.name)}
              onPressIn={() => handlePressIn(tab.name)}
              onPressOut={handlePressOut}
              activeOpacity={1}
              delayPressIn={0}
              delayPressOut={0}
            >
              <View style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer,
                showWhiteBackground && styles.hoverIconContainer,
                isCamera && styles.cameraIconContainer,
                isCamera && isActive && styles.cameraActiveIconContainer,
                isCamera && showWhiteBackground && styles.cameraHoverIconContainer
              ]}>
                <Ionicons
                  name={tab.icon}
                  size={isCamera ? 28 : 24}
                  color={
                    isCamera ? '#FFFFFF' :
                    isActive ? '#FFA62B' : 
                    showWhiteBackground ? '#FFA62B' : '#FFFFFF'
                  }
                />
              </View>
              <Text style={[
                styles.label,
                isActive && styles.activeLabel,
                showWhiteBackground && styles.hoverLabel,
                isCamera && styles.cameraLabel
              ]}>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFA62B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'relative',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  cameraTabItem: {
    marginBottom: 15, // Eleva o ícone da câmera
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hoverIconContainer: {
    backgroundColor: '#FFFFFF',

    borderRadius: 16, // Bordas arredondadas no hover tambÃ©m
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    transform: [{ scale: 0.95 }],
  },
  cameraIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#4CAF50', // Verde
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraActiveIconContainer: {
    backgroundColor: '#388E3C', // Verde mais escuro quando ativo
    transform: [{ scale: 1.05 }],
  },
  cameraHoverIconContainer: {
    backgroundColor: '#388E3C', // Verde mais escuro no hover
    transform: [{ scale: 1.02 }],
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  hoverLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cameraLabel: {
    marginTop: 4,
  },
});