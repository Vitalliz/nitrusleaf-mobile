import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
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

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  route?: string;
  isAction?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'person-outline',
    label: 'Meu Perfil',
    subtitle: 'Meus dados pessoais',
    route: '/(tabs)/Settings/profile-edit',
  },
  {
    icon: 'business-outline',
    label: 'Dados da Propriedade',
    subtitle: 'Meus dados pessoais',
    route: '/(tabs)/Settings/property-data',
  },
  {
    icon: 'build-outline',
    label: 'Configurações da Conta',
    subtitle: 'Alertas e preferências',
    route: '/(tabs)/Settings/account-config',
  },
  {
    icon: 'cube-outline',
    label: 'Nova Propriedade',
    subtitle: 'Cadastrar nova propriedade', 
    isAction: true,
  },
  {
    icon: 'notifications-outline',
    label: 'Notificações',
    subtitle: 'Alertas e preferências',
    route: '/(tabs)/Settings/notifications',
  },
  {
    icon: 'help-circle-outline',
    label: 'Ajuda e Suporte',
    subtitle: 'Contate nossa Equipe',
    route: '/(tabs)/Settings/help-support',
  },
];

export default function SettingsAllScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    userName,
    userSubtitle,
    userAvatar,
    showPropertyPicker,
    canSwitchProperty,
  } = useProfileHeader();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
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
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

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
          {/* Barra de Subcabeçalho */}
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={18} color={Palette.textPrimary} />
            <Text style={styles.sectionTitle}>Configurações</Text>
          </View>

          {/* Lista de Opções */}
          <View style={styles.listContainer}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item)}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={20} color={Palette.textPrimary} />
                </View>

                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Palette.textPrimary}
                />
              </TouchableOpacity>
            ))}

            {/* Botão Sair mantido de forma discreta na base da rolagem */}
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color={Palette.error} />
              <Text style={styles.logoutText}>Sair da Conta</Text>
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

  /* Subcabeçalho */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Palette.surfaceGray,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },

  /* Lista */
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

  /* Logout */
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