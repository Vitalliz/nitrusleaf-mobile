import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import MapView, {
  Marker,
  Polygon,
  Circle,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TabBar from "@/components/ui/tab-bar";
import { useProperty } from "@/contexts/PropertyContext";
import { useAuth } from "@/contexts/AuthContext";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import type { Talhao } from "@/types/talhao";
import type { Pe } from "@/types/pe";

// ─── Types ──────────────────────────────────────────────────────────────────

type FilterKey = "todos" | "manganes" | "tratado" | "naoTratado";
type ViewMode = "satellite" | "heat";
type ActiveSheet = "none" | "areaInfo" | "layerFilters" | "layerMode" | "datePicker";

interface PeWithTalhao extends Pe {
  talhaoId: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface PolygonTooltip {
  name: string;
  type: "talhao" | "property";
  coordinate: LatLng;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converte string "lat,lng;lat,lng;..." salva no banco em coordenadas */
function parsePolygon(raw?: string): LatLng[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((pair) => {
      const parts = pair.split(",").map(Number);
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
      return { latitude: parts[0], longitude: parts[1] };
    })
    .filter(Boolean) as LatLng[];
}

/** Calcula o centroide de uma lista de coordenadas */
function getCentroid(coords: LatLng[]): LatLng | null {
  if (coords.length === 0) return null;
  const lat = coords.reduce((s, c) => s + c.latitude, 0) / coords.length;
  const lng = coords.reduce((s, c) => s + c.longitude, 0) / coords.length;
  return { latitude: lat, longitude: lng };
}

/** Calcula área aproximada em hectares a partir de coordenadas GPS */
function calculateHectares(coords: LatLng[]): number {
  if (coords.length < 3) return 0;
  const radius = 6378137; // Raio da Terra em metros
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const p1 = coords[i];
    const p2 = coords[j];
    const lat1 = (p1.latitude * Math.PI) / 180;
    const lat2 = (p2.latitude * Math.PI) / 180;
    const lng1 = (p1.longitude * Math.PI) / 180;
    const lng2 = (p2.longitude * Math.PI) / 180;
    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = (Math.abs(area) * radius * radius) / 2.0;
  return area / 10000; // m² para ha
}

/** Gera a demarcação externa da propriedade (polígono amarelo) que envolve os talhões cadastrados */
function generatePropertyBoundaryFromTalhoes(talhaoCoords: LatLng[][]): LatLng[] {
  const allPoints = talhaoCoords.flat();
  if (allPoints.length < 3) {
    return [];
  }

  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;

  allPoints.forEach((p) => {
    if (p.latitude < minLat) minLat = p.latitude;
    if (p.latitude > maxLat) maxLat = p.latitude;
    if (p.longitude < minLng) minLng = p.longitude;
    if (p.longitude > maxLng) maxLng = p.longitude;
  });

  const padLat = (maxLat - minLat) * 0.18 || 0.001;
  const padLng = (maxLng - minLng) * 0.18 || 0.001;

  // Cria um polígono suave que contorna a área externa dos talhões
  return [
    { latitude: minLat - padLat, longitude: minLng - padLng * 0.6 },
    { latitude: maxLat - padLat * 0.2, longitude: minLng - padLng },
    { latitude: maxLat + padLat, longitude: (minLng + maxLng) / 2 - padLng * 0.3 },
    { latitude: maxLat + padLat * 0.8, longitude: maxLng + padLng * 0.7 },
    { latitude: (minLat + maxLat) / 2, longitude: maxLng + padLng },
    { latitude: minLat - padLat * 0.8, longitude: maxLng + padLng * 0.4 },
    { latitude: minLat - padLat * 1.1, longitude: (minLng + maxLng) / 2 },
  ];
}

// ─── Componente Principal ───────────────────────────────────────────────────

export default function MapsLocationScreen() {
  const router = useRouter();
  const { selectedProperty } = useProperty();
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);

  // Estados dos dados REAIS
  const [dbUser, setDbUser] = useState<any>(null);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [allPes, setAllPes] = useState<PeWithTalhao[]>([]);
  const [loading, setLoading] = useState(false);
  const [customPropertyPolygon, setCustomPropertyPolygon] = useState<LatLng[]>([]);

  // Filtros rápidos
  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos");

  // Bottom Sheets: 'none' | 'areaInfo' | 'layerFilters' | 'layerMode' | 'datePicker'
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>("none");

  // Camadas selecionadas (Bottom Sheet 2)
  const [showPropertyBoundary, setShowPropertyBoundary] = useState(true);
  const [showTalhoes, setShowTalhoes] = useState(true);
  const [showTrees, setShowTrees] = useState(true);

  // Modo de visualização (Bottom Sheet 3: Satélite vs Mapa de Calor)
  const [viewMode, setViewMode] = useState<ViewMode>("satellite");

  // Filtro de data: null = mostrar tudo ("Hoje" aberto); string "YYYY-MM-DD" = filtrar por dia
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Tooltip de polígono (talhao ou propriedade)
  const [polygonTooltip, setPolygonTooltip] = useState<PolygonTooltip | null>(null);

  // ── Carregar Dados do Usuário ──────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      getUsuarioDetails(user.id)
        .then(setDbUser)
        .catch(() => {});
    }, [user?.id])
  );

  // ── Carregar Dados Georreferenciados Reais ──────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        if (!selectedProperty?.id) {
          setTalhoes([]);
          setAllPes([]);
          setCustomPropertyPolygon([]);
          return;
        }
        try {
          setLoading(true);

          // Carrega polígono customizado salvo para a propriedade se houver
          const storedBoundary = await AsyncStorage.getItem(
            `property_boundary_${selectedProperty.id}`
          );
          if (storedBoundary && active) {
            setCustomPropertyPolygon(parsePolygon(storedBoundary));
          } else if (active) {
            setCustomPropertyPolygon([]);
          }

          const dbTalhoes = await getTalhoesByProperty(selectedProperty.id);
          if (!active) return;
          setTalhoes(dbTalhoes);

          const pesResult: PeWithTalhao[] = [];
          for (const t of dbTalhoes) {
            const pts = await getPesByTalhao(t.id);
            pts.forEach((p) => pesResult.push({ ...p, talhaoId: t.id }));
          }
          if (active) setAllPes(pesResult);
        } catch (err) {
          console.error("Erro ao carregar mapa:", err);
        } finally {
          if (active) setLoading(false);
        }
      }

      void load();
      return () => {
        active = false;
      };
    }, [selectedProperty?.id])
  );

  // ── Coordenadas dos Talhões & Propriedade Reais ────────────────────────────
  const talhaoPolygonList = useMemo(() => {
    return talhoes
      .map((t) => ({
        id: t.id,
        name: t.name,
        coords: parsePolygon(t.coordenadasPoligono),
      }))
      .filter((t) => t.coords.length >= 3);
  }, [talhoes]);

  const propertyCenter: LatLng = useMemo(() => {
    if (selectedProperty?.latitude && selectedProperty?.longitude) {
      return {
        latitude: selectedProperty.latitude,
        longitude: selectedProperty.longitude,
      };
    }
    const allCoords = talhaoPolygonList.map((t) => t.coords).flat();
    const c = getCentroid(allCoords);
    return c ?? { latitude: -24.689, longitude: -47.851 };
  }, [selectedProperty, talhaoPolygonList]);

  // Polígono de delimitação externa (amarelo) - Somente a partir de dados reais cadastrados
  const propertyBoundaryCoords = useMemo(() => {
    if (customPropertyPolygon.length >= 3) {
      return customPropertyPolygon;
    }
    if (talhaoPolygonList.length > 0) {
      return generatePropertyBoundaryFromTalhoes(
        talhaoPolygonList.map((t) => t.coords)
      );
    }
    return [];
  }, [customPropertyPolygon, talhaoPolygonList]);

  // Cálculo da área total em hectares dos talhões reais cadastrados
  const totalHectares = useMemo(() => {
    let ha = 0;
    talhaoPolygonList.forEach((t) => {
      ha += calculateHectares(t.coords);
    });
    if (ha > 0) return ha.toFixed(2).replace(".", ",");
    return "0,00";
  }, [talhaoPolygonList]);

  // ── Pés com filtro aplicado (DADOS REAIS + filtro de data) ──────────────
  const filteredPes = useMemo(() => {
    return allPes.filter((pe) => {
      if (!pe.latitude || !pe.longitude) return false;

      // Filtro por data: se selectedDateStr definido, só mostra árvores
      // atualizadas/criadas naquele dia
      if (selectedDateStr) {
        const dateToCheck = pe.updatedAt || pe.createdAt;
        if (!dateToCheck) return false;
        const peDay = dateToCheck.slice(0, 10); // "YYYY-MM-DD"
        if (peDay !== selectedDateStr) return false;
      }

      if (activeFilter === "todos") return true;
      if (activeFilter === "manganes") return Boolean(pe.deficienciaManganes);
      if (activeFilter === "tratado") return pe.situacao === "Tratado";
      if (activeFilter === "naoTratado") return pe.situacao === "Não-Tratado";
      return true;
    });
  }, [allPes, activeFilter, selectedDateStr]);

  // Helper: formata data selecionada para exibição
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDateStr) return null;
    const d = new Date(selectedDateStr + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }, [selectedDateStr]);

  // Gera lista de datas únicas com análises (baseado nos pe.updatedAt)
  const availableDates = useMemo(() => {
    const datesSet = new Set<string>();
    allPes.forEach((pe) => {
      const d = pe.updatedAt || pe.createdAt;
      if (d) datesSet.add(d.slice(0, 10));
    });
    return Array.from(datesSet).sort().reverse();
  }, [allPes]);

  // Cor do Marcador de Árvore (Amarelo = Manganês, Verde = Tratado/Saudável, Vermelho = Não Tratado, Cinza = Sem info)
  const getPeColor = (pe: PeWithTalhao) => {
    if (pe.deficienciaManganes) return "#EAB308"; // Amarelo (Manganês)
    if (pe.situacao === "Tratado") return "#16A34A"; // Verde (Tratado / Saudável)
    if (pe.situacao === "Não-Tratado") return "#EF4444"; // Vermelho (Não-Tratado)
    return "#64748B"; // Cinza (Sem informação)
  };

  const filterOptions: { key: FilterKey; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "manganes", label: "Manganês" },
    { key: "tratado", label: "Tratado" },
    { key: "naoTratado", label: "Não Tratado" },
  ];

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* ── MAPA DO GOOGLE (FULL SCREEN) ─────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        mapType="satellite"
        initialRegion={{
          latitude: propertyCenter.latitude,
          longitude: propertyCenter.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
      >
        {/* 1. Demarcação da Propriedade (Polígono Amarelo) - com onPress para tooltip */}
        {showPropertyBoundary && propertyBoundaryCoords.length >= 3 && (
          <Polygon
            coordinates={propertyBoundaryCoords}
            strokeColor="#F59E0B"
            strokeWidth={3}
            fillColor="rgba(245, 158, 11, 0.06)"
            tappable
            onPress={() => {
              const center = getCentroid(propertyBoundaryCoords);
              if (center) {
                setPolygonTooltip({
                  name: selectedProperty?.name ?? "Propriedade",
                  type: "property",
                  coordinate: center,
                });
              }
            }}
          />
        )}

        {/* 2. Talhões (Polígonos Azuis) - com onPress para tooltip */}
        {showTalhoes &&
          talhaoPolygonList.map((t) => (
            <Polygon
              key={`talhao-poly-${t.id}`}
              coordinates={t.coords}
              strokeColor="#0EA5E9"
              strokeWidth={2.5}
              fillColor="rgba(14, 165, 233, 0.16)"
              tappable
              onPress={() => {
                const center = getCentroid(t.coords);
                if (center) {
                  setPolygonTooltip({
                    name: t.name,
                    type: "talhao",
                    coordinate: center,
                  });
                }
              }}
            />
          ))}

        {/* 3. Mapa de Calor Aprimorado (Áreas maiores em casos afetados e verde em saudáveis) */}
        {viewMode === "heat" &&
          filteredPes.map((p) => {
            if (!p.latitude || !p.longitude) return null;
            const isManganes = Boolean(p.deficienciaManganes);
            const isSaudavel = p.situacao === "Tratado" && !isManganes;

            if (isManganes) {
              // Mancha de calor expandida para Manganês (núcleo vermelho intenso, halo laranja e borda amarela difusa)
              return (
                <React.Fragment key={`heat-aff-${p.id}`}>
                  <Circle
                    center={{ latitude: p.latitude, longitude: p.longitude }}
                    radius={80}
                    fillColor="rgba(234, 179, 8, 0.25)"
                    strokeColor="transparent"
                  />
                  <Circle
                    center={{ latitude: p.latitude, longitude: p.longitude }}
                    radius={50}
                    fillColor="rgba(249, 115, 22, 0.40)"
                    strokeColor="transparent"
                  />
                  <Circle
                    center={{ latitude: p.latitude, longitude: p.longitude }}
                    radius={24}
                    fillColor="rgba(239, 68, 68, 0.65)"
                    strokeColor="transparent"
                  />
                </React.Fragment>
              );
            }

            if (isSaudavel) {
              // Mancha verde para árvores saudáveis / tratadas
              return (
                <React.Fragment key={`heat-hlth-${p.id}`}>
                  <Circle
                    center={{ latitude: p.latitude, longitude: p.longitude }}
                    radius={55}
                    fillColor="rgba(74, 222, 128, 0.28)"
                    strokeColor="transparent"
                  />
                  <Circle
                    center={{ latitude: p.latitude, longitude: p.longitude }}
                    radius={24}
                    fillColor="rgba(34, 197, 94, 0.55)"
                    strokeColor="transparent"
                  />
                </React.Fragment>
              );
            }

            return null;
          })}

        {/* 4. Árvores de Cultivo Reais (Pins Coloridos) */}
        {showTrees &&
          filteredPes.map((pe) => {
            const color = getPeColor(pe);
            return (
              <Marker
                key={`marker-${pe.id}`}
                coordinate={{ latitude: pe.latitude!, longitude: pe.longitude! }}
                anchor={{ x: 0.5, y: 1.0 }}
                title={pe.nome}
                description={
                  pe.deficienciaManganes
                    ? "Deficiência de Manganês"
                    : `Situação: ${pe.situacao}`
                }
              >
                <View style={styles.pinWrapper}>
                  <View style={[styles.pinDrop, { backgroundColor: color }]}>
                    <View style={styles.pinDot} />
                  </View>
                  <View style={[styles.pinTail, { borderTopColor: color }]} />
                </View>
              </Marker>
            );
          })}
      </MapView>

      {/* ── OVERLAY SUPERIOR ────────────────────────────────────────────── */}
      <SafeAreaView style={styles.topOverlay} edges={["top"]}>
        {/* Card do Usuário */}
        <View style={styles.headerCard}>
          <TouchableOpacity
            style={styles.headerProfileRow}
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/Settings/profile-new")}
          >
            {dbUser?.fotoUrl ? (
              <Image source={{ uri: dbUser.fotoUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
            )}
            <View style={styles.headerUserInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {dbUser?.nome ?? user?.email?.split("@")[0] ?? "Usuário"}
              </Text>
              <View style={styles.headerPropertyRow}>
                <Ionicons name="home-outline" size={13} color="#6B7280" />
                <Text style={styles.headerProperty} numberOfLines={1}>
                  {selectedProperty?.name ?? "Nenhuma propriedade selecionada"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push("/(tabs)/Settings/settings-all")}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={22} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Linha de Data e Calendário */}
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.datePillLeft}
            onPress={() => setActiveSheet(activeSheet === "datePicker" ? "none" : "datePicker")}
            activeOpacity={0.8}
          >
            <Text style={styles.datePillLabel}>
              <Text style={styles.dateBold}>Data: </Text>
              {formattedSelectedDate ??
                new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
            </Text>
            <Ionicons name="chevron-down" size={16} color={selectedDateStr ? "#16A34A" : "#334155"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.datePillRight,
              !selectedDateStr && styles.datePillRightActive,
            ]}
            onPress={() => {
              setSelectedDateStr(null);
              setActiveSheet("none");
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={!selectedDateStr ? "#16A34A" : "#64748B"}
            />
            <Text
              style={[
                styles.dateRightText,
                !selectedDateStr && styles.dateRightTextActive,
              ]}
            >
              Hoje
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtros Rápidos (Chips) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(opt.key)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* Tooltip de Polígono */}
      {polygonTooltip && (
        <View style={styles.polygonTooltipWrapper} pointerEvents="none">
          <View
            style={[
              styles.polygonTooltipCard,
              polygonTooltip.type === "property"
                ? styles.polygonTooltipProperty
                : styles.polygonTooltipTalhao,
            ]}
          >
            <Ionicons
              name={polygonTooltip.type === "property" ? "home" : "grid-outline"}
              size={14}
              color={polygonTooltip.type === "property" ? "#F59E0B" : "#0EA5E9"}
            />
            <Text style={styles.polygonTooltipText}>{polygonTooltip.name}</Text>
          </View>
        </View>
      )}

      {/* Dismiss tooltip ao tocar no mapa (overlay transparente) */}
      {polygonTooltip && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setPolygonTooltip(null)}
          pointerEvents="box-only"
        />
      )}

      {/* ── BOTÕES FLUTUANTES (LADO DIREITO) ────────────────────────────── */}
      <View style={styles.fabColumn}>
        {/* Botão 1: Informações da Área */}
        <TouchableOpacity
          style={styles.fabWhite}
          onPress={() => setActiveSheet(activeSheet === "areaInfo" ? "none" : "areaInfo")}
          activeOpacity={0.85}
        >
          <Ionicons name="location-sharp" size={24} color="#16A34A" />
        </TouchableOpacity>

        {/* Botão 2: Modos de Mapa (Satélite vs Calor) */}
        <TouchableOpacity
          style={styles.fabWhite}
          onPress={() => setActiveSheet(activeSheet === "layerMode" ? "none" : "layerMode")}
          activeOpacity={0.85}
        >
          <Ionicons
            name="layers"
            size={24}
            color={viewMode === "heat" ? "#EA580C" : "#16A34A"}
          />
        </TouchableOpacity>

        {/* Botão 3: Filtros de Camadas e Legenda */}
        <TouchableOpacity
          style={styles.fabGreen}
          onPress={() =>
            setActiveSheet(activeSheet === "layerFilters" ? "none" : "layerFilters")
          }
          activeOpacity={0.85}
        >
          <Ionicons name="grid" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── BOTTOM SHEETS (PAINÉIS INFERIORES) ──────────────────────────── */}

      {/* 1. Bottom Sheet: Informações da Área */}
      {activeSheet === "areaInfo" && (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetTitleGroup}>
                <Ionicons name="location-sharp" size={20} color="#16A34A" />
                <Text style={styles.sheetTitle}>Informações da Área</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveSheet("none")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>
                {selectedProperty?.name ?? "Não cadastrado"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Área Cadastrada</Text>
              <Text style={styles.infoValue}>{totalHectares} ha</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Município/UF</Text>
              <Text style={styles.infoValue}>
                {selectedProperty?.cidade
                  ? `${selectedProperty.cidade}/${selectedProperty?.regiao ?? "SP"}`
                  : "Não informado"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Talhões Cadastrados</Text>
              <Text style={styles.infoValue}>{talhoes.length}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Árvores Mapeadas</Text>
              <Text style={styles.infoValue}>
                {allPes.filter((p) => p.latitude && p.longitude).length}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 2. Bottom Sheet: Filtros de Camadas e Legenda (SEM MENÇÃO A COBRE) */}
      {activeSheet === "layerFilters" && (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetTitleGroup}>
                <Ionicons name="grid" size={20} color="#16A34A" />
                <Text style={styles.sheetTitle}>Camadas do Mapa</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveSheet("none")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Checkbox 1: Demarcação da Propriedade */}
            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setShowPropertyBoundary((prev) => !prev)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  showPropertyBoundary && styles.checkboxBoxChecked,
                ]}
              >
                {showPropertyBoundary && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Demarcação da propriedade</Text>
            </TouchableOpacity>

            {/* Checkbox 2: Talhões */}
            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setShowTalhoes((prev) => !prev)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  showTalhoes && styles.checkboxBoxChecked,
                ]}
              >
                {showTalhoes && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Talhões</Text>
            </TouchableOpacity>

            {/* Checkbox 3: Árvores de cultivo */}
            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setShowTrees((prev) => !prev)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  showTrees && styles.checkboxBoxChecked,
                ]}
              >
                {showTrees && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Árvores de cultivo</Text>
            </TouchableOpacity>

            {/* Legenda Atualizada: Apenas Manganês, Tratado/Saudável e Sem informação */}
            <View style={styles.legendRow}>
              <Text style={styles.legendTitle}>Legenda:</Text>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#EAB308" }]} />
                <Text style={styles.legendText}>Manganês</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#16A34A" }]} />
                <Text style={styles.legendText}>Tratado / Saudável</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#EF4444" }]} />
                <Text style={styles.legendText}>Não Tratado</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#64748B" }]} />
                <Text style={styles.legendText}>Sem info</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 3. Bottom Sheet: Modos do Mapa (Satélite vs Calor) */}
      {activeSheet === "layerMode" && (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetTitleGroup}>
                <Ionicons name="layers" size={20} color="#16A34A" />
                <Text style={styles.sheetTitle}>Modos de Visualização</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveSheet("none")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Card: Mapa de Satélite */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                viewMode === "satellite" && styles.modeCardActive,
              ]}
              onPress={() => {
                setViewMode("satellite");
                setActiveSheet("none");
              }}
              activeOpacity={0.8}
            >
              <View style={styles.modeIconCircle}>
                <Ionicons name="earth" size={22} color="#16A34A" />
              </View>
              <View style={styles.modeTextGroup}>
                <Text style={styles.modeTitle}>Mapa de Satélite</Text>
                <Text style={styles.modeSubtitle}>
                  Imagem orbital de alta resolução da fazenda
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card: Mapa de Calor */}
            <TouchableOpacity
              style={[
                styles.modeCard,
                viewMode === "heat" && styles.modeCardActive,
              ]}
              onPress={() => {
                setViewMode("heat");
                setActiveSheet("none");
              }}
              activeOpacity={0.8}
            >
              <View style={styles.modeIconCircle}>
                <Ionicons name="flame" size={22} color="#EA580C" />
              </View>
              <View style={styles.modeTextGroup}>
                <Text style={styles.modeTitle}>Mapa de Calor</Text>
                <Text style={styles.modeSubtitle}>
                  Áreas térmicas: vermelho/amarelo para Manganês e verde para saudável
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Sheet: Seletor de Data */}
      {activeSheet === "datePicker" && (
        <View style={styles.bottomSheetContainer}>
          <View style={[styles.bottomSheetCard, { maxHeight: 360 }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetTitleGroup}>
                <Ionicons name="calendar" size={20} color="#16A34A" />
                <Text style={styles.sheetTitle}>Selecionar Data</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveSheet("none")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Opção: Ver Todas */}
            <TouchableOpacity
              style={[
                styles.dateOptionRow,
                !selectedDateStr && styles.dateOptionRowActive,
              ]}
              onPress={() => {
                setSelectedDateStr(null);
                setActiveSheet("none");
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="earth-outline"
                size={18}
                color={!selectedDateStr ? "#16A34A" : "#64748B"}
              />
              <Text
                style={[
                  styles.dateOptionText,
                  !selectedDateStr && styles.dateOptionTextActive,
                ]}
              >
                Todas as análises
              </Text>
              {!selectedDateStr && (
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              )}
            </TouchableOpacity>

            {availableDates.length === 0 ? (
              <Text style={styles.dateEmptyText}>
                Nenhuma data de análise encontrada.
              </Text>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 200 }}
              >
                {availableDates.map((d) => {
                  const isActive = selectedDateStr === d;
                  const displayDate = new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.dateOptionRow,
                        isActive && styles.dateOptionRowActive,
                      ]}
                      onPress={() => {
                        setSelectedDateStr(d);
                        setActiveSheet("none");
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={isActive ? "#16A34A" : "#64748B"}
                      />
                      <Text
                        style={[
                          styles.dateOptionText,
                          isActive && styles.dateOptionTextActive,
                        ]}
                      >
                        {displayDate}
                      </Text>
                      {isActive && (
                        <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#16A34A" />
        </View>
      )}

      {/* ── BARRA DE ABAS INFERIOR (TAB BAR) ────────────────────────────── */}
      <View style={styles.tabBarFixed}>
        <TabBar />
      </View>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },

  // Overlay superior (Header e Filtros)
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },

  // Card do Usuário
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 10,
  },
  headerProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerUserInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerPropertyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  headerProperty: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  settingsBtn: {
    padding: 6,
  },

  // Linha de Data & Calendário
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  datePillLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  datePillLabel: {
    fontSize: 12,
    color: "#334155",
  },
  dateBold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  datePillRight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  datePillRightActive: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#16A34A",
  },
  dateRightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  dateRightTextActive: {
    color: "#16A34A",
    fontWeight: "700",
  },

  // Seletor de data (Bottom Sheet)
  dateOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  dateOptionRowActive: {
    backgroundColor: "#F0FDF4",
  },
  dateOptionText: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  dateOptionTextActive: {
    color: "#16A34A",
    fontWeight: "700",
  },
  dateEmptyText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 20,
  },

  // Tooltip de polígono flutuante
  polygonTooltipWrapper: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 25,
    paddingHorizontal: 20,
  },
  polygonTooltipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  polygonTooltipProperty: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1.5,
    borderColor: "#F59E0B",
  },
  polygonTooltipTalhao: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1.5,
    borderColor: "#0EA5E9",
  },
  polygonTooltipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Filtros rápidos
  filterScroll: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: "#6BC24A",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },

  // Coluna de FABs flutuantes à direita
  fabColumn: {
    position: "absolute",
    right: 16,
    top: "44%",
    zIndex: 10,
    gap: 12,
    alignItems: "center",
  },
  fabWhite: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },
  fabGreen: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#6BC24A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  // Marcadores Customizados (Pin estilo gota)
  pinWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 30,
  },
  pinDrop: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pinDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FFFFFF",
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -2,
  },

  // Painéis Inferiores (Bottom Sheets)
  bottomSheetContainer: {
    position: "absolute",
    bottom: 64,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 0,
  },
  bottomSheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetHandle: {
    width: 46,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 12,
  },

  // Dados da Área (Sheet 1)
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Checkboxes de Camadas (Sheet 2)
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#F59E0B",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#F59E0B",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexWrap: "wrap",
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },

  // Modos de Camada (Sheet 3)
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  modeCardActive: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  modeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modeTextGroup: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  modeSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  loadingBox: {
    position: "absolute",
    top: 130,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 8,
    zIndex: 15,
  },

  tabBarFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
});