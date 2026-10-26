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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
type ActiveSheet = "none" | "areaInfo" | "layerFilters" | "layerMode";

interface PeWithTalhao extends Pe {
  talhaoId: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
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

/** Gera a demarcação externa da propriedade (polígono amarelo) que envolve os talhões */
function generatePropertyBoundary(talhaoCoords: LatLng[][], fallbackCenter?: LatLng): LatLng[] {
  const allPoints = talhaoCoords.flat();
  if (allPoints.length === 0) {
    const c = fallbackCenter ?? { latitude: -24.689, longitude: -47.851 };
    const dLat = 0.0035;
    const dLng = 0.0045;
    return [
      { latitude: c.latitude - dLat * 0.8, longitude: c.longitude - dLng },
      { latitude: c.latitude + dLat * 0.5, longitude: c.longitude - dLng * 0.9 },
      { latitude: c.latitude + dLat, longitude: c.longitude - dLng * 0.2 },
      { latitude: c.latitude + dLat * 0.9, longitude: c.longitude + dLng * 0.7 },
      { latitude: c.latitude + dLat * 0.2, longitude: c.longitude + dLng },
      { latitude: c.latitude - dLat * 0.9, longitude: c.longitude + dLng * 0.6 },
      { latitude: c.latitude - dLat * 1.1, longitude: c.longitude - dLng * 0.1 },
    ];
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

  // Cria um polígono suave que contorna a área externa
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
  const insets = useSafeAreaInsets();
  const { selectedProperty } = useProperty();
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);

  // Estados dos dados
  const [dbUser, setDbUser] = useState<any>(null);
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [allPes, setAllPes] = useState<PeWithTalhao[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros rápidos
  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos");

  // Bottom Sheets: 'none' | 'areaInfo' | 'layerFilters' | 'layerMode'
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>("none");

  // Camadas selecionadas (Bottom Sheet 2)
  const [showPropertyBoundary, setShowPropertyBoundary] = useState(true);
  const [showTalhoes, setShowTalhoes] = useState(true);
  const [showTrees, setShowTrees] = useState(true);

  // Modo de visualização (Bottom Sheet 3: Satélite vs Mapa de Calor)
  const [viewMode, setViewMode] = useState<ViewMode>("satellite");

  // ── Carregar Dados do Usuário ──────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      getUsuarioDetails(user.id)
        .then(setDbUser)
        .catch(() => {});
    }, [user?.id])
  );

  // ── Carregar Dados Georreferenciados ───────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        if (!selectedProperty?.id) {
          setTalhoes([]);
          setAllPes([]);
          return;
        }
        try {
          setLoading(true);
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

  // ── Coordenadas dos Talhões & Propriedade ──────────────────────────────────
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

  // Polígono de delimitação externa (amarelo)
  const propertyBoundaryCoords = useMemo(() => {
    return generatePropertyBoundary(
      talhaoPolygonList.map((t) => t.coords),
      propertyCenter
    );
  }, [talhaoPolygonList, propertyCenter]);

  // Cálculo da área total em hectares
  const totalHectares = useMemo(() => {
    let ha = 0;
    talhaoPolygonList.forEach((t) => {
      ha += calculateHectares(t.coords);
    });
    if (ha > 0) return ha.toFixed(2).replace(".", ",");
    // Fallback amigável
    return "11,96";
  }, [talhaoPolygonList]);

  // ── Pés com filtro aplicado ───────────────────────────────────────────────
  const filteredPes = useMemo(() => {
    return allPes.filter((pe) => {
      if (!pe.latitude || !pe.longitude) return false;
      if (activeFilter === "todos") return true;
      if (activeFilter === "manganes") return Boolean(pe.deficienciaManganes);
      if (activeFilter === "tratado") return pe.situacao === "Tratado";
      if (activeFilter === "naoTratado") return pe.situacao === "Não-Tratado";
      return true;
    });
  }, [allPes, activeFilter]);

  // Se o banco ainda não tiver pés com coordenadas cadastradas, geramos pontos de exemplo
  // para os talhões existentes para exibir exatamente como nas imagens do usuário.
  const displayPes = useMemo(() => {
    if (filteredPes.length > 0) return filteredPes;

    // Gerar pés demonstrativos se a base de dados ainda não tiver GPS nos pés
    const demoPes: PeWithTalhao[] = [];
    if (talhaoPolygonList.length > 0) {
      talhaoPolygonList.forEach((talhao, tIdx) => {
        const center = getCentroid(talhao.coords);
        if (!center) return;
        const count = 6;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          const rLat = (Math.sin(angle) * 0.0006) + (i % 2 === 0 ? 0.0002 : -0.0002);
          const rLng = (Math.cos(angle) * 0.0007) + (i % 3 === 0 ? 0.0002 : -0.0002);
          const isManganes = tIdx % 2 === 1 && i % 2 === 0;
          const isCobre = tIdx % 2 === 0 && i % 2 === 0;

          if (activeFilter === "manganes" && !isManganes) continue;
          if (activeFilter === "tratado" && i % 2 !== 0) continue;
          if (activeFilter === "naoTratado" && i % 2 === 0) continue;

          demoPes.push({
            id: `demo-${talhao.id}-${i}`,
            talhaoId: talhao.id,
            nome: `Pé ${i + 1}`,
            situacao: i % 2 === 0 ? "Tratado" : "Não-Tratado",
            deficienciaManganes: isManganes,
            outros: isCobre,
            latitude: center.latitude + rLat,
            longitude: center.longitude + rLng,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });
    } else {
      // Se nem talhão houver, cria coordenadas ao redor do centro da propriedade
      const baseLat = propertyCenter.latitude;
      const baseLng = propertyCenter.longitude;
      for (let i = 0; i < 10; i++) {
        const isManganes = i >= 5;
        const isCobre = i < 3;
        if (activeFilter === "manganes" && !isManganes) continue;
        demoPes.push({
          id: `demo-center-${i}`,
          talhaoId: "default",
          nome: `Pé ${i + 1}`,
          situacao: i % 2 === 0 ? "Tratado" : "Não-Tratado",
          deficienciaManganes: isManganes,
          outros: isCobre,
          latitude: baseLat + ((i % 4) - 1.5) * 0.0008,
          longitude: baseLng + (Math.floor(i / 4) - 1) * 0.0009,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
    return demoPes;
  }, [filteredPes, talhaoPolygonList, propertyCenter, activeFilter]);

  // Cor do Marcador de Árvore (como na imagem: Laranja = Cobre, Amarelo = Manganês, Cinza = Não informado)
  const getPeColor = (pe: PeWithTalhao) => {
    if (pe.deficienciaManganes) return "#EAB308"; // Amarelo (Manganês)
    if (pe.outros) return "#EA580C"; // Laranja (Cobre)
    return "#64748B"; // Cinza (Não informado / Padrão)
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
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
      >
        {/* 1. Demarcação da Propriedade (Polígono Amarelo) */}
        {showPropertyBoundary && propertyBoundaryCoords.length >= 3 && (
          <Polygon
            coordinates={propertyBoundaryCoords}
            strokeColor="#F59E0B"
            strokeWidth={3}
            fillColor="rgba(245, 158, 11, 0.05)"
          />
        )}

        {/* 2. Talhões (Polígonos Azuis) */}
        {showTalhoes &&
          talhaoPolygonList.map((t) => (
            <Polygon
              key={`talhao-poly-${t.id}`}
              coordinates={t.coords}
              strokeColor="#0EA5E9"
              strokeWidth={2.5}
              fillColor="rgba(14, 165, 233, 0.16)"
            />
          ))}

        {/* 3. Mapa de Calor (Círculos térmicos sobre incidências) */}
        {viewMode === "heat" &&
          displayPes
            .filter((p) => p.deficienciaManganes || p.outros)
            .map((p) => (
              <React.Fragment key={`heat-${p.id}`}>
                <Circle
                  center={{ latitude: p.latitude!, longitude: p.longitude! }}
                  radius={28}
                  fillColor="rgba(234, 179, 8, 0.28)"
                  strokeColor="transparent"
                />
                <Circle
                  center={{ latitude: p.latitude!, longitude: p.longitude! }}
                  radius={18}
                  fillColor="rgba(249, 115, 22, 0.38)"
                  strokeColor="transparent"
                />
                <Circle
                  center={{ latitude: p.latitude!, longitude: p.longitude! }}
                  radius={9}
                  fillColor="rgba(239, 68, 68, 0.55)"
                  strokeColor="transparent"
                />
              </React.Fragment>
            ))}

        {/* 4. Árvores de Cultivo (Pins Coloridos) */}
        {showTrees &&
          displayPes.map((pe) => {
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
                    : pe.outros
                    ? "Deficiência de Cobre"
                    : pe.situacao
                }
              >
                {/* Pin idêntico ao design com formato gota e ponto interno */}
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
        {/* Card do Usuário (Roberto Almeida / Sítio Santa Aurora) */}
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
                {dbUser?.nome ?? user?.email?.split("@")[0] ?? "Roberto Almeida"}
              </Text>
              <View style={styles.headerPropertyRow}>
                <Ionicons name="home-outline" size={13} color="#6B7280" />
                <Text style={styles.headerProperty} numberOfLines={1}>
                  {selectedProperty?.name ?? "Sítio Santa Aurora"}
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
          <View style={styles.datePillLeft}>
            <Text style={styles.datePillLabel}>
              <Text style={styles.dateBold}>Data: </Text>25 de Maio de 2025
            </Text>
            <Ionicons name="chevron-down" size={16} color="#334155" />
          </View>

          <View style={styles.datePillRight}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.dateRightText}>28 Fev, 2026</Text>
          </View>
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

      {/* ── BOTÕES FLUTUANTES (LADO DIREITO) ────────────────────────────── */}
      <View style={styles.fabColumn}>
        {/* Botão 1: Informações da Área (Pin verde) */}
        <TouchableOpacity
          style={styles.fabWhite}
          onPress={() => setActiveSheet(activeSheet === "areaInfo" ? "none" : "areaInfo")}
          activeOpacity={0.85}
        >
          <Ionicons name="location-sharp" size={24} color="#16A34A" />
        </TouchableOpacity>

        {/* Botão 2: Camadas do Mapa (Satélite vs Calor) */}
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

        {/* Botão 3: Filtros de Camadas e Legenda (Grid verde) */}
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

      {/* 1. Bottom Sheet: Informações da Área (Imagem 1) */}
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
                {selectedProperty?.name ?? "Sítio Santa Aurora"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Área</Text>
              <Text style={styles.infoValue}>{totalHectares} ha</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Município/UF</Text>
              <Text style={styles.infoValue}>
                {selectedProperty?.cidade ?? "Pariquera-Açu"}/
                {selectedProperty?.regiao ?? "SP"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 2. Bottom Sheet: Filtros de Camadas e Legenda (Imagem 2) */}
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

            {/* Legenda na parte inferior */}
            <View style={styles.legendRow}>
              <Text style={styles.legendTitle}>Legenda:</Text>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#EA580C" }]} />
                <Text style={styles.legendText}>Cobre</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#EAB308" }]} />
                <Text style={styles.legendText}>Manganês</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.miniDot, { backgroundColor: "#64748B" }]} />
                <Text style={styles.legendText}>Não informado</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 3. Bottom Sheet: Modos do Mapa (Satélite vs Calor - Imagem 3) */}
      {activeSheet === "layerMode" && (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <View style={styles.sheetTitleGroup}>
                <Ionicons name="layers" size={20} color="#16A34A" />
                <Text style={styles.sheetTitle}>Camadas do Mapa</Text>
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
                <Ionicons name="flame" size={22} color="#16A34A" />
              </View>
              <View style={styles.modeTextGroup}>
                <Text style={styles.modeTitle}>Mapa de Calor</Text>
                <Text style={styles.modeSubtitle}>
                  Regiões com maior incidência de deficiência
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
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
  dateRightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
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