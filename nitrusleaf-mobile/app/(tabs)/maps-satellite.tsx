import Footer from "@/components/footer";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";

export default function SatelliteMapScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const fullName = user?.name || "Usuário";

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [pes, setPes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  useEffect(() => {
    if (selectedProperty) {
      loadPes();
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

  const loadPes = async () => {
    if (!selectedProperty) return;

    try {
      setLoading(true);
        const talhoes = await getTalhoesByProperty(selectedProperty.id.toString());
      let allPes: any[] = [];

      for (const talhao of talhoes) {
        const talhaoPes = await getPesByTalhao(talhao.id.toString());
        allPes = [...allPes, ...talhaoPes.filter(pe => pe.latitude && pe.longitude)];
      }

      setPes(allPes);
    } catch (error) {
      console.error('Erro ao carregar pés:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (pe: any) => {
    if (pe.situacao === 'Morto') return '#6B7280';
    if (pe.situacao === 'Doente') return '#EF4444';
    if (pe.deficienciaCobre || pe.deficienciaManganes || pe.outros) return '#F59E0B';
    return '#10B981';
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
              {property.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Title */}
      <Text style={styles.title}>Mapa de Satélite</Text>
      <Text style={styles.subtitle}>
        {selectedProperty ? `Propriedade: ${selectedProperty.nome}` : 'Selecione uma propriedade'}
      </Text>
      <View style={styles.divider}></View>

      {/* Satellite Map usando MapView igual ao segundo código */}
      <View style={styles.mapContainer}>
        {selectedProperty && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedProperty.latitude || -24.68964,
              longitude: selectedProperty.longitude || -47.85112,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            mapType="satellite"
            provider={PROVIDER_GOOGLE}
          >
            {/* Marker da propriedade */}
            <Marker
              coordinate={{
                latitude: selectedProperty.latitude || -24.68964,
                longitude: selectedProperty.longitude || -47.85112
              }}
              title={selectedProperty.nome}
              description="Centro da propriedade"
            />

            {/* Markers dos pés */}
            {pes.map((pe) => (
              <Marker
                key={pe.id}
                coordinate={{
                  latitude: pe.latitude,
                  longitude: pe.longitude,
                }}
                title={`Pé ${pe.identificacao}`}
                description={`Situação: ${pe.situacao}${pe.deficienciaCobre ? ' - Def. Cobre' : ''}${pe.deficienciaManganes ? ' - Def. Manganês' : ''}${pe.outros ? ' - Outros' : ''}`}
                pinColor={getMarkerColor(pe)}
              />
            ))}
          </MapView>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Carregando pés...</Text>
          </View>
        )}
      </View>

      {/* Expand Button */}
      <View style={styles.expandContainer}>
        <TouchableOpacity style={styles.expandButton}>
          <Text style={styles.expandText}>Expandir ↗️</Text>
        </TouchableOpacity>
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
    fontWeight: "500",
  },
  menuIcon: {
    fontSize: 28,
    fontWeight: "700",
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  breadcrumb: {
    fontSize: 16,
    color: "#6C6C6C",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#5DBF4A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  backArrow: {
    fontSize: 16,
    color: "white",
    marginRight: 6,
  },
  backText: {
    fontSize: 15,
    color: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 20,
    marginBottom: 10,
  },
  propertySelector: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  propertyChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  propertyChipSelected: {
    backgroundColor: "#6BC24A",
    borderColor: "#6BC24A",
  },
  propertyChipText: {
    fontSize: 14,
    color: "#666",
  },
  propertyChipTextSelected: {
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#C3A678",
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  propertyName: {
    marginLeft: 20,
    fontSize: 15,
    marginBottom: 10,
  },
  mapContainer: {
    width: "90%",
    height: 250,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ddd",
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
  expandContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  expandButton: {
    backgroundColor: "#EDEDED",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  expandText: {
    fontSize: 15,
    color: "#5A5A5A",
  },
  footer: {
    marginTop: 250,
  },
});
