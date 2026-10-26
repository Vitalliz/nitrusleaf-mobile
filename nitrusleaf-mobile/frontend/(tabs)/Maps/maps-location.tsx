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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Background } from "@/components/ui/background";
import TabBar from "@/components/ui/tab-bar";
import { useProperty } from "@/contexts/PropertyContext";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function LocationMapScreen() {
  const router = useRouter();
  const { selectedProperty, properties, selectProperty } = useProperty();

  const [talhoes, setTalhoes] = useState<any[]>([]);
  const [selectedTalhao, setSelectedTalhao] = useState<any>(null);
  const [pes, setPes] = useState<any[]>([]);
  const [filteredPes, setFilteredPes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filterTratado, setFilterTratado] = useState(true);
  const [filterNaoTratado, setFilterNaoTratado] = useState(true);
  const [filterSemInfo, setFilterSemInfo] = useState(true);
  const [filterDeficienciaManganes, setFilterDeficienciaManganes] = useState(true);
  const [filterOutros, setFilterOutros] = useState(true);

  useEffect(() => {
    if (selectedProperty) {
      void loadTalhoes();
    }
  }, [selectedProperty?.id]);

  useEffect(() => {
    if (selectedTalhao) {
      void loadPes();
    }
  }, [selectedTalhao]);

  useEffect(() => {
    applyFilters();
  }, [
    pes,
    filterTratado,
    filterNaoTratado,
    filterSemInfo,
    filterDeficienciaManganes,
    filterOutros,
  ]);

  const loadTalhoes = async () => {
    if (!selectedProperty) return;

    try {
      const propertyTalhoes = await getTalhoesByProperty(selectedProperty.id.toString());
      setTalhoes(propertyTalhoes);
      if (propertyTalhoes.length > 0) {
        setSelectedTalhao(propertyTalhoes[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar talhões:", error);
    }
  };

  const loadPes = async () => {
    if (!selectedTalhao) return;

    try {
      setLoading(true);
      const talhaoPes = await getPesByTalhao(selectedTalhao.id.toString());
      setPes(talhaoPes);
    } catch (error) {
      console.error("Erro ao carregar pés:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = pes.filter((pe) => {
      const situacaoMatch =
        (filterTratado && pe.situacao === "Tratado") ||
        (filterNaoTratado && pe.situacao === "Não-Tratado") ||
        (filterSemInfo && pe.situacao === "Sem-informações");

      const deficienciaMatch =
        (filterDeficienciaManganes && pe.deficienciaManganes) ||
        (filterOutros && pe.outros) ||
        (!pe.deficienciaManganes && !pe.outros);

      return situacaoMatch && deficienciaMatch && pe.latitude && pe.longitude;
    });

    setFilteredPes(filtered);
  };

  const getMarkerColor = (pe: any) => {
    if (pe.situacao === "Sem-informações") return "#6B7280";
    if (pe.situacao === "Não-Tratado") return Palette.error;
    if (pe.situacao === "Tratado") return "#8B5CF6";
    if (pe.deficienciaManganes || pe.outros) return Palette.orangePrimary;
    return Palette.primary;
  };

  const getMarkerIcon = (pe: any): keyof typeof Ionicons.glyphMap => {
    if (pe.situacao === "Sem-informações") return "help-circle";
    if (pe.situacao === "Não-Tratado") return "warning";
    if (pe.situacao === "Tratado") return "checkmark-circle";
    return "leaf";
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

        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Localização de Pés</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Subtítulo informativo */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Visualize todos os pés cadastrados no mapa</Text>
        </View>

        {/* Seletores: Propriedade e Talhão */}
        <View style={styles.selectorsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {properties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.selectorChip,
                  selectedProperty?.id === property.id && styles.selectorChipSelected,
                ]}
                onPress={() => void selectProperty(property.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectorChipText,
                    selectedProperty?.id === property.id && styles.selectorChipTextSelected,
                  ]}
                >
                  {property.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {talhoes.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScroll}
            >
              {talhoes.map((talhao) => (
                <TouchableOpacity
                  key={talhao.id}
                  style={[
                    styles.selectorChip,
                    styles.selectorChipTalhao,
                    selectedTalhao?.id === talhao.id && styles.selectorChipTalhaoSelected,
                  ]}
                  onPress={() => setSelectedTalhao(talhao)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.selectorChipText,
                      selectedTalhao?.id === talhao.id && styles.selectorChipTextSelected,
                    ]}
                  >
                    {talhao.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Filtros em Chips */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            <TouchableOpacity
              style={[styles.filterChip, filterTratado && styles.filterChipActive]}
              onPress={() => setFilterTratado(!filterTratado)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={filterTratado ? Palette.white : "#8B5CF6"}
              />
              <Text
                style={[styles.filterChipText, filterTratado && styles.filterChipTextActive]}
              >
                Tratado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterNaoTratado && styles.filterChipActive]}
              onPress={() => setFilterNaoTratado(!filterNaoTratado)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="warning"
                size={15}
                color={filterNaoTratado ? Palette.white : Palette.error}
              />
              <Text
                style={[styles.filterChipText, filterNaoTratado && styles.filterChipTextActive]}
              >
                Não tratado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterSemInfo && styles.filterChipActive]}
              onPress={() => setFilterSemInfo(!filterSemInfo)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="help-circle"
                size={15}
                color={filterSemInfo ? Palette.white : Palette.textSecondary}
              />
              <Text
                style={[styles.filterChipText, filterSemInfo && styles.filterChipTextActive]}
              >
                Sem info
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[
                styles.filterChip,
                filterDeficienciaManganes && styles.filterChipActive,
              ]}
              onPress={() => setFilterDeficienciaManganes(!filterDeficienciaManganes)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="nuclear"
                size={15}
                color={filterDeficienciaManganes ? Palette.white : Palette.deficiencyManganese}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filterDeficienciaManganes && styles.filterChipTextActive,
                ]}
              >
                Manganês
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filterOutros && styles.filterChipActive]}
              onPress={() => setFilterOutros(!filterOutros)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="help-circle"
                size={15}
                color={filterOutros ? Palette.white : Palette.textSecondary}
              />
              <Text
                style={[styles.filterChipText, filterOutros && styles.filterChipTextActive]}
              >
                Outros
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Mapa */}
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
                  description={`Situação: ${pe.situacao}`}
                >
                  <View style={[styles.customMarker, { backgroundColor: getMarkerColor(pe) }]}>
                    <Ionicons name={getMarkerIcon(pe)} size={14} color={Palette.white} />
                  </View>
                </Marker>
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
              <Text style={styles.loadingText}>Carregando árvores...</Text>
            </View>
          )}
        </View>

        {/* Barra de Rodapé com Contagem */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {filteredPes.length} {filteredPes.length === 1 ? "árvore encontrada" : "árvores encontradas"}
          </Text>
        </View>

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
  selectorsWrapper: {
    gap: 6,
    paddingBottom: 6,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  selectorChip: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  selectorChipTalhao: {
    backgroundColor: Palette.surfaceGray,
    borderColor: Palette.surfaceGray,
  },
  selectorChipTalhaoSelected: {
    backgroundColor: Palette.primaryPressed,
    borderColor: Palette.primaryPressed,
  },
  selectorChipText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  selectorChipTextSelected: {
    color: Palette.white,
    fontWeight: FontWeights.bold,
  },
  filtersWrapper: {
    paddingBottom: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  filterChipTextActive: {
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
    marginBottom: 8,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Palette.white,
    elevation: 3,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
  infoBar: {
    alignItems: "center",
    paddingVertical: 6,
  },
  infoText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
});