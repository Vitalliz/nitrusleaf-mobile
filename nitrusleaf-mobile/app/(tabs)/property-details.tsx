// app/(tabs)/property-details.tsx - Detalhes da Propriedade
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';
import { getPropertyById, deleteProperty } from '@/repositories/propertyRepository';
import { getTalhoesByProperty } from '@/repositories/talhaoRepository';
import type { Property } from '@/types/property';
import type { Talhao } from '@/types/talhao';

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      loadPropertyDetails();
    }
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    if (!propertyId) return;

    try {
      const [propertyData, talhoesData] = await Promise.all([
        getPropertyById(propertyId),
        getTalhoesByProperty(propertyId)
      ]);

      setProperty(propertyData);
      setTalhoes(talhoesData);
    } catch (error) {
      console.error('Erro ao carregar detalhes da propriedade:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da propriedade.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = () => {
    if (!property) return;

    Alert.alert(
      'Excluir Propriedade',
      `Tem certeza que deseja excluir a propriedade "${property.name}"? Esta ação não pode ser desfeita e todos os talhões e pés associados serão removidos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProperty(property.id);
              Alert.alert('Sucesso', 'Propriedade excluída com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/fields')
                }
              ]);
            } catch (error) {
              console.error('Erro ao excluir propriedade:', error);
              Alert.alert('Erro', 'Não foi possível excluir a propriedade. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const handleTalhaoPress = (talhao: Talhao) => {
    router.push({
      pathname: '/(tabs)/field-feet',
      params: {
        talhaoId: talhao.id,
        talhaoName: talhao.name,
        propertyId: property?.id
      }
    });
  };

  if (loading) {
    return (
      <Background>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Propriedade</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
        <Footer />
      </Background>
    );
  }

  if (!property) {
    return (
      <Background>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Propriedade</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.emptyText}>Propriedade não encontrada</Text>
        </View>
        <Footer />
      </Background>
    );
  }

  return (
    <Background>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Propriedade</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteProperty}
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property.name}</Text>

          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Endereço</Text>
            <Text style={styles.addressText}>
              {property.logradouro}, {property.numero}
            </Text>
            <Text style={styles.addressText}>
              {property.bairro} - {property.cidade}
            </Text>
            <Text style={styles.addressText}>CEP: {property.cep}</Text>
            {property.regiao && (
              <Text style={styles.addressText}>Região: {property.regiao}</Text>
            )}
          </View>

          {property.latitude && property.longitude && (
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Localização</Text>
              <Text style={styles.locationText}>
                Latitude: {property.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Longitude: {property.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{talhoes.length}</Text>
              <Text style={styles.statLabel}>Talhões</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {talhoes.reduce((sum, t) => sum + t.totalPes, 0)}
              </Text>
              <Text style={styles.statLabel}>Total de Pés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {talhoes.reduce((sum, t) => sum + t.pesAnalisados, 0)}
              </Text>
              <Text style={styles.statLabel}>Pés Analisados</Text>
            </View>
          </View>
        </View>

        <View style={styles.talhoesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Talhões</Text>
            <TouchableOpacity
              style={styles.addTalhaoBtn}
              onPress={() => router.push({
                pathname: '/(tabs)/add-talhao' as any,
                params: { propertyId: property.id, propertyName: property.name }
              })}
            >
              <Ionicons name="add" size={16} color="#6BC24A" />
              <Text style={styles.addTalhaoText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {talhoes.length === 0 ? (
            <View style={styles.emptyTalhoes}>
              <Ionicons name="leaf-outline" size={48} color="#6BC24A" />
              <Text style={styles.emptyTitle}>Nenhum talhão cadastrado</Text>
              <Text style={styles.emptyText}>
                Adicione o primeiro talhão para começar o monitoramento
              </Text>
            </View>
          ) : (
            talhoes.map((talhao) => (
              <TouchableOpacity
                key={talhao.id}
                style={styles.talhaoCard}
                onPress={() => handleTalhaoPress(talhao)}
              >
                <View style={styles.talhaoInfo}>
                  <Text style={styles.talhaoName}>{talhao.name}</Text>
                  <Text style={styles.talhaoStats}>
                    {talhao.pesAnalisados}/{talhao.totalPes} pés analisados
                  </Text>
                  <Text style={styles.talhaoFruit}>{talhao.especieFruta}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            ))
          )}
        </View>

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
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6BC24A',
  },
  propertyName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  addressSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  locationSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6BC24A',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  talhoesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTalhaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addTalhaoText: {
    color: '#6BC24A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyTalhoes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  talhaoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#6BC24A',
  },
  talhaoInfo: {
    flex: 1,
  },
  talhaoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  talhaoStats: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  talhaoFruit: {
    fontSize: 12,
    color: '#6BC24A',
    fontWeight: '500',
  },
});