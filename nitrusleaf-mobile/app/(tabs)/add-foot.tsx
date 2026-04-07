// app/(tabs)/add-foot.tsx - Cadastro de Pé
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { showErrorAlert, showSuccessAlert } from '@/utils/alerts';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { createPe } from '@/repositories/peRepository';
import type { CreatePeRequest, SituacaoPe } from '@/types/pe';

export default function AddFootScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { talhaoId, talhaoName, propertyId } = useLocalSearchParams<{
    talhaoId?: string;
    talhaoName?: string;
    propertyId?: string;
  }>();

  const [formData, setFormData] = useState({
    identificacao: '',
    linha: '',
    coluna: '',
    situacao: 'Saudável' as SituacaoPe,
    deficiencias: [] as string[],
    observacoes: '',
    dataPlantio: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeficienciaToggle = (deficiencia: string) => {
    setFormData(prev => ({
      ...prev,
      deficiencias: prev.deficiencias.includes(deficiencia)
        ? prev.deficiencias.filter(d => d !== deficiencia)
        : [...prev.deficiencias, deficiencia]
    }));
  };

  const validateForm = () => {
    if (!formData.identificacao.trim()) {
      showErrorAlert('Identificação do pé é obrigatória');
      return false;
    }
    if (!formData.linha.trim()) {
      showErrorAlert('Linha é obrigatória');
      return false;
    }
    const linhaNum = parseInt(formData.linha);
    if (isNaN(linhaNum) || linhaNum <= 0) {
      showErrorAlert('Linha deve ser um número positivo');
      return false;
    }
    if (!formData.coluna.trim()) {
      showErrorAlert('Coluna é obrigatória');
      return false;
    }
    const colunaNum = parseInt(formData.coluna);
    if (isNaN(colunaNum) || colunaNum <= 0) {
      showErrorAlert('Coluna deve ser um número positivo');
      return false;
    }
    if (formData.dataPlantio && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dataPlantio)) {
      showErrorAlert('Data de plantio deve estar no formato AAAA-MM-DD');
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
        identificacao: formData.identificacao.trim(),
        linha: parseInt(formData.linha),
        coluna: parseInt(formData.coluna),
        situacao: formData.situacao,
        deficiencias: formData.deficiencias,
        dataPlantio: formData.dataPlantio,
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
          <Text style={styles.label}>Identificação do Pé *</Text>
          <TextInput
            value={formData.identificacao}
            onChangeText={(value) => handleInputChange('identificacao', value)}
            style={styles.input}
            placeholder="Ex: Pé 1, Árvore Norte"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Linha *</Text>
          <TextInput
            value={formData.linha}
            onChangeText={(value) => handleInputChange('linha', value)}
            style={styles.input}
            placeholder="Ex: 1"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Coluna *</Text>
          <TextInput
            value={formData.coluna}
            onChangeText={(value) => handleInputChange('coluna', value)}
            style={styles.input}
            placeholder="Ex: 1"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situação</Text>
          <View style={styles.pickerContainer}>
            {(['Saudável', 'Doente', 'Morto'] as SituacaoPe[]).map((situacao) => (
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
          {[
            'Deficiência de Cobre',
            'Deficiência de Manganês',
            'Deficiência de Zinco',
            'Deficiência de Ferro',
            'Doença Fúngica',
            'Praga',
            'Outros'
          ].map((deficiencia) => (
            <TouchableOpacity
              key={deficiencia}
              style={styles.checkboxContainer}
              onPress={() => handleDeficienciaToggle(deficiencia)}
            >
              <View style={[
                styles.checkbox,
                formData.deficiencias.includes(deficiencia) && styles.checkboxChecked
              ]}>
                {formData.deficiencias.includes(deficiencia) && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{deficiencia}</Text>
            </TouchableOpacity>
          ))}
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Data de Plantio</Text>
          <TextInput
            value={formData.dataPlantio}
            onChangeText={(value) => handleInputChange('dataPlantio', value)}
            style={styles.input}
            placeholder="AAAA-MM-DD"
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
});
