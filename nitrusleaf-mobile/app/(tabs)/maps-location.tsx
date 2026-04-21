import Footer from "@/components/footer";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { Ionicons } from "@expo/vector-icons";

export default function LocationMapScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const fullName = user?.name || "Usuário";

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [talhoes, setTalhoes] = useState<any[]>([]);
  const [selectedTalhao, setSelectedTalhao] = useState<any>(null);
  const [pes, setPes] = useState<any[]>([]);
  const [filteredPes, setFilteredPes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filterTratado, setFilterTratado] = useState(true);
  const [filterNaoTratado, setFilterNaoTratado] = useState(true);
  const [filterSemInfo, setFilterSemInfo] = useState(true);
  const [filterDeficienciaCobre, setFilterDeficienciaCobre] = useState(true);
  const [filterDeficienciaManganes, setFilterDeficienciaManganes] = useState(true);
  const [filterOutros, setFilterOutros] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  useEffect(() => {
    if (selectedProperty) {
      loadTalhoes();
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (selectedTalhao) {
      loadPes();
    }
  }, [selectedTalhao]);

  useEffect(() => {
    applyFilters();
  }, [pes, filterTratado, filterNaoTratado, filterSemInfo, filterDeficienciaCobre, filterDeficienciaManganes, filterOutros]);

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

  const loadTalhoes = async () => {
    if (!selectedProperty) return;

    try {
      const propertyTalhoes = await getTalhoesByProperty(selectedProperty.id.toString());
      setTalhoes(propertyTalhoes);
      if (propertyTalhoes.length > 0) {
        setSelectedTalhao(propertyTalhoes[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar talhões:', error);
    }
  };

  const loadPes = async () => {
    if (!selectedTalhao) return;

    try {
      setLoading(true);
      const talhaoPes = await getPesByTalhao(selectedTalhao.id.toString());
      setPes(talhaoPes);
    } catch (error) {
      console.error('Erro ao carregar pés:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = pes.filter(pe => {
      // Filtro por situação
      const situacaoMatch = (
        (filterTratado && pe.situacao === 'Tratado') ||
        (filterNaoTratado && pe.situacao === 'Não-Tratado') ||
        (filterSemInfo && pe.situacao === 'Sem-informações')
      );

      // Filtro por deficiências
      const deficienciaMatch = (
        (filterDeficienciaCobre && pe.deficienciaCobre) ||
        (filterDeficienciaManganes && pe.deficienciaManganes) ||
        (filterOutros && pe.outros) ||
        (!pe.deficienciaCobre && !pe.deficienciaManganes && !pe.outros) // Pés sem deficiências
      );

      return situacaoMatch && deficienciaMatch && pe.latitude && pe.longitude;
    });

    setFilteredPes(filtered);
  };

  const getMarkerColor = (pe: any) => {
    if (pe.situacao === 'Sem-informações') return '#6B7280';
    if (pe.situacao === 'Não-Tratado') return '#EF4444';
    if (pe.situacao === 'Tratado') return '#8B5CF6';
    if (pe.deficienciaCobre || pe.deficienciaManganes || pe.outros) return '#F59E0B';
    return '#10B981';
  };

  const getMarkerIcon = (pe: any) => {
    if (pe.situacao === 'Sem-informações') return 'help-circle';
    if (pe.situacao === 'Não-Tratado') return 'warning';
    if (pe.situacao === 'Tratado') return 'checkmark-circle';
    return 'leaf';
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
      <Text style={styles.title}>Localização de Pés</Text>
      <Text style={styles.subtitle}>Visualize todos os pés no mapa</Text>
      <View style={styles.divider}></View>

      {/* Property and Talhao Selector */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.propertySelector}>
          {properties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={[
                styles.selectorChip,
                selectedProperty?.id === property.id && styles.selectorChipSelected
              ]}
              onPress={() => setSelectedProperty(property)}
            >
              <Text style={[
                styles.selectorChipText,
                selectedProperty?.id === property.id && styles.selectorChipTextSelected
              ]}>
                {property.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.talhaoSelector}>
          {talhoes.map((talhao) => (
            <TouchableOpacity
              key={talhao.id}
              style={[
                styles.selectorChip,
                selectedTalhao?.id === talhao.id && styles.selectorChipSelected
              ]}
              onPress={() => setSelectedTalhao(talhao)}
            >
              <Text style={[
                styles.selectorChipText,
                selectedTalhao?.id === talhao.id && styles.selectorChipTextSelected
              ]}>
                {talhao.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filterTratado && styles.filterChipActive]}
          onPress={() => setFilterTratado(!filterTratado)}
        >
          <Ionicons name="checkmark-circle" size={16} color={filterTratado ? "#FFFFFF" : "#8B5CF6"} />
          <Text style={[styles.filterChipText, filterTratado && styles.filterChipTextActive]}>Tratado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterNaoTratado && styles.filterChipActive]}
          onPress={() => setFilterNaoTratado(!filterNaoTratado)}
        >
          <Ionicons name="warning" size={16} color={filterNaoTratado ? "#FFFFFF" : "#EF4444"} />
          <Text style={[styles.filterChipText, filterNaoTratado && styles.filterChipTextActive]}>Não tratado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterSemInfo && styles.filterChipActive]}
          onPress={() => setFilterSemInfo(!filterSemInfo)}
        >
          <Ionicons name="help-circle" size={16} color={filterSemInfo ? "#FFFFFF" : "#6B7280"} />
          <Text style={[styles.filterChipText, filterSemInfo && styles.filterChipTextActive]}>Sem info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterDeficienciaCobre && styles.filterChipActive]}
          onPress={() => setFilterDeficienciaCobre(!filterDeficienciaCobre)}
        >
          <Ionicons name="water" size={16} color={filterDeficienciaCobre ? "#FFFFFF" : "#F59E0B"} />
          <Text style={[styles.filterChipText, filterDeficienciaCobre && styles.filterChipTextActive]}>Cobre</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterDeficienciaManganes && styles.filterChipActive]}
          onPress={() => setFilterDeficienciaManganes(!filterDeficienciaManganes)}
        >
          <Ionicons name="nuclear" size={16} color={filterDeficienciaManganes ? "#FFFFFF" : "#F59E0B"} />
          <Text style={[styles.filterChipText, filterDeficienciaManganes && styles.filterChipTextActive]}>Manganês</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterOutros && styles.filterChipActive]}
          onPress={() => setFilterOutros(!filterOutros)}
        >
          <Ionicons name="help-circle" size={16} color={filterOutros ? "#FFFFFF" : "#F59E0B"} />
          <Text style={[styles.filterChipText, filterOutros && styles.filterChipTextActive]}>Outros</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Map */}
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
            {filteredPes.map((pe) => (
              <Marker
                key={pe.id}
                coordinate={{
                  latitude: pe.latitude,
                  longitude: pe.longitude,
                }}
                title={`Pé ${pe.nome}`}
                description={`Situação: ${pe.situacao}${pe.deficienciaCobre ? ' - Def. Cobre' : ''}${pe.deficienciaManganes ? ' - Def. Manganês' : ''}${pe.outros ? ' - Outros' : ''}`}
                pinColor={getMarkerColor(pe)}
              >
                <View style={[styles.customMarker, { backgroundColor: getMarkerColor(pe) }]}>
                  <Ionicons name={getMarkerIcon(pe)} size={16} color="#FFFFFF" />
                </View>
              </Marker>
            ))}

            {/* Marker da propriedade */}
            <Marker
              coordinate={{
                latitude: selectedProperty.latitude || -24.68964,
                longitude: selectedProperty.longitude || -47.85112
              }}
              title={selectedProperty.nome}
              description="Centro da propriedade"
            />
          </MapView>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Carregando pés...</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {filteredPes.length} pés encontrados
        </Text>
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
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  propertySelector: {
    marginBottom: 8,
  },
  talhaoSelector: {
    marginBottom: 8,
  },
  selectorChip: {
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
  selectorChipSelected: {
    backgroundColor: "#6BC24A",
    borderColor: "#6BC24A",
  },
  selectorChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: '500',
  },
  selectorChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#6BC24A",
    borderColor: "#6BC24A",
  },
  filterChipText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
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
  customMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    height: 80,
  },
});