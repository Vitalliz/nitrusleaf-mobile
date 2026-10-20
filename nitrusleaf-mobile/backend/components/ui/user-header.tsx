import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProperty } from '@/contexts/PropertyContext';
import { openAddProperty } from '@/utils/navigation';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

interface HeaderProps {
  userName: string;
  userSubtitle?: string;
  userAvatar?: string;
  subtitleIcon?: keyof typeof Ionicons.glyphMap;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
  onPropertyPress?: () => void;
  showPropertyChevron?: boolean;
  properties?: any[];
  selectedProperty?: any;
  onSelectProperty?: (property: any) => void;
}

export const Header = ({
  userName,
  userSubtitle,
  userAvatar,
  subtitleIcon = 'location-outline',
  onMenuPress,
  onAvatarPress,
  onPropertyPress,
  showPropertyChevron = false,
  properties: customProperties,
  selectedProperty: customSelectedProperty,
  onSelectProperty,
}: HeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    properties: contextProperties = [],
    selectedProperty: contextSelectedProperty,
    selectProperty,
  } = useProperty();

  const propertiesList = customProperties || contextProperties || [];
  const currentProperty = customSelectedProperty || contextSelectedProperty;
  const canSwitch = showPropertyChevron || propertiesList.length > 1;

  const getInitial = () => userName.charAt(0).toUpperCase();

  // Abre exclusivamente o modal personalizado, sem acionar o seletor nativo do contexto
  const handleOpenPicker = () => {
    setModalVisible(true);
  };

  const handleSelect = async (item: any) => {
    try {
      if (onSelectProperty) {
        onSelectProperty(item);
      } else if (selectProperty) {
        await selectProperty(item.id);
      }
    } catch (error) {
      console.error('Erro ao trocar de propriedade:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleAddProperty = () => {
    setModalVisible(false);
    openAddProperty(router);
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        {/* Avatar */}
        <TouchableOpacity
          onPress={onAvatarPress}
          style={styles.avatarButton}
          activeOpacity={0.7}
        >
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{getInitial()}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Textos: Nome do Utilizador e Propriedade Ativa */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{userName}</Text>

          <TouchableOpacity
            style={styles.subtitleRow}
            onPress={handleOpenPicker}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Trocar propriedade"
          >
            <Ionicons
              name={subtitleIcon}
              size={13}
              color={Palette.textSecondary}
              style={styles.subtitleIcon}
            />
            <Text style={styles.subtitle} numberOfLines={1}>
              {userSubtitle || currentProperty?.name || 'Sem propriedade'}
            </Text>
            {canSwitch && (
              <Ionicons
                name="chevron-down"
                size={14}
                color={Palette.textSecondary}
                style={styles.propertyChevron}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Botão de Atalho para Definições */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/Settings/settings-all')}
          style={styles.configButton}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={26} color={Palette.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Modal Inferior Personalizado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
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
                onPress={() => setModalVisible(false)}
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
              {propertiesList.length === 0 ? (
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
                propertiesList.map((item) => {
                  const isSelected =
                    currentProperty?.id?.toString() === item?.id?.toString();

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
                      onPress={() => handleSelect(item)}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  avatarButton: {
    marginRight: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Palette.surfaceGray,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Palette.borderDisabled,
    backgroundColor: Palette.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitleIcon: {
    marginRight: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
    flexShrink: 1,
  },
  propertyChevron: {
    marginLeft: 3,
  },
  configButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Modal Personalizado Bottom Sheet */
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