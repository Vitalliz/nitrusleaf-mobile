// app/(tabs)/add-property.tsx - Cadastro de Propriedade
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createProperty } from '@/repositories/propertyRepository';
import type { CreatePropertyRequest } from '@/types/property';

export default function AddPropertyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da propriedade é obrigatório');
      return false;
    }
    if (!formData.cep.trim()) {
      Alert.alert('Erro', 'CEP é obrigatório');
      return false;
    }
    if (!formData.logradouro.trim()) {
      Alert.alert('Erro', 'Logradouro é obrigatório');
      return false;
    }
    if (!formData.numero.trim()) {
      Alert.alert('Erro', 'Número é obrigatório');
      return false;
    }
    if (!formData.bairro.trim()) {
      Alert.alert('Erro', 'Bairro é obrigatório');
      return false;
    }
    if (!formData.cidade.trim()) {
      Alert.alert('Erro', 'Cidade é obrigatória');
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
        numero: parseInt(formData.numero.trim()),
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        regiao: formData.regiao.trim() || undefined,
      };

      await createProperty(propertyData);

      Alert.alert('Sucesso', 'Propriedade cadastrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/fields')
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      Alert.alert('Erro', 'Não foi possível salvar a propriedade. Tente novamente.');
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
        <Text style={styles.headerTitle}>Cadastrar Propriedade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Informações da Propriedade</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da Propriedade *</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
            placeholder="Ex: Fazenda São João"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={styles.sectionTitle}>Endereço</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>CEP *</Text>
          <TextInput
            value={formData.cep}
            onChangeText={(value) => handleInputChange('cep', value)}
            style={styles.input}
            placeholder="00000-000"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Logradouro *</Text>
          <TextInput
            value={formData.logradouro}
            onChangeText={(value) => handleInputChange('logradouro', value)}
            style={styles.input}
            placeholder="Rua, Avenida, etc."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Número *</Text>
            <TextInput
              value={formData.numero}
              onChangeText={(value) => handleInputChange('numero', value)}
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, { flex: 2 }]}>
            <Text style={styles.label}>Bairro *</Text>
            <TextInput
              value={formData.bairro}
              onChangeText={(value) => handleInputChange('bairro', value)}
              style={styles.input}
              placeholder="Centro"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cidade *</Text>
          <TextInput
            value={formData.cidade}
            onChangeText={(value) => handleInputChange('cidade', value)}
            style={styles.input}
            placeholder="São Paulo"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Região</Text>
          <TextInput
            value={formData.regiao}
            onChangeText={(value) => handleInputChange('regiao', value)}
            style={styles.input}
            placeholder="Ex: Interior, Litoral"
            placeholderTextColor="#999"
          />
        </View>

        <Text style={styles.sectionTitle}>Localização (Opcional)</Text>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              value={formData.latitude}
              onChangeText={(value) => handleInputChange('latitude', value)}
              style={styles.input}
              placeholder="-23.550520"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              value={formData.longitude}
              onChangeText={(value) => handleInputChange('longitude', value)}
              style={styles.input}
              placeholder="-46.633308"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'Salvando...' : 'Salvar Propriedade'}
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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