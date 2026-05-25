// app/(tabs)/Settings/profile.tsx — Tela de Configurações do Usuário
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { openAddProperty } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import BottomNavbar from '@/components/ui/tab-bar';
import { useAuth } from '@/contexts/AuthContext';

import { useIsFocused } from '@react-navigation/native';
import { getUsuarioDetails } from '@/repositories/profileRepository';
import { getPropertiesByUser } from '@/repositories/propertyRepository';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  route?: string;
  danger?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'person-outline',
    label: 'Dados Pessoais',
    subtitle: 'Nome, telefone e e-mail',
    route: '/(tabs)/Settings/personal-dates',
  },
  {
    icon: 'business-outline',
    label: 'Dados da Propriedade',
    subtitle: 'Fazenda, área e localização',
    route: '/(tabs)/Settings/property-dates',
  },
  {
    icon: 'add-circle-outline',
    label: 'Nova propriedade',
    subtitle: 'Cadastrar outra fazenda ou sítio',
    route: '/(tabs)/add-property',
  },
  {
    icon: 'pencil-outline',
    label: 'Editar Perfil',
    subtitle: 'Altere foto e informações',
    route: '/(tabs)/Settings/profile-edit',
  },
  {
    icon: 'notifications-outline',
    label: 'Notificações',
    subtitle: 'Alertas e preferências',
  },
  {
    icon: 'help-circle-outline',
    label: 'Ajuda e Suporte',
    subtitle: 'Contate nossa equipe',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isFocused = useIsFocused();
  const [dbUser, setDbUser] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);
        const props = await getPropertiesByUser(user.id);
        if (props && props.length > 0) {
          setProperty(props[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados no menu do perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isFocused) {
      void loadData();
    }
  }, [user, isFocused]);

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
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header do Perfil */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    dbUser?.avatarUrl ??
                    'https://media.istockphoto.com/id/1410538853/pt/foto/young-man-in-the-public-park.jpg?s=2048x2048&w=is&k=20&c=MIzvR5V8GPSO0zVoFnyE6E-AdkmH_TdBO0MSeEs1Ik4=',
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.avatarEdit} onPress={() => router.push('/(tabs)/Settings/profile-edit')}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {loading ? "Carregando..." : (dbUser?.fullName || user?.name || "Usuário")}
            </Text>
            <Text style={styles.userEmail}>
              {loading ? "" : (dbUser?.email || user?.email || "")}
            </Text>
            <View style={styles.propertyBadge}>
              <Ionicons name="location-outline" size={13} color="#6BC24A" />
              <Text style={styles.propertyText}>
                {loading ? "..." : (property?.name || "Sem propriedade")}
              </Text>
            </View>
          </View>

          {/* Título da seção */}
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={18} color="#1A2C3E" />
            <Text style={styles.sectionTitle}>Configurações da Conta</Text>
          </View>

          {/* Menu de opções */}
          <View style={styles.menuCard}>
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
            ))}
          </View>

          {/* Botão de logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>

          <Text style={styles.version}>NitrusLeaf v1.0.0</Text>
        </ScrollView>

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#6BC24A',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6BC24A',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  propertyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  propertyText: {
    fontSize: 13,
    color: '#6BC24A',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53E3E',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BBB',
    marginTop: 8,
  },
});
