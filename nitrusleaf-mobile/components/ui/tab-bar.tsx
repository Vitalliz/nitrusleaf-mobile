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
  { route: '/(tabs)/AI/home',    icon: 'home-outline' },
  { route: '/(tabs)/History/fields', icon: 'time-outline' },
  { route: '/(tabs)/menu',    icon: 'camera-outline', isCamera: true },
  { route: '/(tabs)/Maps/maps',    icon: 'map-outline' },
  { route: '/(tabs)/Settings/profile', icon: 'person-outline' },
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
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#FEE4C1',
  },
  cameraWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -9,       
  },
  cameraButton: {
    width: 64,
    height: 64,          
    borderRadius: 12,      
    borderBottomLeftRadius: 0,   
    borderBottomRightRadius: 0,
    backgroundColor: '#6BC24A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 34,
    height: 30,          
  },
});