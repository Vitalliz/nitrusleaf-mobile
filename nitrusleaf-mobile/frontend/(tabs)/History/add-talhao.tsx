import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES, safeBack } from '@/utils/navigation';
import BottomNavbar from '@/components/ui/tab-bar';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { createTalhao } from '@/repositories/talhaoRepository';
import type { CreateTalhaoRequest } from '@/types/talhao';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomAlert, AlertType } from '@/components/ui/alert';
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function AddTalhaoScreen() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);

  // Estado do CustomAlert (Sucesso, Aviso e Erro)
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
    buttonText: 'Entendido',
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = 'error',
    buttonText: string = 'Entendido',
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      showAlert('Atenção', 'O nome do talhão é obrigatório.', 'warning');
      return false;
    }
    if (!formData.especieFruta.trim()) {
      showAlert('Atenção', 'A espécie da fruta é obrigatória.', 'warning');
      return false;
    }
    if (!propertyId) {
      showAlert('Erro', 'Propriedade não identificada. Volte e selecione uma propriedade.', 'error');
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
        'Sucesso!',
        'Talhão cadastrado com sucesso!',
        'success',
        'Continuar',
        () => router.replace(ROUTES.history)
      );
    } catch (error) {
      console.error('Erro ao salvar talhão:', error);
      const msg =
        error instanceof Error ? error.message : 'Não foi possível salvar o talhão. Tente novamente.';
      showAlert('Falha ao cadastrar', msg, 'error');
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
        <Text style={styles.headerTitle}>Cadastrar Talhão</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Informações do Talhão</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Propriedade</Text>
          <View style={styles.propertyBadge}>
            <Ionicons name="business-outline" size={14} color={Palette.primary} />
            <Text style={styles.propertyText}>
              {loading ? "..." : propertyName || "Sem propriedade"}
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Talhão *</Text>
          <Input
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Ex: Talhão Norte"
            size="full"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Espécie da Fruta *</Text>
          <Input
            value={formData.especieFruta}
            onChangeText={(value) =>
              handleInputChange("especieFruta", value)
            }
            placeholder="Ex: Murcote, Ponkan"
            size="full"
          />
        </View>

        <Text style={styles.sectionTitle}>Localização (Opcional)</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Latitude</Text>
          <Input
            value={formData.latitude}
            onChangeText={(value) => handleInputChange("latitude", value)}
            placeholder="Ex: -23.550520"
            keyboardType="numeric"
            size="full"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Longitude</Text>
          <Input
            value={formData.longitude}
            onChangeText={(value) => handleInputChange("longitude", value)}
            placeholder="Ex: -46.633308"
            keyboardType="numeric"
            size="full"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Coordenadas do Polígono (JSON)
          </Text>
          <Input
            value={formData.coordenadasPoligono}
            onChangeText={(value) =>
              handleInputChange("coordenadasPoligono", value)
            }
            placeholder='Ex: [{"lat": -23.55, "lng": -46.63}]'
            size="full"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Salvando..." : "Salvar Talhão"}
            variant="primary"
            size="full"
            onPress={handleSave}
            disabled={loading}
          />
        </View>
      </ScrollView>

      {/* Modal CustomAlert integrado para Validações, Sucesso e Erros */}
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
  label: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 6,
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
});