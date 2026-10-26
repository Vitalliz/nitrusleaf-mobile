import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Background } from "@/components/ui/background";
import TabBar from "@/components/ui/tab-bar";
import { useProperty } from "@/contexts/PropertyContext";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function HeatMapScreen() {
  const router = useRouter();
  const { selectedProperty, properties, selectProperty } = useProperty();

  const [heatData, setHeatData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProperty) {
      void loadHeatData();
    }
  }, [selectedProperty?.id]);

  const loadHeatData = async () => {
    if (!selectedProperty) return;

    try {
      setLoading(true);
      const talhoes = await getTalhoesByProperty(selectedProperty.id.toString());

      const heatPoints: any[] = [];

      for (const talhao of talhoes) {
        const pes = await getPesByTalhao(talhao.id.toString());
        const coordinateGroups: { [key: string]: any[] } = {};

        pes.forEach((pe) => {
          if (pe.latitude && pe.longitude) {
            const lat = Math.round(pe.latitude * 1000) / 1000;
            const lng = Math.round(pe.longitude * 1000) / 1000;
            const key = `${lat},${lng}`;

            if (!coordinateGroups[key]) {
              coordinateGroups[key] = [];
            }
            coordinateGroups[key].push(pe);
          }
        });

        Object.entries(coordinateGroups).forEach(([coord, pesGroup]) => {
          const [lat, lng] = coord.split(",").map(Number);

          const deficiencyCount = pesGroup.filter(
            (pe) => pe.deficienciaManganes || pe.outros
          ).length;

          if (deficiencyCount > 0) {
            heatPoints.push({
              latitude: lat,
              longitude: lng,
              radius: Math.min(deficiencyCount * 50, 200),
              deficiencyCount,
              totalPes: pesGroup.length,
            });
          }
        });
      }

      setHeatData(heatPoints);
    } catch (error) {
      console.error("Erro ao carregar dados do mapa de calor:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (deficiencyCount: number) => {
    if (deficiencyCount >= 5) return "rgba(220, 38, 38, 0.6)"; // Vermelho intenso
    if (deficiencyCount >= 3) return "rgba(234, 88, 12, 0.6)"; // Laranja
    if (deficiencyCount >= 1) return "rgba(245, 158, 11, 0.6)"; // Amarelo
    return "rgba(34, 197, 94, 0.6)"; // Verde
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/Maps/maps" as any);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        {/* Cabeçalho Padronizado */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mapa de Calor</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Subtítulo informativo */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Zonas com maior concentração de deficiências
          </Text>
        </View>

        {/* Seletor de Propriedades */}
        <View style={styles.selectorWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertySelector}
          >
            {properties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.propertyChip,
                  selectedProperty?.id === property.id && styles.propertyChipSelected,
                ]}
                onPress={() => void selectProperty(property.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.propertyChipText,
                    selectedProperty?.id === property.id &&
                      styles.propertyChipTextSelected,
                  ]}
                >
                  {property.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Área do Mapa */}
        <View style={styles.mapContainer}>
          {selectedProperty && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedProperty.latitude || -24.68964,
                longitude: selectedProperty.longitude || -47.85112,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              mapType="satellite"
              provider={PROVIDER_GOOGLE}
            >
              {heatData.map((point, index) => (
                <Circle
                  key={index}
                  center={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  radius={point.radius}
                  fillColor={getHeatColor(point.deficiencyCount)}
                  strokeColor={getHeatColor(point.deficiencyCount)}
                  strokeWidth={2}
                />
              ))}

              <Marker
                coordinate={{
                  latitude: selectedProperty.latitude || -24.68964,
                  longitude: selectedProperty.longitude || -47.85112,
                }}
                title={selectedProperty.name}
                description="Centro da propriedade"
              />
            </MapView>
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Palette.primary} />
              <Text style={styles.loadingText}>Carregando mapa de calor...</Text>
            </View>
          )}
        </View>

        {/* Card de Legenda */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Legenda de Incidência</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: "rgba(34, 197, 94, 0.7)" },
                ]}
              />
              <Text style={styles.legendText}>Poucas deficiências</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: "rgba(245, 158, 11, 0.7)" },
                ]}
              />
              <Text style={styles.legendText}>Algumas deficiências</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: "rgba(234, 88, 12, 0.7)" },
                ]}
              />
              <Text style={styles.legendText}>Alta incidência</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: "rgba(220, 38, 38, 0.7)" },
                ]}
              />
              <Text style={styles.legendText}>Deficiência severa</Text>
            </View>
          </View>
        </View>

        {/* Barra de Navegação Inferior */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  subtitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  selectorWrapper: {
    paddingBottom: 8,
  },
  propertySelector: {
    paddingHorizontal: 16,
    gap: 8,
  },
  propertyChip: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    alignItems: "center",
    justifyContent: "center",
  },
  propertyChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  propertyChipText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  propertyChipTextSelected: {
    color: Palette.white,
    fontWeight: FontWeights.bold,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: Palette.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  legendCard: {
    backgroundColor: Palette.white,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    elevation: 2,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  legendTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "45%",
    flex: 1,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
});