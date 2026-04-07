// app/(tabs)/fields.tsx - Tabela de Propriedades e Talhões
import Footer from '@/components/footer';
import { Ionicons } from '@expo/vector-icons';
import { Background } from '@/components/ui/background';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { getPropertiesByUser } from '@/repositories/propertyRepository';
import { getTalhoesByProperty } from '@/repositories/talhaoRepository';
import type { Property } from '@/types/property';
import type { Talhao } from '@/types/talhao';

export default function FieldsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const fullName = user?.name || 'Usuário';
  const firstName = fullName.split(' ')[0];

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadProperties();
  }, [user]);

  useEffect(() => {
    if (selectedProperty) {
      loadTalhoes(selectedProperty.id);
    }
  }, [selectedProperty]);

  const loadProperties = async () => {
    if (!user?.id) return;

    try {
      const props = await getPropertiesByUser(user.id);
      setProperties(props);
      if (props.length > 0 && !selectedProperty) {
        setSelectedProperty(props[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      Alert.alert('Erro', 'Não foi possível carregar as propriedades.');
    } finally {
      setLoading(false);
    }
  };

  const loadTalhoes = async (propertyId: string) => {
    try {
      const talhoesData = await getTalhoesByProperty(propertyId);
      setTalhoes(talhoesData);
    } catch (error) {
      console.error('Erro ao carregar talhões:', error);
      Alert.alert('Erro', 'Não foi possível carregar os talhões.');
    }
  };

  const filteredTalhoes = talhoes.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  const handlePropertyChange = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleTalhaoPress = (talhao: Talhao) => {
    router.push({
      pathname: '/(tabs)/field-feet',
      params: {
        talhaoId: talhao.id,
        talhaoName: talhao.name,
        propertyId: selectedProperty?.id
      }
    });
  };

  if (loading) {
    return (
      <Background>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerLeft}>
            <Image source={require('@/assets/images/icons/people_profile.png')} style={styles.avatar}/>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Olá, {firstName}!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
        <Footer />
      </Background>
    );
  }

  return (
    <Background>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
           <Image source={require('@/assets/images/icons/people_profile.png')}  style={styles.avatar}/>
          <View style={styles.headerText}><Text style={styles.greeting}>Olá, {firstName}!</Text></View>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Talhões</Text>
          <View style={styles.propertyRow}>
            <TouchableOpacity
              style={styles.propertyDropdown}
              onPress={() => {
                if (properties.length > 1) {
                  const propertyOptions = properties.map(p => ({
                    text: p.name,
                    onPress: () => handlePropertyChange(p)
                  }));
                  Alert.alert(
                    'Selecionar Propriedade',
                    'Escolha uma propriedade:',
                    [...propertyOptions, { text: 'Cancelar', style: 'cancel' }]
                  );
                }
              }}
            >
              <Text style={styles.propertyText}>
                {selectedProperty?.name || 'Selecione uma propriedade'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>
            {selectedProperty && (
              <TouchableOpacity
                style={styles.propertyMenuBtn}
                onPress={() => router.push('/(tabs)/property-details' as any)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#6BC24A" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.addPropertyBtn}
          onPress={() => router.push('/(tabs)/add-property' as any)}
        >
          <Ionicons name="add" size={20} color="#6BC24A" />
          <Text style={styles.addPropertyText}>Adicionar Propriedade</Text>
        </TouchableOpacity>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Pesquisar talhões"
            placeholderTextColor="#6BC24A"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          <Ionicons name="search" size={20} color="#6BC24A" style={{ marginLeft: -36 }} />
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (selectedProperty) {
              router.push({
                pathname: '/(tabs)/add-talhao' as any,
                params: { propertyId: selectedProperty.id, propertyName: selectedProperty.name }
              });
            } else {
              Alert.alert('Erro', 'Selecione uma propriedade primeiro.');
            }
          }}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Adicionar talhão</Text>
        </TouchableOpacity>

        {filteredTalhoes.map((talhao) => (
          <TouchableOpacity
            key={talhao.id}
            style={styles.fieldCard}
            onPress={() => handleTalhaoPress(talhao)}
          >
            <View>
              <Text style={styles.fieldName}>{talhao.name}</Text>
              <Text style={styles.fieldSubtitle}>
                {talhao.pesAnalisados}/{talhao.totalPes} pés analisados
              </Text>
              <Text style={styles.fieldFruit}>{talhao.especieFruta}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ))}

        {filteredTalhoes.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color="#6BC24A" />
            <Text style={styles.emptyTitle}>Nenhum talhão encontrado</Text>
            <Text style={styles.emptyText}>
              {selectedProperty
                ? 'Adicione o primeiro talhão para começar'
                : 'Selecione uma propriedade para ver os talhões'
              }
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </View>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EFEFEF', paddingBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  headerText: { justifyContent: 'center' },
  greeting: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  menuButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  propertyRow: { flexDirection: 'row', alignItems: 'center' },
  propertyDropdown: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF', marginRight: 8 },
  propertyText: { fontSize: 14, color: '#333', marginRight: 6 },
  propertyMenuBtn: { padding: 8 },
  searchRow: { marginBottom: 16 },
  searchInput: { borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14, color: '#1A1A1A', backgroundColor: '#FFFFFF' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, marginBottom: 16 },
  addBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  fieldCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#6BC24A' },
  fieldName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  fieldSubtitle: { fontSize: 14, color: '#6B7280' },
  fieldFruit: { fontSize: 12, color: '#6BC24A', fontWeight: '500', marginTop: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  loadingText: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 40 },
  addPropertyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, marginBottom: 16 },
  addPropertyText: { color: '#6BC24A', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
