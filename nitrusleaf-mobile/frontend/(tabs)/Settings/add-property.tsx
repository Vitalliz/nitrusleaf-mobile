import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { ROUTES, safeBack } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import { Button } from '@/components/ui/button';
import { CustomAlert, AlertType } from '@/components/ui/alert';
import TabBar from '@/components/ui/tab-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { createProperty } from '@/repositories/propertyRepository';
import type { CreatePropertyRequest } from '@/types/property';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

export default function AddPropertyScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { user } = useAuth();
  const { refreshProperties, selectProperty } = useProperty();

  // Prioriza o retorno na pilha de navegação para a tela anterior exata
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (returnTo && String(returnTo).startsWith('/')) {
      router.replace(returnTo as any);
    } else {
      safeBack(router, ROUTES.profile);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    latitude: '',
    longitude: '',
    regiao: '',
  });

  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
      }));
    }
    setShowMapModal(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showAlert('Nome da propriedade é obrigatório.', 'Atenção', 'warning');
      return false;
    }
    if (!formData.cep.trim()) {
      showAlert('CEP é obrigatório.', 'Atenção', 'warning');
      return false;
    }
    if (!formData.logradouro.trim()) {
      showAlert('Logradouro é obrigatório.', 'Atenção', 'warning');
      return false;
    }
    if (!formData.numero.trim()) {
      showAlert('Número é obrigatório.', 'Atenção', 'warning');
      return false;
    }
    if (!formData.bairro.trim()) {
      showAlert('Bairro é obrigatório.', 'Atenção', 'warning');
      return false;
    }
    if (!formData.cidade.trim()) {
      showAlert('Cidade é obrigatória.', 'Atenção', 'warning');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    try {
      const propertyData: CreatePropertyRequest = {
        userId: user.id,
        name: formData.name.trim(),
        cep: formData.cep.trim(),
        logradouro: formData.logradouro.trim(),
        numero: parseInt(formData.numero.trim(), 10),
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        regiao: formData.regiao.trim() || undefined,
      };

      const created = await createProperty(propertyData);
      await refreshProperties();
      await selectProperty(created.id);

      showAlert('Propriedade cadastrada com sucesso!', 'Sucesso', 'success', () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(
            returnTo && String(returnTo).startsWith('/')
              ? (returnTo as typeof ROUTES.profile)
              : ROUTES.profile
          );
        }
      });
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      showAlert('Não foi possível salvar a propriedade. Tente novamente.', 'Erro', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cadastrar Propriedade</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Informações da Propriedade */}
          <Text style={styles.sectionTitle}>Informações da Propriedade</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Propriedade *</Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              style={styles.input}
              placeholder="Ex: Fazenda São João"
              placeholderTextColor={Palette.textSecondary}
            />
          </View>

          {/* Endereço */}
          <Text style={styles.sectionTitle}>Endereço</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>CEP *</Text>
            <TextInput
              value={formData.cep}
              onChangeText={(value) => handleInputChange('cep', value)}
              style={styles.input}
              placeholder="00000-000"
              placeholderTextColor={Palette.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Logradouro *</Text>
            <TextInput
              value={formData.logradouro}
              onChangeText={(value) => handleInputChange('logradouro', value)}
              style={styles.input}
              placeholder="Rua, Avenida, Rodovia, etc."
              placeholderTextColor={Palette.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Número *</Text>
              <TextInput
                value={formData.numero}
                onChangeText={(value) => handleInputChange('numero', value)}
                style={styles.input}
                placeholder="123 ou S/N"
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={[styles.formGroup, { flex: 2 }]}>
              <Text style={styles.label}>Bairro *</Text>
              <TextInput
                value={formData.bairro}
                onChangeText={(value) => handleInputChange('bairro', value)}
                style={styles.input}
                placeholder="Centro, Zona Rural, etc."
                placeholderTextColor={Palette.textSecondary}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cidade *</Text>
            <TextInput
              value={formData.cidade}
              onChangeText={(value) => handleInputChange('cidade', value)}
              style={styles.input}
              placeholder="Cidade"
              placeholderTextColor={Palette.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Região</Text>
            <TextInput
              value={formData.regiao}
              onChangeText={(value) => handleInputChange('regiao', value)}
              style={styles.input}
              placeholder="Ex: Interior, Litoral, Vale do Ribeira"
              placeholderTextColor={Palette.textSecondary}
            />
          </View>

          {/* Localização */}
          <Text style={styles.sectionTitle}>Localização (Opcional)</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Latitude</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={formData.latitude}
                  onChangeText={(value) => handleInputChange('latitude', value)}
                  style={[styles.input, styles.inputFlex]}
                  placeholder="-24.550520"
                  placeholderTextColor={Palette.textSecondary}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.mapBtn}
                  onPress={() => setShowMapModal(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="map-outline" size={20} color={Palette.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Longitude</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={formData.longitude}
                  onChangeText={(value) => handleInputChange('longitude', value)}
                  style={[styles.input, styles.inputFlex]}
                  placeholder="-47.633308"
                  placeholderTextColor={Palette.textSecondary}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.mapBtn}
                  onPress={() => setShowMapModal(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="map-outline" size={20} color={Palette.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Botão Salvar */}
          <View style={styles.saveBtnContainer}>
            <Button
              title={loading ? 'Salvando...' : 'Salvar Propriedade'}
              variant="primary"
              size="full"
              onPress={handleSave}
              disabled={loading}
            />
          </View>
        </ScrollView>

        {/* Modal do Mapa */}
        <Modal
          visible={showMapModal}
          animationType="slide"
          onRequestClose={() => setShowMapModal(false)}
        >
          <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={Palette.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Selecionar Localização</Text>
              <TouchableOpacity
                onPress={handleConfirmLocation}
                style={styles.modalConfirmBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>

            <MapView
              style={styles.map}
              initialRegion={{
                latitude: -24.68964,
                longitude: -47.85112,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Localização selecionada"
                />
              )}
            </MapView>
          </SafeAreaView>
        </Modal>

        {/* Barra de Navegação Inferior */}
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
    backgroundColor: Palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 14,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
    backgroundColor: Palette.white,
  },
  inputFlex: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapBtn: {
    marginLeft: 8,
    width: 48,
    height: 48,
    backgroundColor: Palette.surfaceGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
  },
  saveBtnContainer: {
    marginTop: 18,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
    backgroundColor: Palette.white,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  modalConfirmBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalConfirmText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: FontWeights.bold,
  },
  map: {
    flex: 1,
  },
});