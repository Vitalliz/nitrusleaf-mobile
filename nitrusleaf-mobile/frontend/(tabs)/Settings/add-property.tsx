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
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [polygonPoints, setPolygonPoints] = useState<{ latitude: number; longitude: number }[]>([]);
  const [boundaryString, setBoundaryString] = useState<string>('');

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
    if (!coordinate?.latitude || !coordinate?.longitude) return;
    setPolygonPoints((prev) => [...prev, coordinate]);
  };

  const handleUndoPoint = () => {
    setPolygonPoints((prev) => prev.slice(0, -1));
  };

  const handleClearPoints = () => {
    setPolygonPoints([]);
  };

  const handleConfirmLocation = () => {
    if (polygonPoints.length === 0) {
      setShowMapModal(false);
      return;
    }

    if (polygonPoints.length >= 3) {
      const latSum = polygonPoints.reduce((acc, p) => acc + p.latitude, 0);
      const lngSum = polygonPoints.reduce((acc, p) => acc + p.longitude, 0);
      const centerLat = (latSum / polygonPoints.length).toFixed(6);
      const centerLng = (lngSum / polygonPoints.length).toFixed(6);

      const str = polygonPoints.map((p) => `${p.latitude},${p.longitude}`).join(';');
      setBoundaryString(str);

      setFormData((prev) => ({
        ...prev,
        latitude: centerLat,
        longitude: centerLng,
      }));
    } else {
      const p = polygonPoints[0];
      setFormData((prev) => ({
        ...prev,
        latitude: p.latitude.toFixed(6),
        longitude: p.longitude.toFixed(6),
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
      if (boundaryString) {
        await AsyncStorage.setItem(`property_boundary_${created.id}`, boundaryString);
      }
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
          {/* Demarcação no Mapa */}
          <Text style={styles.sectionTitle}>Demarcação da Fazenda</Text>
          <TouchableOpacity
            style={styles.mapBannerBtn}
            onPress={() => setShowMapModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.mapBannerIconBox}>
              <Ionicons name="map" size={24} color={Palette.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.mapBannerTitle}>
                {polygonPoints.length >= 3
                  ? `Área Demarcada (${polygonPoints.length} pontos)`
                  : 'Demarcar Limites da Fazenda no Mapa'}
              </Text>
              <Text style={styles.mapBannerSubtitle}>
                {polygonPoints.length >= 3
                  ? 'Toque para visualizar ou ajustar o polígono'
                  : 'Toque para desenhar o contorno da propriedade no mapa'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.textSecondary} />
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Latitude Central</Text>
              <TextInput
                value={formData.latitude}
                onChangeText={(value) => handleInputChange('latitude', value)}
                style={styles.input}
                placeholder="-24.550520"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Longitude Central</Text>
              <TextInput
                value={formData.longitude}
                onChangeText={(value) => handleInputChange('longitude', value)}
                style={styles.input}
                placeholder="-47.633308"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
              />
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

        {/* Modal do Mapa de Demarcação */}
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
              <Text style={styles.modalTitle}>Demarcar Limites da Fazenda</Text>
              <TouchableOpacity
                onPress={handleConfirmLocation}
                style={styles.modalConfirmBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.modalConfirmText}>
                  Confirmar ({polygonPoints.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Banner de instrução */}
            <View style={styles.modalInstructionBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#0284C7" />
              <Text style={styles.modalInstructionText}>
                Toque no mapa para marcar os pontos da fazenda. Com 3 ou mais pontos a forma fecha em amarelo.
              </Text>
            </View>

            <MapView
              style={styles.map}
              mapType="satellite"
              initialRegion={{
                latitude: formData.latitude ? parseFloat(formData.latitude) : -24.68964,
                longitude: formData.longitude ? parseFloat(formData.longitude) : -47.85112,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
            >
              {/* Linhas conectando os pontos */}
              {polygonPoints.length >= 2 && (
                <Polyline
                  coordinates={polygonPoints}
                  strokeColor="#F59E0B"
                  strokeWidth={2.5}
                />
              )}

              {/* Polígono preenchido quando 3+ pontos */}
              {polygonPoints.length >= 3 && (
                <Polygon
                  coordinates={polygonPoints}
                  strokeColor="#F59E0B"
                  strokeWidth={3}
                  fillColor="rgba(245, 158, 11, 0.25)"
                />
              )}

              {/* Marcadores numerados dos vértices */}
              {polygonPoints.map((point, idx) => (
                <Marker
                  key={`pt-${idx}`}
                  coordinate={point}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View style={styles.pointMarker}>
                    <Text style={styles.pointMarkerText}>{idx + 1}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Barra de Controles Inferiores */}
            <View style={styles.mapControlsBar}>
              <TouchableOpacity
                style={styles.mapControlBtn}
                onPress={handleUndoPoint}
                disabled={polygonPoints.length === 0}
              >
                <Ionicons name="arrow-undo-outline" size={18} color="#1E293B" />
                <Text style={styles.mapControlBtnText}>Desfazer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mapControlBtn}
                onPress={handleClearPoints}
                disabled={polygonPoints.length === 0}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={[styles.mapControlBtnText, { color: '#EF4444' }]}>Limpar</Text>
              </TouchableOpacity>

              <View style={styles.pointsCounterBadge}>
                <Text style={styles.pointsCounterText}>
                  {polygonPoints.length} {polygonPoints.length === 1 ? 'ponto' : 'pontos'}
                </Text>
              </View>
            </View>
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
  mapBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  mapBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mapBannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalInstructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  modalInstructionText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
  },
  pointMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointMarkerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  mapControlsBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mapControlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  mapControlBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  pointsCounterBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pointsCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
});