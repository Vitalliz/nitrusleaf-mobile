import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES, safeBack } from '@/utils/navigation';
import BottomNavbar from '@/components/ui/tab-bar';
import { Background } from '@/components/ui/background';
import { createTalhao } from '@/repositories/talhaoRepository';
import type { CreateTalhaoRequest } from '@/types/talhao';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomAlert, AlertType } from '@/components/ui/alert';
import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

interface LatLng {
  latitude: number;
  longitude: number;
}

export default function AddTalhaoScreen() {
  const router = useRouter();
  const { t, isEn } = useLanguage();
  const { propertyId, propertyName } = useLocalSearchParams<{
    propertyId?: string;
    propertyName?: string;
  }>();

  const [formData, setFormData] = useState({
    name: '',
    especieFruta: '',
    latitude: '',
    longitude: '',
    coordenadasPoligono: '',
  });

  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: AlertType;
    buttonText: string;
    onCloseAction?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
    buttonText: isEn ? 'Understood' : 'Entendido',
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = 'error',
    buttonText: string = isEn ? 'Understood' : 'Entendido',
    onCloseAction?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttonText,
      onCloseAction,
    });
  };

  const handleCloseAlert = () => {
    const callback = alertConfig.onCloseAction;
    setAlertConfig((prev) => ({ ...prev, visible: false, onCloseAction: undefined }));
    if (callback) {
      callback();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleConfirmPolygon = () => {
    if (polygonPoints.length === 0) {
      setShowMapModal(false);
      return;
    }

    if (polygonPoints.length >= 3) {
      const latSum = polygonPoints.reduce((acc, p) => acc + p.latitude, 0);
      const lngSum = polygonPoints.reduce((acc, p) => acc + p.longitude, 0);
      const centerLat = (latSum / polygonPoints.length).toFixed(6);
      const centerLng = (lngSum / polygonPoints.length).toFixed(6);

      const polyString = polygonPoints.map((p) => `${p.latitude},${p.longitude}`).join(';');

      setFormData((prev) => ({
        ...prev,
        coordenadasPoligono: polyString,
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
      showAlert(
        isEn ? 'Warning' : 'Atenção',
        isEn ? 'Field name is required.' : 'O nome do talhão é obrigatório.',
        'warning',
        isEn ? 'Understood' : 'Entendido'
      );
      return false;
    }
    if (!formData.especieFruta.trim()) {
      showAlert(
        isEn ? 'Warning' : 'Atenção',
        isEn ? 'Fruit species is required.' : 'A espécie da fruta é obrigatória.',
        'warning',
        isEn ? 'Understood' : 'Entendido'
      );
      return false;
    }
    if (!propertyId) {
      showAlert(
        isEn ? 'Error' : 'Erro',
        isEn ? 'Property not identified. Go back and select a property.' : 'Propriedade não identificada. Volte e selecione uma propriedade.',
        'error',
        isEn ? 'Understood' : 'Entendido'
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !propertyId) return;

    setLoading(true);
    try {
      const talhaoData: CreateTalhaoRequest = {
        propertyId,
        name: formData.name.trim(),
        especieFruta: formData.especieFruta.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        coordenadasPoligono: formData.coordenadasPoligono.trim() || undefined,
      };

      await createTalhao(talhaoData);

      showAlert(
        isEn ? 'Success!' : 'Sucesso!',
        isEn ? 'Field registered successfully!' : 'Talhão cadastrado com sucesso!',
        'success',
        isEn ? 'Continue' : 'Continuar',
        () => router.replace(ROUTES.history)
      );
    } catch (error) {
      console.error('Erro ao salvar talhão:', error);
      const msg =
        error instanceof Error
          ? error.message
          : isEn
            ? 'Could not save the field. Please try again.'
            : 'Não foi possível salvar o talhão. Tente novamente.';
      showAlert(
        isEn ? 'Failed to register' : 'Falha ao cadastrar',
        msg,
        'error',
        isEn ? 'Understood' : 'Entendido'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => safeBack(router, ROUTES.history)} style={styles.backBtn} hitSlop={15}>
          <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("add_talhao_title")}</Text>
        <LanguageToggle compact />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          {isEn ? "Field Information" : "Informações do Talhão"}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("add_talhao_property")}</Text>
          <View style={styles.propertyBadge}>
            <Ionicons name="business-outline" size={14} color={Palette.primary} />
            <Text style={styles.propertyText}>
              {loading ? "..." : propertyName || t("common_no_property")}
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("add_talhao_name")} *</Text>
          <Input
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder={t("add_talhao_name_placeholder")}
            size="full"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("add_talhao_species")} *</Text>
          <Input
            value={formData.especieFruta}
            onChangeText={(value) =>
              handleInputChange("especieFruta", value)
            }
            placeholder={t("add_talhao_species_placeholder")}
            size="full"
          />
        </View>

        <Text style={styles.sectionTitle}>
          {isEn ? "Field Perimeter on Map" : "Demarcação do Talhão no Mapa"}
        </Text>
        <TouchableOpacity
          style={styles.mapBannerBtn}
          onPress={() => setShowMapModal(true)}
          activeOpacity={0.85}
        >
          <View style={styles.mapBannerIconBox}>
            <Ionicons name="map" size={24} color="#0EA5E9" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.mapBannerTitle}>
              {polygonPoints.length >= 3
                ? (isEn
                    ? `Perimeter Marked (${polygonPoints.length} points)`
                    : `Talhão Demarcado (${polygonPoints.length} vértices)`)
                : (isEn ? "Draw Field on Map" : "Desenhar Talhão no Mapa")}
            </Text>
            <Text style={styles.mapBannerSubtitle}>
              {polygonPoints.length >= 3
                ? (isEn ? "Tap to view or adjust boundary points" : "Toque para visualizar ou ajustar os vértices azuis")
                : (isEn ? "Tap to place boundary points and close the field area" : "Toque para marcar os pontos no mapa e fechar a forma do talhão")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Palette.textSecondary} />
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>{isEn ? "Central Latitude" : "Latitude Central"}</Text>
            <TextInput
              value={formData.latitude}
              onChangeText={(value) => handleInputChange("latitude", value)}
              style={styles.coordInput}
              placeholder="-24.68964"
              placeholderTextColor={Palette.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>{isEn ? "Central Longitude" : "Longitude Central"}</Text>
            <TextInput
              value={formData.longitude}
              onChangeText={(value) => handleInputChange("longitude", value)}
              style={styles.coordInput}
              placeholder="-47.85112"
              placeholderTextColor={Palette.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? t("common_saving") : t("add_talhao_btn")}
            variant="primary"
            size="full"
            onPress={handleSave}
            disabled={loading}
          />
        </View>
      </ScrollView>

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
            <Text style={styles.modalTitle}>{t("add_talhao_map_modal_title")}</Text>
            <TouchableOpacity
              onPress={handleConfirmPolygon}
              style={styles.modalConfirmBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.modalConfirmText}>
                {t("common_confirm")} ({polygonPoints.length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalInstructionBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#0284C7" />
            <Text style={styles.modalInstructionText}>
              {t("add_talhao_map_instructions")}
            </Text>
          </View>

          <MapView
            style={styles.map}
            mapType="satellite"
            initialRegion={{
              latitude: formData.latitude ? parseFloat(formData.latitude) : -24.68964,
              longitude: formData.longitude ? parseFloat(formData.longitude) : -47.85112,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
            onPress={handleMapPress}
            provider={PROVIDER_GOOGLE}
          >
            {polygonPoints.length >= 2 && (
              <Polyline
                coordinates={polygonPoints}
                strokeColor="#0EA5E9"
                strokeWidth={2.5}
              />
            )}

            {polygonPoints.length >= 3 && (
              <Polygon
                coordinates={polygonPoints}
                strokeColor="#0EA5E9"
                strokeWidth={2.5}
                fillColor="rgba(14, 165, 233, 0.25)"
              />
            )}

            {polygonPoints.map((point, idx) => (
              <Marker
                key={`pt-${idx}`}
                coordinate={point}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.pointMarkerBlue}>
                  <Text style={styles.pointMarkerText}>{idx + 1}</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          <View style={styles.mapControlsBar}>
            <TouchableOpacity
              style={styles.mapControlBtn}
              onPress={handleUndoPoint}
              disabled={polygonPoints.length === 0}
            >
              <Ionicons name="arrow-undo-outline" size={18} color="#1E293B" />
              <Text style={styles.mapControlBtnText}>{isEn ? "Undo" : "Desfazer"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapControlBtn}
              onPress={handleClearPoints}
              disabled={polygonPoints.length === 0}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={[styles.mapControlBtnText, { color: '#EF4444' }]}>{isEn ? "Clear" : "Limpar"}</Text>
            </TouchableOpacity>

            <View style={styles.pointsCounterBadge}>
              <Text style={styles.pointsCounterText}>
                {polygonPoints.length}{" "}
                {polygonPoints.length === 1
                  ? isEn
                    ? "vertex"
                    : "vértice"
                  : isEn
                    ? "vertices"
                    : "vértices"}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttonText={alertConfig.buttonText}
        onClose={handleCloseAlert}
      />

      <BottomNavbar />
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 12,
    marginTop: 10,
  },
  formGroup: {
    width: "100%",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  coordInput: {
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
    backgroundColor: Palette.white,
  },
  propertyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginVertical: 4,
    backgroundColor: `${Palette.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Palette.primary}35`,
  },
  propertyText: {
    fontSize: FontSizes.base,
    color: Palette.primary,
    fontWeight: FontWeights.semiBold,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
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
    backgroundColor: '#E0F2FE',
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
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalConfirmText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: FontWeights.bold,
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
  map: {
    flex: 1,
  },
  pointMarkerBlue: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0284C7',
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
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pointsCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
});