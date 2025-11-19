// app/(tabs)/fields.tsx - Tabela de Talhões com busca
import Footer from '@/components/footer';
import Menu from '@/components/menu';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FieldsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fields = [
    { name: 'Talhão 1', analyzed: '27/32 pés analisados' },
    { name: 'Talhão 2', analyzed: '13/24 pés analisados' },
    { name: 'Talhão 3', analyzed: '12/26 pés analisados' },
  ];

  const [query, setQuery] = useState('');
  const filtered = fields.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Header branco como nas outras telas */}
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
        {/* Título + dropdown */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Talhões</Text>
          <TouchableOpacity style={styles.propertyDropdown}>
            <Text style={styles.propertyText}>Propriedade 1</Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
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

        {/* Lista de talhões */}
        {filtered.map((f, idx) => (
          <TouchableOpacity key={idx} style={styles.fieldCard} onPress={() => router.push({ pathname: '/(tabs)/field-feet', params: { field: f.name } })}>
            <View>
              <Text style={styles.fieldName}>{f.name}</Text>
              <Text style={styles.fieldSubtitle}>{f.analyzed}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#1A1A1A" />
          </TouchableOpacity>
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  propertyDropdown: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  propertyText: { fontSize: 14, color: '#333', marginRight: 6 },
  searchRow: { marginBottom: 16 },
  searchInput: { borderWidth: 1, borderColor: '#6BC24A', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14, color: '#1A1A1A', backgroundColor: '#FFFFFF' },
  fieldCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#6BC24A' },
  fieldName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  fieldSubtitle: { fontSize: 14, color: '#6B7280' },
});


