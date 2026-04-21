// app/(tabs)/add-foot.tsx - Cadastro de Pé
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { showErrorAlert, showSuccessAlert } from '@/utils/alerts';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { createPe } from '@/repositories/peRepository';
import type { CreatePeRequest, SituacaoPe } from '@/types/pe';
import { SITUACOES_PE } from '@/types/pe';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function AddFootScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { talhaoId, talhaoName, propertyId } = useLocalSearchParams<{
    talhaoId?: string;
    talhaoName?: string;
    propertyId?: string;
  }>();

  const [formData, setFormData] = useState({
    nome: '',
    situacao: 'Sem-informações' as SituacaoPe,
    deficienciaCobre: false,
    deficienciaManganes: false,
    outros: false,
    observacoes: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
      }));
    }
    setShowMapModal(false);
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      showErrorAlert('Nome do pé é obrigatório');
      return false;
    }
    if (formData.latitude && (isNaN(parseFloat(formData.latitude)) || parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      showErrorAlert('Latitude deve ser um número entre -90 e 90');
      return false;
    }
    if (formData.longitude && (isNaN(parseFloat(formData.longitude)) || parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      showErrorAlert('Longitude deve ser um número entre -180 e 180');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !talhaoId) return;

    setLoading(true);
    try {
      const peData: CreatePeRequest = {
        talhaoId,
        nome: formData.nome.trim(),
        situacao: formData.situacao,
        deficienciaCobre: formData.deficienciaCobre,
        deficienciaManganes: formData.deficienciaManganes,
        outros: formData.outros,
        observacoes: formData.observacoes.trim() || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };

      await createPe(peData);

      showSuccessAlert('Pé cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace({
            pathname: '/(tabs)/field-feet',
            params: {
              talhaoId,
              talhaoName,
              propertyId
            }
          })
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar pé:', error);
      showErrorAlert('Não foi possível salvar o pé. Tente novamente.');
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
        <Text style={styles.headerTitle}>Cadastrar Pé</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Informações do Pé</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Talhão</Text>
          <TextInput
            value={talhaoName || ''}
            editable={false}
            style={styles.inputDisabled}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do pé *</Text>
          <TextInput
            value={formData.nome}
            onChangeText={(value) => handleInputChange('nome', value)}
            style={styles.input}
            placeholder="Ex: Pé 1, Linha A"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situação</Text>
          <View style={styles.pickerContainer}>
            {SITUACOES_PE.map((situacao) => (
              <TouchableOpacity
                key={situacao}
                style={[
                  styles.pickerOption,
                  formData.situacao === situacao && styles.pickerOptionSelected
                ]}
                onPress={() => handleInputChange('situacao', situacao)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.situacao === situacao && styles.pickerOptionTextSelected
                ]}>
                  {situacao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Deficiências Identificadas</Text>

        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('deficienciaCobre', !formData.deficienciaCobre)}
          >
            <View style={[
              styles.checkbox,
              formData.deficienciaCobre && styles.checkboxChecked
            ]}>
              {formData.deficienciaCobre && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Deficiência de Cobre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('deficienciaManganes', !formData.deficienciaManganes)}
          >
            <View style={[
              styles.checkbox,
              formData.deficienciaManganes && styles.checkboxChecked
            ]}>
              {formData.deficienciaManganes && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Deficiência de Manganês</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('outros', !formData.outros)}
          >
            <View style={[
              styles.checkbox,
              formData.outros && styles.checkboxChecked
            ]}>
              {formData.outros && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Outros</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            value={formData.observacoes}
            onChangeText={(value) => handleInputChange('observacoes', value)}
            style={[styles.input, styles.textArea]}
            placeholder="Observações adicionais sobre o pé"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <Text style={styles.sectionTitle}>Localização (Opcional)</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Latitude</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={formData.latitude}
              onChangeText={(value) => handleInputChange('latitude', value)}
              style={[styles.input, { flex: 1 }]}
              placeholder="Ex: -23.550520"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => setShowMapModal(true)}
            >
              <Ionicons name="map-outline" size={20} color="#6BC24A" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Longitude</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={formData.longitude}
              onChangeText={(value) => handleInputChange('longitude', value)}
              style={[styles.input, { flex: 1 }]}
              placeholder="Ex: -46.633308"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => setShowMapModal(true)}
            >
              <Ionicons name="map-outline" size={20} color="#6BC24A" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'Salvando...' : 'Salvar Pé'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal do Mapa */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowMapModal(false)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecionar Localização</Text>
            <TouchableOpacity
              onPress={handleConfirmLocation}
              style={styles.modalConfirmBtn}
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
        </View>
      </Modal>

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
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6BC24A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  pickerOptionSelected: {
    backgroundColor: '#6BC24A',
    borderColor: '#6BC24A',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#6BC24A',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6BC24A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#6BC24A',
    borderColor: '#6BC24A',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapBtn: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: '#F0F9F0',
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseBtn: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalConfirmBtn: {
    backgroundColor: '#6BC24A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
});
