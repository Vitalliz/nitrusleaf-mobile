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
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';

import { ROUTES, openAddProperty, safeBack } from '@/utils/navigation';
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
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  route?: string;
  action?: 'add_property';
};

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const { selectedProperty, properties = [], selectProperty } = useProperty();
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalAnalyses, setTotalAnalyses] = useState<number>(0);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);

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
      'Tem a certeza de que pretende sair da sua conta?',
      'Sair da Conta',
      'warning',
      async () => {
        await logout();
        router.replace('/login');
      }
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'settings',
      icon: 'settings-outline',
      label: 'Configurações',
      subtitle: 'Alertas e preferências da conta',
      route: '/(tabs)/Settings/settings-all',
    },
    {
      id: 'new_prop',
      icon: 'cube-outline',
      label: 'Nova Propriedade',
      subtitle: 'Registar nova propriedade',
      action: 'add_property',
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.action === 'add_property') {
      openAddProperty(router);
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    safeBack(router, ROUTES.home);
  };

  const handleSelectProperty = async (item: any) => {
    try {
      await selectProperty(item.id);
    } catch (error) {
      console.error('Erro ao trocar de propriedade:', error);
    } finally {
      setPropertyModalVisible(false);
    }
  };

  const handleAddProperty = () => {
    setPropertyModalVisible(false);
    openAddProperty(router);
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={Palette.orangePrimary} />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={22} color={Palette.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Meu Perfil</Text>

              <View style={{ width: 36 }} />
            </View>
          </View>

          {/* Cartão de Perfil */}
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
              {loading ? 'A carregar...' : dbUser?.fullName || user?.name || 'Utilizador'}
            </Text>
            <Text style={styles.userEmail}>
              {loading ? '' : dbUser?.email || user?.email || ''}
            </Text>

            {/* Botão Interativo de Propriedade Ativa */}
            <TouchableOpacity
              style={styles.propertyBadgeButton}
              activeOpacity={0.7}
              onPress={() => setPropertyModalVisible(true)}
            >
              <Ionicons name="business" size={14} color={Palette.primaryPressed} />
              <Text style={styles.propertyButtonText} numberOfLines={1}>
                {loading ? 'A carregar...' : selectedProperty?.name || 'Sem Propriedade'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={Palette.primaryPressed} />
            </TouchableOpacity>

            {/* Cartão de Análises */}
            <View style={styles.analysesCard}>
              <Text style={styles.analysesLabel}>Total de Análises Realizadas</Text>
              <View style={styles.analysesBadge}>
                <Text style={styles.analysesValue}>{totalAnalyses}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu</Text>
          </View>

          {/* Lista de Opções */}
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
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

        {/* Modal Bottom Sheet de Troca de Propriedade */}
        <Modal
          visible={propertyModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPropertyModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setPropertyModalVisible(false)}
          >
            <Pressable
              style={[
                styles.sheetContainer,
                { paddingBottom: Math.max(insets.bottom + 16, 24) },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.dragHandle} />

              <View style={styles.sheetHeader}>
                <View style={styles.sheetTitleContainer}>
                  <Text style={styles.sheetTitle}>Trocar Propriedade</Text>
                  <Text style={styles.sheetSubtitle}>
                    Selecione a fazenda ativa na aplicação
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPropertyModalVisible(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={20} color={Palette.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <ScrollView
                style={styles.propertyList}
                showsVerticalScrollIndicator={false}
              >
                {properties.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="business-outline"
                      size={36}
                      color={Palette.borderDisabled}
                    />
                    <Text style={styles.emptyText}>
                      Nenhuma propriedade registada até ao momento.
                    </Text>
                  </View>
                ) : (
                  properties.map((item) => {
                    const isSelected =
                      selectedProperty?.id?.toString() === item?.id?.toString();

                    const locationText = [
                      item.cidade,
                      item.bairro || item.regiao,
                    ]
                      .filter(Boolean)
                      .join(' • ');

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.propertyCard,
                          isSelected && styles.propertyCardSelected,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => handleSelectProperty(item)}
                      >
                        <View
                          style={[
                            styles.propertyIconBox,
                            isSelected && styles.propertyIconBoxSelected,
                          ]}
                        >
                          <Ionicons
                            name="business"
                            size={20}
                            color={
                              isSelected ? Palette.primary : Palette.textSecondary
                            }
                          />
                        </View>

                        <View style={styles.propertyContent}>
                          <Text
                            style={[
                              styles.propertyName,
                              isSelected && styles.propertyNameSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.propertyLocation} numberOfLines={1}>
                            {locationText || 'Propriedade rural'}
                          </Text>
                        </View>

                        <Ionicons
                          name={
                            isSelected
                              ? 'checkmark-circle'
                              : 'ellipse-outline'
                          }
                          size={22}
                          color={
                            isSelected
                              ? Palette.primary
                              : Palette.borderDisabled
                          }
                        />
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.addPropertyButton}
                activeOpacity={0.8}
                onPress={handleAddProperty}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Palette.primary}
                />
                <Text style={styles.addPropertyButtonText}>
                  Registar Nova Propriedade
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

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
    elevation: 3,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    zIndex: 10,
    elevation: 4,
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

  /* BOTÃO DA PROPRIEDADE ATIVA (CLEAN) */
  propertyBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: Palette.surfaceGray,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    zIndex: 20,
  },
  propertyButtonText: {
    fontSize: 13,
    color: Palette.primaryPressed,
    fontWeight: '600',
    maxWidth: 180,
  },

  /* CARD ANÁLISES */
  analysesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Palette.white,
    borderRadius: 14,
    marginTop: 18,
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

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '80%',
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderDisabled,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitleContainer: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.surfaceGray,
    marginVertical: 14,
  },
  propertyList: {
    maxHeight: 300,
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Palette.borderDisabled,
    backgroundColor: Palette.white,
    marginBottom: 10,
    gap: 12,
  },
  propertyCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: `${Palette.primary}0D`,
  },
  propertyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyIconBoxSelected: {
    backgroundColor: `${Palette.primary}1A`,
  },
  propertyContent: {
    flex: 1,
  },
  propertyName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  propertyNameSelected: {
    color: Palette.primary,
  },
  propertyLocation: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: 'center',
  },
  addPropertyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: Palette.primary,
    backgroundColor: Palette.white,
    marginTop: 10,
  },
  addPropertyButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.primary,
  },
});