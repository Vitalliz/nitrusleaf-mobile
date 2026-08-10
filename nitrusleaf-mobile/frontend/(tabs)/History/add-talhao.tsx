import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES, safeBack } from '@/utils/navigation';
import BottomNavbar from '@/components/ui/tab-bar';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { createTalhao } from '@/repositories/talhaoRepository';
import type { CreateTalhaoRequest } from '@/types/talhao';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome do talhão é obrigatório');
      return false;
    }
    if (!formData.especieFruta.trim()) {
      Alert.alert('Erro', 'Espécie da fruta é obrigatória');
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

      Alert.alert('Sucesso', 'Talhão cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace(ROUTES.history)
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar talhão:', error);
      Alert.alert('Erro', 'Não foi possível salvar o talhão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.header}>
            <TouchableOpacity onPress={() => safeBack(router, ROUTES.history)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cadastrar Talhão</Text>
            <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>

          <Text style={styles.sectionTitle}>Informações do Talhão</Text><View style={styles.formGroup}>
            <Text style={styles.label}>Propriedade</Text>

            <View style={styles.propertyBadge}>
              <Ionicons name="business-outline" size={14} color="#6BC24A" />

              <Text style={styles.propertyText}>
                {loading ? "..." : propertyName || "Sem propriedade"}
              </Text>
            </View>
          </View><View style={styles.formGroup}>
            <Text style={styles.label}>Nome do Talhão *</Text>

            <Input
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Ex: Talhão Norte"
              size="full"
            />
          </View><View style={styles.formGroup}>
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

          <Text style={styles.sectionTitle}>Localização (Opcional)</Text><View style={styles.formGroup}>
            <Text style={styles.label}>Latitude</Text>

            <Input
              value={formData.latitude}
              onChangeText={(value) => handleInputChange("latitude", value)}
              placeholder="Ex: -23.550520"
              keyboardType="numeric"
              size="full"
            />
          </View><View style={styles.formGroup}>
            <Text style={styles.label}>Longitude</Text>

            <Input
              value={formData.longitude}
              onChangeText={(value) => handleInputChange("longitude", value)}
              placeholder="Ex: -46.633308"
              keyboardType="numeric"
              size="full"
            />
          </View><View style={styles.formGroup}>
            <Text style={styles.label}>
              Coordenadas do Polígono (JSON)
            </Text>

            <Input
              value={formData.coordenadasPoligono}
              onChangeText={(value) =>
                handleInputChange("coordenadasPoligono", value)
              }
              placeholder='Ex: [{"lat": -23.55, "lng": -46.63}]'
              size="size-364"
            />
          </View><Button
            title={loading ? "Salvando..." : "Salvar Talhão"}
            variant="primary"
            size="full"
            onPress={handleSave}
            disabled={loading}
          />

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 12,
    marginTop: 4,
  },

  formGroup: {
    marginBottom: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },

  propertyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginVertical: 12,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1F2D0",
  },

  propertyText: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "600",
  },
});
