// components/TabBar.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES, switchTab } from '@/utils/navigation';

type TabItem = {
  route: typeof ROUTES.home | typeof ROUTES.history | typeof ROUTES.scan | typeof ROUTES.maps | typeof ROUTES.profile;
  icon: keyof typeof Ionicons.glyphMap;
  isCamera?: boolean;
};

const TABS: TabItem[] = [
  { route: ROUTES.home, icon: 'home-outline' },
  { route: ROUTES.history, icon: 'time-outline' },
  { route: ROUTES.scan, icon: 'camera-outline', isCamera: true },
  { route: ROUTES.maps, icon: 'map-outline' },
  { route: ROUTES.profile, icon: 'person-outline' },
];

const TAB_SEGMENTS = ['AI', 'History', 'AI', 'Maps', 'Settings'];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route: string, index: number) => {
    const segment = TAB_SEGMENTS[index];
    if (route.includes('/AI/scan')) return pathname.includes('/AI/scan');
    if (route.includes('/AI/home')) return pathname.includes('/AI') && !pathname.includes('/AI/scan') && !pathname.includes('/analysis-summary');
    return pathname.includes(`/${segment}/`);
  };

  const goTo = (route: TabItem['route']) => {
    switchTab(router, route);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}>
      {TABS.map((tab, index) => {
        const active = isActive(tab.route, index);

        if (tab.isCamera) {
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.cameraWrapper}
              onPress={() => goTo(tab.route)}
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
            onPress={() => goTo(tab.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, active && styles.iconWrapperActive]}>
              <Ionicons name={tab.icon} size={26} />
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
    borderRadius: 12,
  },
  cameraWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -9,
  },
  cameraButton: {
    width: 64,
    flexGrow: 1,  
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
