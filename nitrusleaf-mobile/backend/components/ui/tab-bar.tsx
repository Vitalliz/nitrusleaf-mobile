import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES, switchTab } from '@/utils/navigation';
import { Palette } from '@/constants/theme';

type TabItem = {
  route: typeof ROUTES.home | typeof ROUTES.history | typeof ROUTES.scan | typeof ROUTES.maps | typeof ROUTES.profile;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isCamera?: boolean;
};

const TABS: TabItem[] = [
  { route: ROUTES.home, icon: 'home-outline', label: 'Início' },
  { route: ROUTES.history, icon: 'time-outline', label: 'Histórico' },
  { route: ROUTES.scan, icon: 'camera-outline', label: 'Câmera', isCamera: true },
  { route: ROUTES.maps, icon: 'map-outline', label: 'Mapas' },
  { route: ROUTES.profile, icon: 'person-outline', label: 'Perfil' },
];

const TAB_SEGMENTS = ['AI', 'History', 'AI', 'Maps', 'Settings'];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route: string, index: number) => {
    const segment = TAB_SEGMENTS[index];
    if (route.includes('/AI/scan')) return pathname.includes('/AI/scan');
    if (route.includes('/AI/home')) {
      return (
        pathname.includes('/AI') &&
        !pathname.includes('/AI/scan') &&
        !pathname.includes('/analysis-summary')
      );
    }
    return pathname.includes(`/${segment}/`);
  };

  const goTo = (route: TabItem['route']) => {
    switchTab(router, route);
  };

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 4);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomPadding,
          height: 60 + bottomPadding,
        },
      ]}
      accessibilityRole="tablist"
    >
      {TABS.map((tab, index) => {
        const active = isActive(tab.route, index);

        if (tab.isCamera) {
          return (
            <View key={tab.route} style={styles.cameraWrapper}>
              <Pressable
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                onPress={() => goTo(tab.route)}
                style={({ pressed }) => [
                  styles.cameraButton,
                  pressed && styles.cameraButtonPressed,
                ]}
                android_ripple={{
                  color: Palette.primaryDark,
                  borderless: false,
                  foreground: true,
                }}
              >
                <Ionicons name="camera-outline" size={28} color={Palette.white} />
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable
            key={tab.route}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            onPress={() => goTo(tab.route)}
            style={styles.tabButton}
            android_ripple={{
              color: 'transparent',
            }}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.iconWrapper,
                  active && styles.iconWrapperActive,
                  pressed && !active && styles.iconWrapperPressed,
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={Palette.textPrimary}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.surfaceGray,
    overflow: 'visible',
    elevation: 8,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    zIndex: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: Palette.borderDisabled,
    borderRadius: 12,
  },
  iconWrapperPressed: {
    backgroundColor: Palette.surfaceGray,
    borderRadius: 12,
    opacity: 0.85,
  },
  cameraWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    overflow: 'visible',
    zIndex: 20,
  },
  cameraButton: {
    width: 80,
    height: 74,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  cameraButtonPressed: {
    backgroundColor: Palette.primaryPressed,
      borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});