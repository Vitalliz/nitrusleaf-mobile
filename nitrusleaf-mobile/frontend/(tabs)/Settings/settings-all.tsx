import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { openAddProperty } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import BottomNavbar from '@/components/ui/tab-bar';
import { Header } from '@/components/ui/user-header';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileHeader } from '@/hooks/useProfileHeader';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  route?: string;
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
    icon: 'settings-outline',
    label: 'Configurações da Conta',
    subtitle: 'Alertas e preferências',
    route: '/(tabs)/Settings/account-config',
  },
  {
    icon: 'add-circle-outline',
    label: 'Nova Propriedade',
    subtitle: 'Cadastrar nova propriedade',
    route: '/(tabs)/add-property',
  },
  {
    icon: 'notifications-outline',
    label: 'Notificações',
    subtitle: 'Alertas e preferências',
  },
  {
    icon: 'help-circle-outline',
    label: 'Ajuda e Suporte',
    subtitle: 'Contate nossa Equipe',
  },
];

export default function SettingsAllScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    userName,
    userSubtitle,
    userAvatar,
    loading: headerLoading,
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
    if (!item.route) return;
    if (item.route === '/(tabs)/add-property') {
      openAddProperty(router);
      return;
    }
    router.push(item.route as any);
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
        ><View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={18} color="#1A2C3E" />
            <Text style={styles.sectionTitle}>Configurações</Text>
          </View><View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item)}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={20} color="#6BC24A" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </TouchableOpacity>
            ))}<TouchableOpacity
                style={styles.logoutButton}
                activeOpacity={0.8}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={18} color="#E53E3E"/>
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
  safeArea: { flex: 1 },
  container: {
    paddingBottom: 40,
  },

  /* Seção */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FDF8F2',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2C3E',
  },

  /* Menu */
  menuCard: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A2C3E',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },

  /* Logout */
  logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#fff4f4',
      borderRadius: 25,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: '#FED7D7',
      marginHorizontal: 20,
      marginTop: 140,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53E3E',
  },
});
