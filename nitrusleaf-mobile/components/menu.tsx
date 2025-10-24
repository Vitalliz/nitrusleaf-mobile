// components/TabBar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabItem = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const tabItems: TabItem[] = [
  { name: 'home', icon: 'home', label: 'Início' },
  { name: 'explore', icon: 'search', label: 'Explorar' },
  { name: 'maps', icon: 'map', label: 'Mapas' },
  { name: 'history', icon: 'time', label: 'Histórico' },
  { name: 'profile', icon: 'person', label: 'Perfil' },
];

interface TabBarProps {
  onTabPress?: (tabName: string) => void;
  activeTab?: string;
}

export const TabBar = ({ onTabPress, activeTab = 'home' }: TabBarProps) => {
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

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
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
                showWhiteBackground && styles.hoverIconContainer
              ]}>
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={
                    isActive ? '#FFA62B' : 
                    showWhiteBackground ? '#FFA62B' : '#FFFFFF'
                  }
                />
              </View>
              <Text style={[
                styles.label,
                isActive && styles.activeLabel,
                showWhiteBackground && styles.hoverLabel
              ]}>
                {tab.label}
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
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16, // Bordas mais arredondadas
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease-in-out',
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
    borderRadius: 16, // Bordas arredondadas no hover também
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
});