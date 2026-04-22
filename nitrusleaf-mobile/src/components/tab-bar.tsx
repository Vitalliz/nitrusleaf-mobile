// components/TabBar.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabItem = {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  isCamera?: boolean;
};

const TABS: TabItem[] = [
  { route: '/(tabs)/home',    icon: 'home-outline' },
  { route: '/(tabs)/maps',    icon: 'map-outline' },
  { route: '/(tabs)/menu',    icon: 'camera-outline', isCamera: true },
  { route: '/(tabs)/history', icon: 'time-outline' },
  { route: '/(tabs)/profile', icon: 'person-outline' },
];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route: string) => pathname.includes(route.replace('/(tabs)/', ''));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      {TABS.map((tab) => {
        const active = isActive(tab.route);

        if (tab.isCamera) {
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.cameraWrapper}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.85}
            >
              <View style={styles.cameraButton}>
                <Image
                  source={require('@/assets/images/icons/camera-white.png')}
                  style={styles.cameraIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tabButton}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, active && styles.iconWrapperActive]}>
              <Ionicons
                name={tab.icon}
                size={26}
                color={active ? '#C47A2B' : '#1A1A1A'}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 48,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#FAE8CC',
  },
  cameraWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
  },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#6BC24A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cameraIcon: {
    width: 30,
    height: 26,
  },
});
