// app/(tabs)/add-talhao.tsx - Cadastro de Talhão
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { createTalhao } from '@/repositories/talhaoRepository';
import type { CreateTalhaoRequest } from '@/types/talhao';

export default function AddTalhaoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
          onPress: () => router.replace('/(tabs)/fields')
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Talhão</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Informações do Talhão</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Propriedade</Text>
          <TextInput
            value={propertyName || ''}
            editable={false}
            style={styles.inputDisabled}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Talhão *</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
            placeholder="Ex: Talhão Norte"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Espécie da Fruta *</Text>
          <TextInput
            value={formData.especieFruta}
            onChangeText={(value) => handleInputChange('especieFruta', value)}
            style={styles.input}
            placeholder="Ex: Laranja, Limão, Abacaxi"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={styles.sectionTitle}>Localização (Opcional)</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            value={formData.latitude}
            onChangeText={(value) => handleInputChange('latitude', value)}
            style={styles.input}
            placeholder="Ex: -23.550520"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            value={formData.longitude}
            onChangeText={(value) => handleInputChange('longitude', value)}
            style={styles.input}
            placeholder="Ex: -46.633308"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Coordenadas do Polígono (JSON)</Text>
          <TextInput
            value={formData.coordenadasPoligono}
            onChangeText={(value) => handleInputChange('coordenadasPoligono', value)}
            style={[styles.input, styles.textArea]}
            placeholder='Ex: [{"lat": -23.55, "lng": -46.63}, ...]'
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'Salvando...' : 'Salvar Talhão'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF'
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6BC24A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#6BC24A',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});