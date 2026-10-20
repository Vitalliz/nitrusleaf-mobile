import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Background } from '@/components/ui/background';
import { Header } from '@/components/ui/user-header';
import TabBar from '@/components/ui/tab-bar';
import { useProfileHeader } from '@/hooks/useProfileHeader';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

type MapOption = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  iconColor: string;
  route: string;
};

const MAP_OPTIONS: MapOption[] = [
  {
    icon: 'leaf-outline',
    label: 'Infravermelho (NDVI)',
    description: 'Visualize a saúde e vigor da vegetação',
    iconColor: Palette.primary,
    route: '/(tabs)/Maps/maps-heat',
  },
  {
    icon: 'earth-outline',
    label: 'Satélite',
    description: 'Imagem orbital de alta resolução da fazenda',
    iconColor: Palette.primary,
    route: '/(tabs)/Maps/maps-location',
  },
  {
    icon: 'flame-outline',
    label: 'Mapa de Calor',
    description: 'Regiões com maior incidência de deficiência',
    iconColor: Palette.orangePrimary,
    route: '/(tabs)/Maps/maps-heat',
  },
  {
    icon: 'location-outline',
    label: 'Localização de Pés',
    description: 'Mapeamento individual e status das árvores',
    iconColor: Palette.primary,
    route: '/(tabs)/Maps/maps-location',
  },
];

function getFormattedDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function MapsScreen() {
  const router = useRouter();
  const {
    userName,
    userSubtitle,
    userAvatar,
    showPropertyPicker,
    canSwitchProperty,
  } = useProfileHeader();

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        {/* Cabeçalho do Usuário */}
        <Header
          userName={userName}
          userSubtitle={userSubtitle}
          userAvatar={userAvatar}
          subtitleIcon="location-outline"
          onPropertyPress={showPropertyPicker}
          showPropertyChevron={canSwitchProperty}
          onAvatarPress={() => router.push('/(tabs)/Settings/profile-new')}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Título e Data */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Mapas da Fazenda</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={15} color={Palette.textSecondary} />
              <Text style={styles.dateText}>{getFormattedDate()}</Text>
            </View>
          </View>

          {/* Cartão de Resumo da Propriedade */}
          <View style={styles.mapPreviewCard}>
            <View style={styles.mapIconCircle}>
              <Ionicons name="map" size={36} color={Palette.primary} />
            </View>
            <Text style={styles.mapPropertyText} numberOfLines={1}>
              {userSubtitle || 'Propriedade Selecionada'}
            </Text>
            <Text style={styles.mapCoordinatesText}>
              Toque em uma visualização abaixo para explorar os dados
            </Text>
          </View>

          {/* Título da Seção */}
          <Text style={styles.sectionLabel}>Tipo de Visualização</Text>

          {/* Lista de Opções */}
          <View style={styles.optionsList}>
            {MAP_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.optionCard}
                activeOpacity={0.7}
                onPress={() => router.push(opt.route as any)}
              >
                <View style={styles.optionIconBox}>
                  <Ionicons name={opt.icon} size={22} color={opt.iconColor} />
                </View>

                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  <Text style={styles.optionDesc}>{opt.description}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Palette.textPrimary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Barra de Navegação Inferior Padronizada */}
        <TabBar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },

  /* Título e Data */
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },

  /* Cartão de Visualização */
  mapPreviewCard: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    elevation: 2,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  mapIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Palette.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapPropertyText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  mapCoordinatesText: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 16,
  },

  /* Seção */
  sectionLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginTop: 4,
  },

  /* Lista de Opções */
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Palette.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    elevation: 1,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Palette.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  optionDesc: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 16,
  },
});