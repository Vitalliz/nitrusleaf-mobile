// app/(tabs)/field-feet.tsx - Lista de pés de um Talhão
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import Menu from '@/components/menu';

export default function FieldFeetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { field, newFoot } = useLocalSearchParams<{ field?: string; newFoot?: string }>();

  const [query, setQuery] = useState('');
  const [feet, setFeet] = useState([
    { name: 'Pé 1', status: 'Não-Tratado', color: '#FACC15' },
    { name: 'Pé 2', status: 'Tratado', color: '#8B5CF6' },
    { name: 'Pé 3', status: 'Tratado', color: '#8B5CF6' },
  ]);

  useEffect(() => {
    if (newFoot) {
      try {
        const footData = JSON.parse(newFoot);
        setFeet(prevFeet => [...prevFeet, footData]);
      } catch (error) {
        console.error('Erro ao parsear dados do pé:', error);
      }
    }
  }, [newFoot]);

  const filtered = feet.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=1' }} style={styles.avatar} />
          <View style={styles.headerText}><Text style={styles.greeting}>Olá, João Silva!</Text></View>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Título e voltar */}
        <View style={styles.titleRowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.title}>{field ?? 'Talhão'}</Text>
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
            placeholder="Pesquisar na tabela"
            placeholderTextColor="#6BC24A"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          <Ionicons name="search" size={20} color="#6BC24A" style={{ marginLeft: -36 }} />
        </View>

        {/* Adicionar pé */}
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push({ pathname: '/(tabs)/add-foot', params: { field: String(field || '') } })}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Adicionar pé</Text>
        </TouchableOpacity>

        {/* Lista de pés */}
        {filtered.map((p, idx) => (
          <View key={idx} style={styles.footCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.footName}>{p.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: p.color }} />
                <Text style={styles.footStatus}>{p.status}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
          </View>
        ))}

        <View style={{ height: 40 }} />
      </View>
      <Menu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EFEFEF', paddingBottom: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  headerText: { justifyContent: 'center' },
  greeting: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  menuButton: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  titleRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6BC24A', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 22 },
  backBtnText: { color: '#FFFFFF', fontWeight: '700' },
  searchRow: { marginBottom: 12 },
  searchInput: { borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14, color: '#1A1A1A', backgroundColor: '#FFFFFF' },
  addBtn: { alignSelf: 'flex-start', backgroundColor: '#6BC24A', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700' },
  footCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#6BC24A' },
  footName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  footStatus: { fontSize: 14, color: '#6B7280' },
});


