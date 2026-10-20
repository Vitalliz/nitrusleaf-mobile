import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import { ROUTES, openAddProperty } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import TabBar from '@/components/ui/tab-bar';
import { CustomAlert, AlertType } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { getUsuarioDetails, updateUsuarioAvatar } from '@/repositories/profileRepository';
import { useProperty } from '@/contexts/PropertyContext';
import { getRelatorioCountByUsuario } from '@/repositories/relatorioRepository';
import {
  pickProfileImageFromDevice,
  uploadProfileAvatar,
} from '@/services/profileAvatar';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  route?: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'settings-outline',
    label: 'Configurações',
    route: '/(tabs)/Settings/settings-all',
  },
  {
    icon: 'cube-outline',
    label: 'Nova Propriedade',
    subtitle: 'Cadastrar nova propriedade',
    route: ROUTES.addProperty,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const { selectedProperty } = useProperty();
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalAnalyses, setTotalAnalyses] = useState<number>(0);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title?: string;
    message: string;
    type: AlertType;
    onCloseAction?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showAlert = useCallback(
    (message: string, title?: string, type: AlertType = 'error', onCloseAction?: () => void) => {
      setAlertConfig({ visible: true, title, message, type, onCloseAction });
    },
    []
  );

  const handleCloseAlert = useCallback(() => {
    const action = alertConfig.onCloseAction;
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (action) action();
  }, [alertConfig.onCloseAction]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadData() {
        if (!user?.id) return;
        try {
          const details = await getUsuarioDetails(user.id);
          if (isActive) {
            setDbUser(details);
            if (details?.avatarUrl) setAvatarUri(details.avatarUrl);
          }
          const count = await getRelatorioCountByUsuario(user.id);
          if (isActive) setTotalAnalyses(count);
        } catch (err) {
          console.error('Erro ao carregar dados no menu do perfil:', err);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      loadData();

      return () => {
        isActive = false;
      };
    }, [user?.id])
  );

  const applyPickedAvatar = async (useCamera: boolean) => {
    if (!user?.id) return;
    try {
      const picked = await pickProfileImageFromDevice(useCamera);
      if (picked.cancelled || !picked.localUri) return;

      setUploadingAvatar(true);
      setAvatarUri(picked.localUri);

      const storedUrl = await uploadProfileAvatar(user.id, picked.localUri);
      await updateUsuarioAvatar(user.id, storedUrl);
      setAvatarUri(storedUrl);
      showAlert('Foto de perfil atualizada com sucesso.', 'Sucesso', 'success');
    } catch (error: unknown) {
      console.error('Erro ao alterar foto:', error);
      const msg =
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar a foto de perfil.';
      showAlert(msg, 'Erro', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert('Foto de perfil', 'Escolha de onde enviar a imagem', [
      { text: 'Galeria', onPress: () => void applyPickedAvatar(false) },
      { text: 'Câmera', onPress: () => void applyPickedAvatar(true) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    showAlert(
      'Tem certeza que deseja sair da sua conta?',
      'Sair da Conta',
      'warning',
      async () => {
        await logout();
        router.replace('/login');
      }
    );
  };

  const handleMenuPress = (item: MenuItem) => {
    if (!item.route) return;
    if (item.route === ROUTES.addProperty) {
      openAddProperty(router);
      return;
    }
    router.push(item.route as any);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/Home/home' as any);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={Palette.orangePrimary} />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho Superior */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={22} color={Palette.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Meu Perfil</Text>

              <View style={{ width: 36 }} />
            </View>
          </View>

          {/* Card Perfil */}
          <View style={styles.profileCard}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handleChangePhoto}
              disabled={uploadingAvatar}
              activeOpacity={0.8}
            >
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Ionicons name="person" size={45} color={Palette.borderDisabled} />
                </View>
              )}
              <View style={styles.avatarEdit}>
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color={Palette.white} />
                ) : (
                  <Ionicons name="camera" size={20} color={Palette.white} />
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.userName}>
              {loading ? 'Carregando...' : dbUser?.fullName || user?.name || 'Usuário'}
            </Text>
            <Text style={styles.userEmail}>
              {loading ? '' : dbUser?.email || user?.email || ''}
            </Text>

            {/* Badge de Propriedade */}
            <View style={styles.propertyBadge}>
              <Ionicons name="business" size={14} color={Palette.primaryPressed} />
              <Text style={styles.propertyText}>
                {loading ? '...' : selectedProperty?.name || 'Sem propriedade'}
              </Text>
            </View>

            {/* Card de Análises */}
            <View style={styles.analysesCard}>
              <Text style={styles.analysesLabel}>Total de Análises Feitas</Text>
              <View style={styles.analysesBadge}>
                <Text style={styles.analysesValue}>{totalAnalyses}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Configurações</Text>
          </View>

          {/* Menu de Configurações */}
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
                  <Ionicons name={item.icon} size={20} color={Palette.textPrimary} />
                </View>

                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={18} color={Palette.textPrimary} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/Settings/profile-edit')}
          >
            <Ionicons name="pencil-outline" size={18} color={Palette.white} />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          {/* Botão Sair com CustomAlert */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Ionicons name="exit-outline" size={18} color={Palette.error} />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>

        <TabBar />

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={handleCloseAlert}
        />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingBottom: 40,
    backgroundColor: Palette.surfaceGray,
  },

  /* HEADER */
  header: {
    backgroundColor: Palette.orangePrimary,
    height: 260,
    paddingTop: 45,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.white,
  },

  /* CARD PERFIL */
  profileCard: {
    backgroundColor: Palette.white,
    marginHorizontal: 20,
    marginTop: -80,
    borderRadius: 12,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },

  /* AVATAR */
  avatarWrapper: {
    position: 'absolute',
    top: -55,
  },
  defaultAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Palette.surfaceGray,
    borderWidth: 3,
    borderColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Palette.white,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: -3,
    right: -8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  propertyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    backgroundColor: Palette.surfaceGray,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  propertyText: {
    fontSize: 13,
    color: Palette.primaryPressed,
    fontWeight: '600',
  },

  /* CARD ANÁLISES */
  analysesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Palette.white,
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    elevation: 1,
  },
  analysesLabel: {
    fontSize: 14,
    color: Palette.textPrimary,
    fontWeight: '500',
  },
  analysesBadge: {
    backgroundColor: Palette.primaryPressed,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    minWidth: 48,
    alignItems: 'center',
  },
  analysesValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.white,
  },

  /* SECTION */
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  /* MENU */
  menuCard: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    marginHorizontal: 20,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 1,
  },

  /* BOTÃO EDITAR */
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.primary,
    borderRadius: 25,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.white,
  },

  /* BOTÃO SAIR */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.white,
    borderRadius: 25,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Palette.error,
    marginHorizontal: 20,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.error,
  },
});