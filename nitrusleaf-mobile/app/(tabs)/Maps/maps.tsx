// app/(tabs)/Maps/maps.tsx — Tela de Mapa da Fazenda
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Background } from '@/components/ui/background';
import { Header } from '@/components/ui/user-header';
import BottomNavbar from '@/components/ui/tab-bar';
import { useProfileHeader } from '@/hooks/useProfileHeader';

type MapOption = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  color: string;
  bg: string;
  route: string;
};

const MAP_OPTIONS: MapOption[] = [
  {
    icon: 'leaf-outline',
    label: 'Infravermelho (NDVI)',
    description: 'Visualize a saúde da vegetação',
    color: '#4CAF50',
    bg: '#E8F5E9',
    route: '/(tabs)/Maps/maps-ndvi',
  },
  {
    icon: 'planet-outline',
    label: 'Satélite',
    description: 'Imagem de satélite da propriedade',
    color: '#2196F3',
    bg: '#E3F2FD',
    route: '/(tabs)/Maps/maps-satellite',
  },
  {
    icon: 'flame-outline',
    label: 'Mapa de Calor',
    description: 'Regiões com maior deficiência',
    color: '#FF5722',
    bg: '#FBE9E7',
    route: '/(tabs)/Maps/maps-ndvi',
  },
  {
    icon: 'location-outline',
    label: 'Localização de Pés',
    description: 'Mapeamento individual de árvores',
    color: '#FF9800',
    bg: '#FFF3E0',
    route: '/(tabs)/Maps/maps-satellite',
  },
];

export default function MapsScreen() {
  const router = useRouter();
  const { userName, userSubtitle, userAvatar, loading } = useProfileHeader();

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <Header
          userName={userName}
          userSubtitle={userSubtitle}
          userAvatar={userAvatar}
          subtitleIcon="location-outline"
          onMenuPress={() => console.log('menu')}
          onAvatarPress={() => router.push('/(tabs)/Settings/profile')}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Mapa da Fazenda</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {/* Preview do mapa (placeholder visual) */}
          <View style={styles.mapPreview}>
            <Ionicons name="map" size={48} color="#6BC24A" />
            <Text style={styles.mapPlaceholderText}>Sítio Santa Aurora</Text>
            <Text style={styles.mapPlaceholderSub}>-24.751441, -47.81431</Text>
          </View>

          {/* Seção de opções */}
          <Text style={styles.sectionLabel}>Tipo de Visualização</Text>
          <View style={styles.optionsGrid}>
            {MAP_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.optionCard}
                activeOpacity={0.8}
                onPress={() => router.push(opt.route as any)}
              >
                <View style={[styles.optionIcon, { backgroundColor: opt.bg }]}>
                  <Ionicons name={opt.icon} size={26} color={opt.color} />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionDesc}>{opt.description}</Text>
                <Ionicons name="chevron-forward" size={16} color="#CCC" style={styles.optionArrow} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  mapPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
    marginTop: 8,
  },
  mapPlaceholderSub: {
    fontSize: 13,
    color: '#888',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
    marginTop: 4,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2C3E',
    flex: 1,
  },
  optionDesc: {
    fontSize: 12,
    color: '#888',
    position: 'absolute',
    left: 76,
    bottom: 14,
  },
  optionArrow: {
    marginLeft: 'auto',
  },
});