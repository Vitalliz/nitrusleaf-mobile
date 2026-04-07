import Footer from "@/components/footer";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";

export default function HeatMapScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const fullName = user?.name || "Usuário";

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [heatData, setHeatData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  useEffect(() => {
    if (selectedProperty) {
      loadHeatData();
    }
  }, [selectedProperty]);

  const loadProperties = async () => {
    if (!user?.id) return;

    try {
      const userProperties = await getPropertiesByUser(user.id);
      setProperties(userProperties);
      if (userProperties.length > 0) {
        setSelectedProperty(userProperties[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    }
  };

  const loadHeatData = async () => {
    if (!selectedProperty) return;

    try {
      setLoading(true);
const talhoes = await getTalhoesByProperty(selectedProperty.id.toString());

      const heatPoints: any[] = [];

      for (const talhao of talhoes) {
        const pes = await getPesByTalhao(talhao.id.toString());

        // Agrupar pés por coordenadas aproximadas para criar zonas de calor
        const coordinateGroups: { [key: string]: any[] } = {};

        pes.forEach(pe => {
          if (pe.latitude && pe.longitude) {
            // Arredondar coordenadas para agrupar pontos próximos
            const lat = Math.round(pe.latitude * 1000) / 1000;
            const lng = Math.round(pe.longitude * 1000) / 1000;
            const key = `${lat},${lng}`;

            if (!coordinateGroups[key]) {
              coordinateGroups[key] = [];
            }
            coordinateGroups[key].push(pe);
          }
        });

        // Criar pontos de calor baseados na concentração de deficiências
        Object.entries(coordinateGroups).forEach(([coord, pesGroup]) => {
          const [lat, lng] = coord.split(',').map(Number);

          const deficiencyCount = pesGroup.filter(pe =>
            pe.deficienciaCobre || pe.deficienciaManganes || pe.outros
          ).length;

          if (deficiencyCount > 0) {
            heatPoints.push({
              latitude: lat,
              longitude: lng,
              radius: Math.min(deficiencyCount * 50, 200), // Raio baseado na quantidade
              deficiencyCount,
              totalPes: pesGroup.length,
            });
          }
        });
      }

      setHeatData(heatPoints);
    } catch (error) {
      console.error('Erro ao carregar dados do mapa de calor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (deficiencyCount: number) => {
    if (deficiencyCount >= 5) return 'rgba(220, 38, 38, 0.6)'; // Vermelho intenso
    if (deficiencyCount >= 3) return 'rgba(234, 88, 12, 0.6)'; // Laranja
    if (deficiencyCount >= 1) return 'rgba(245, 158, 11, 0.6)'; // Amarelo
    return 'rgba(34, 197, 94, 0.6)'; // Verde
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
           <Image source={require('@/assets/images/icons/people_profile.png')}  style={styles.avatar}/>
          <Text style={styles.greeting}>Olá, {fullName.split(" ")[0]}!</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Breadcrumb */}
      <View style={styles.breadcrumbContainer}>
        <Text style={styles.breadcrumb}>Mapas</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(tabs)/maps")}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Mapa de Calor</Text>
      <Text style={styles.subtitle}>Zonas com maior concentração de deficiências</Text>
      <View style={styles.divider}></View>

      {/* Property Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.propertySelector}>
        {properties.map((property) => (
          <TouchableOpacity
            key={property.id}
            style={[
              styles.propertyChip,
              selectedProperty?.id === property.id && styles.propertyChipSelected
            ]}
            onPress={() => setSelectedProperty(property)}
          >
            <Text style={[
              styles.propertyChipText,
              selectedProperty?.id === property.id && styles.propertyChipTextSelected
            ]}>
              {property.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Heat Map */}
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

            {/* Marker da propriedade */}
            <Marker
              coordinate={{
                latitude: selectedProperty.latitude || -24.68964,
                longitude: selectedProperty.longitude || -47.85112
              }}
              title={selectedProperty.name}
              description="Centro da propriedade"
            />
          </MapView>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Carregando mapa de calor...</Text>
          </View>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legenda</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(34, 197, 94, 0.6)' }]} />
            <Text style={styles.legendText}>Poucas deficiências</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(245, 158, 11, 0.6)' }]} />
            <Text style={styles.legendText}>Algumas deficiências</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(234, 88, 12, 0.6)' }]} />
            <Text style={styles.legendText}>Muitas deficiências</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(220, 38, 38, 0.6)' }]} />
            <Text style={styles.legendText}>Muitas deficiências</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}></View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9DA",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  menuIcon: {
    fontSize: 24,
    color: "#333",
  },
  breadcrumbContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  breadcrumb: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 18,
    color: "#6BC24A",
    marginRight: 4,
  },
  backText: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  propertySelector: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  propertyChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 80,
    alignItems: 'center',
  },
  propertyChipSelected: {
    backgroundColor: "#6BC24A",
    borderColor: "#6BC24A",
  },
  propertyChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: '500',
  },
  propertyChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  legend: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 120,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  footer: {
    height: 80,
  },
});