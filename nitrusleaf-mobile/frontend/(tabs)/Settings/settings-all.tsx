import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { openAddProperty } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import BottomNavbar from '@/components/ui/tab-bar';
import { Header } from '@/components/ui/user-header';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileHeader } from '@/hooks/useProfileHeader';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  subtitleKey: string;
  route?: string;
  isAction?: boolean;
};

const MENU_ITEMS_DEF: MenuItem[] = [
  {
    icon: 'person-outline',
    labelKey: 'settings_my_profile',
    subtitleKey: 'settings_my_profile_sub',
    route: '/(tabs)/Settings/profile-edit',
  },
  {
    icon: 'business-outline',
    labelKey: 'settings_property_data',
    subtitleKey: 'settings_property_data_sub',
    route: '/(tabs)/Settings/property-data',
  },
  {
    icon: 'build-outline',
    labelKey: 'settings_account_config',
    subtitleKey: 'settings_account_config_sub',
    route: '/(tabs)/Settings/account-config',
  },
  {
    icon: 'cube-outline',
    labelKey: 'settings_new_property',
    subtitleKey: 'settings_new_property_sub', 
    isAction: true,
  },
  {
    icon: 'notifications-outline',
    labelKey: 'settings_notifications',
    subtitleKey: 'settings_notifications_sub',
    route: '/(tabs)/Settings/notifications',
  },
  {
    icon: 'help-circle-outline',
    labelKey: 'settings_help_support',
    subtitleKey: 'settings_help_support_sub',
    route: '/(tabs)/Settings/help-support',
  },
];

export default function SettingsAllScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const {
    userName,
    userSubtitle,
    userAvatar,
    showPropertyPicker,
    canSwitchProperty,
  } = useProfileHeader();

  const handleLogout = () => {
    Alert.alert(t("settings_logout"), t("settings_logout_confirm"), [
      { text: t("common_cancel"), style: 'cancel' },
      {
        text: t("common_exit"),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.isAction) {
      openAddProperty(router);
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar style="dark" />

        <Header
          userName={userName}
          userSubtitle={userSubtitle}
          userAvatar={userAvatar}
          subtitleIcon="location-outline"
          onPropertyPress={showPropertyPicker}
          showPropertyChevron={canSwitchProperty}
          onAvatarPress={() => router.push('/(tabs)/Settings/profile-new')}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="settings-outline" size={18} color={Palette.textPrimary} />
              <Text style={styles.sectionTitle}>{t("settings_title")}</Text>
            </View>
            <LanguageToggle compact />
          </View>

          <View style={styles.listContainer}>
            {MENU_ITEMS_DEF.map((item) => (
              <TouchableOpacity
                key={item.labelKey}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item)}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={20} color={Palette.textPrimary} />
                </View>

                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{t(item.labelKey as any)}</Text>
                  <Text style={styles.menuSubtitle}>{t(item.subtitleKey as any)}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Palette.textPrimary}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color={Palette.error} />
              <Text style={styles.logoutText}>{t("settings_logout")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  container: {
    paddingBottom: 40,
    backgroundColor: Palette.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Palette.surfaceGray,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Palette.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.white,
    borderRadius: 22,
    height: 44,
    borderWidth: 1,
    borderColor: Palette.error,
    marginTop: 36,
  },
  logoutText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.error,
  },
});