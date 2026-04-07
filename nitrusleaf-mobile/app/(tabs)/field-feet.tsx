// app/(tabs)/field-feet.tsx - Lista de pés de um Talhão
import Footer from '@/components/footer';
import { Ionicons } from '@expo/vector-icons';
import { Background } from '@/components/ui/background';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { getPesByTalhao } from '@/repositories/peRepository';
import type { Pe } from '@/types/pe';

export default function FieldFeetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { talhaoId, talhaoName, propertyId } = useLocalSearchParams<{
    talhaoId?: string;
    talhaoName?: string;
    propertyId?: string;
  }>();
  const { user } = useAuth();
  const fullName = user?.name || 'Usuário';
  const firstName = fullName.split(' ')[0];

  const [pes, setPes] = useState<Pe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (talhaoId) {
      loadPes();
    }
  }, [talhaoId]);

  const loadPes = async () => {
    if (!talhaoId) return;

    try {
      const pesData = await getPesByTalhao(talhaoId);
      setPes(pesData);
    } catch (error) {
      console.error('Erro ao carregar pés:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pés.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (situacao: string) => {
    switch (situacao) {
      case 'Tratado':
        return '#8B5CF6'; // Roxo
      case 'Não-Tratado':
        return '#FACC15'; // Amarelo
      case 'Sem-informações':
      default:
        return '#6B7280'; // Cinza
    }
  };

  const filteredPes = pes.filter(pe =>
    pe.identificacao.toLowerCase().includes(query.toLowerCase())
  );

  const handlePePress = (pe: Pe) => {
    router.push({
      pathname: '/(tabs)/pe-details' as any,
      params: {
        peId: pe.id,
        talhaoId,
        talhaoName
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
          <Text style={styles.loadingText}>Carregando pés...</Text>
        </View>
        <Footer />
      </Background>
    );
  }

  return (
    <Background>
      {/* Header */}
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
        {/* Título e voltar */}
        <View style={styles.titleRowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.title}>{talhaoName || 'Talhão'}</Text>
            <Ionicons name="settings-outline" size={16} color="#6B7280" />
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/fields')}>
            <Ionicons name="return-down-back" size={20} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Busca */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Pesquisar pés"
            placeholderTextColor="#6BC24A"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          <Ionicons name="search" size={20} color="#6BC24A" style={{ marginLeft: -36 }} />
        </View>

        {/* Adicionar pé */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (talhaoId) {
              router.push({
                pathname: '/(tabs)/add-foot',
                params: {
                  talhaoId,
                  talhaoName,
                  propertyId
                }
              });
            }
          }}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Adicionar pé</Text>
        </TouchableOpacity>

        {/* Lista de pés */}
        {filteredPes.map((pe) => (
          <TouchableOpacity
            key={pe.id}
            style={styles.footCard}
            onPress={() => handlePePress(pe)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.footName}>{pe.identificacao}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: getStatusColor(pe.situacao)
                  }}
                />
                <Text style={styles.footStatus}>{pe.situacao}</Text>
              </View>
              {(pe.deficienciaCobre || pe.deficienciaManganes || pe.outros) && (
                <View style={styles.deficienciesContainer}>
                  {pe.deficienciaCobre && (
                    <Text style={styles.deficiencyTag}>Cobre</Text>
                  )}
                  {pe.deficienciaManganes && (
                    <Text style={styles.deficiencyTag}>Manganês</Text>
                  )}
                  {pe.outros && (
                    <Text style={styles.deficiencyTag}>Outros</Text>
                  )}
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ))}

        {filteredPes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color="#6BC24A" />
            <Text style={styles.emptyTitle}>Nenhum pé encontrado</Text>
            <Text style={styles.emptyText}>
              Adicione o primeiro pé para começar as análises
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
  titleRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  backBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6BC24A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  backBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  searchRow: { marginBottom: 16 },
  searchInput: { borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14, color: '#1A1A1A', backgroundColor: '#FFFFFF' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, marginBottom: 16 },
  addBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  footCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#6BC24A' },
  footName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  footStatus: { fontSize: 14, color: '#374151' },
  deficienciesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  deficiencyTag: { backgroundColor: '#FEF3C7', color: '#92400E', fontSize: 12, fontWeight: '500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  loadingText: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 40 },
});
