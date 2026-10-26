import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle as SvgCircle,
  Line as SvgLine,
  Text as SvgText,
  G,
  Rect as SvgRect,
} from "react-native-svg";

// Componentes reutilizáveis e layout
import { Button } from "@/components/ui/button";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";

import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { getRelatoriosByPes } from "@/repositories/relatorioRepository";
import type { Pe } from "@/types/pe";
import type { Relatorio } from "@/types/relatorio";
import {
  computePropertyDeficiencyStats,
  isPeAnalyzed,
} from "@/utils/peStats";

function isManganesRelatorio(r: Relatorio): boolean {
  if (r.deficienciaManganes) return true;
  if (r.observacoes) {
    const obs = r.observacoes.toLowerCase();
    if (obs.includes("classe: manganês") || obs.includes("classe: manganes") || obs.includes("manganes") || obs.includes("manganês")) {
      return true;
    }
  }
  return false;
}

function isSaudavelRelatorio(r: Relatorio): boolean {
  if (isManganesRelatorio(r)) return false;
  if (r.observacoes) {
    const obs = r.observacoes.toLowerCase();
    if (obs.includes("classe: saudável") || obs.includes("classe: saudavel") || obs.includes("saudavel") || obs.includes("saudável")) {
      return true;
    }
  }
  return !r.deficienciaManganes && !r.outros;
}

type TimePeriod = "6months" | "3months" | "1month";

function getPeriodCutoffs(period: TimePeriod): { label: string; cutoff: Date }[] {
  const now = new Date();
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  if (period === "1month") {
    const y = now.getFullYear();
    const m = now.getMonth();
    return [
      { label: "Sem 1", cutoff: new Date(y, m, 7, 23, 59, 59, 999) },
      { label: "Sem 2", cutoff: new Date(y, m, 14, 23, 59, 59, 999) },
      { label: "Sem 3", cutoff: new Date(y, m, 21, 23, 59, 59, 999) },
      { label: "Sem 4", cutoff: now },
    ];
  }

  const count = period === "3months" ? 3 : 6;
  return Array.from({ length: count }, (_, i) => {
    const offset = count - 1 - i;
    const cutoff =
      offset === 0
        ? now
        : new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59, 999);
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    return {
      label: monthNames[d.getMonth()],
      cutoff,
    };
  });
}

function getFormattedCurrentDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    selectedProperty,
    showPropertyPicker,
    canSwitchProperty,
    loading: propertyContextLoading,
  } = useProperty();

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("6months");
  const [chartWidth, setChartWidth] = useState(300);
  const [dbUser, setDbUser] = useState<any>(null);
  const [talhoes, setTalhoes] = useState<any[]>([]);
  const [allTrees, setAllTrees] = useState<Pe[]>([]);
  const [allRelatorios, setAllRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadUser() {
        if (!user?.id) return;
        try {
          const details = await getUsuarioDetails(user.id);
          if (isActive) setDbUser(details);
        } catch (err) {
          console.error("Erro ao carregar utilizador na home:", err);
        }
      }

      loadUser();

      return () => {
        isActive = false;
      };
    }, [user?.id])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPropertyData() {
        if (!selectedProperty?.id) {
          if (isActive) {
            setTalhoes([]);
            setAllTrees([]);
            setAllRelatorios([]);
            setLoading(false);
          }
          return;
        }

        try {
          if (isActive) setLoading(true);
          const dbTalhoes = await getTalhoesByProperty(selectedProperty.id);
          if (!isActive) return;

          setTalhoes(dbTalhoes);

          if (dbTalhoes.length > 0) {
            const treesList: Pe[] = [];
            for (const t of dbTalhoes) {
              const pts = await getPesByTalhao(t.id);
              treesList.push(...pts);
            }
            if (!isActive) return;
            setAllTrees(treesList);

            if (treesList.length > 0) {
              const peIds = treesList.map((t) => t.id);
              const rels = await getRelatoriosByPes(peIds);
              if (isActive) setAllRelatorios(rels);
            } else {
              if (isActive) setAllRelatorios([]);
            }
          } else {
            if (isActive) {
              setAllTrees([]);
              setAllRelatorios([]);
            }
          }
        } catch (err) {
          console.error("Erro ao carregar dados do painel:", err);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      loadPropertyData();

      return () => {
        isActive = false;
      };
    }, [selectedProperty?.id])
  );

  // Mapeia o diagnóstico mais recente de cada pé a partir dos relatórios do banco
  const treeLatestRelatorioMap = useMemo(() => {
    const map = new Map<string, Relatorio>();
    for (const r of allRelatorios) {
      if (r.peId) {
        const existing = map.get(r.peId);
        const existingDate = existing
          ? new Date(existing.dataAnalise || existing.createdAt).getTime()
          : 0;
        const currentDate = new Date(r.dataAnalise || r.createdAt).getTime();
        if (!existing || currentDate >= existingDate) {
          map.set(r.peId, r);
        }
      }
    }
    return map;
  }, [allRelatorios]);

  const isTreeManganes = useCallback(
    (tree: Pe): boolean => {
      const rel = treeLatestRelatorioMap.get(tree.id);
      if (rel) {
        return isManganesRelatorio(rel);
      }
      return Boolean(tree.deficienciaManganes) || tree.situacao === "Não-Tratado";
    },
    [treeLatestRelatorioMap]
  );

  const isTreeSaudavel = useCallback(
    (tree: Pe): boolean => {
      const rel = treeLatestRelatorioMap.get(tree.id);
      if (rel) {
        return isSaudavelRelatorio(rel);
      }
      return tree.situacao === "Tratado" && !tree.deficienciaManganes;
    },
    [treeLatestRelatorioMap]
  );

  const isTreeAnalyzed = useCallback(
    (tree: Pe): boolean => {
      return treeLatestRelatorioMap.has(tree.id) || isPeAnalyzed(tree);
    },
    [treeLatestRelatorioMap]
  );

  const totalTrees = allTrees.length;
  const analyzedTrees = allTrees.filter(isTreeAnalyzed).length;
  const notAnalyzedTrees = Math.max(0, totalTrees - analyzedTrees);
  const hasTrees = totalTrees > 0;
  const hasAnalyses = analyzedTrees > 0 || allRelatorios.length > 0;

  const nutritionalPercentages = useMemo(() => {
    if (totalTrees === 0) return { manganes: 0, saudavel: 0, semInfo: 100 };

    const manganesTrees = allTrees.filter(isTreeManganes).length;
    const saudavelTrees = allTrees.filter(isTreeSaudavel).length;
    const semInfoTrees = Math.max(0, totalTrees - manganesTrees - saudavelTrees);

    const manganesPct = Math.round((manganesTrees / totalTrees) * 100);
    const saudavelPct = Math.round((saudavelTrees / totalTrees) * 100);
    const semInfoPct = Math.max(0, 100 - manganesPct - saudavelPct);

    return {
      manganes: manganesPct,
      saudavel: saudavelPct,
      semInfo: semInfoPct,
    };
  }, [totalTrees, allTrees, isTreeManganes, isTreeSaudavel]);

  const evolutionChartData = useMemo(() => {
    const cutoffs = getPeriodCutoffs(selectedPeriod);
    const labels = cutoffs.map((c) => c.label);

    let hasDataForPeriod = false;

    const values = cutoffs.map(({ cutoff }) => {
      // 1. Relatórios / Diagnósticos registrados no banco até a data deste período
      const periodRelatorios = allRelatorios.filter((r) => {
        const dateStr = r.dataAnalise || r.createdAt;
        if (!dateStr) return true;
        return new Date(dateStr) <= cutoff;
      });

      if (periodRelatorios.length > 0) {
        hasDataForPeriod = true;
        const manganesCount = periodRelatorios.filter(isManganesRelatorio).length;
        // % de incidência de manganês entre as análises realizadas até a data
        return Math.round((manganesCount / periodRelatorios.length) * 100);
      }

      // 2. Fallback para árvores cadastradas se ainda não houver relatórios na data
      const periodTrees = allTrees.filter((tree) => {
        const dateStr = tree.createdAt || tree.updatedAt;
        if (!dateStr) return true;
        return new Date(dateStr) <= cutoff;
      });

      if (periodTrees.length > 0) {
        const analyzed = periodTrees.filter(isTreeAnalyzed);
        if (analyzed.length > 0) {
          hasDataForPeriod = true;
          const manganesCount = periodTrees.filter(isTreeManganes).length;
          return Math.round((manganesCount / analyzed.length) * 100);
        }
      }

      return 0;
    });

    return { labels, values, hasData: hasDataForPeriod };
  }, [allRelatorios, allTrees, selectedPeriod, isTreeAnalyzed, isTreeManganes]);

  // Exibe os primeiros 5 talhões cadastrados no banco
  const talhoesChartData = useMemo(() => {
    if (talhoes.length === 0) {
      return [];
    }

    return talhoes.slice(0, 5).map((t, index) => {
      const tTrees = allTrees.filter((tree) => tree.talhaoId === t.id);
      const manganesCount = tTrees.filter(isTreeManganes).length;
      const saudavelCount = tTrees.filter(isTreeSaudavel).length;

      return {
        id: t.id,
        name: t.name || `Talhão ${index + 1}`,
        saudavel: saudavelCount,
        manganes: manganesCount,
      };
    });
  }, [talhoes, allTrees, isTreeManganes, isTreeSaudavel]);

  const maxTalhaoTreeCount = useMemo(() => {
    if (talhoesChartData.length === 0) return 20;
    const maxVal = Math.max(
      ...talhoesChartData.map((d) => Math.max(d.saudavel, d.manganes))
    );
    return Math.max(20, Math.ceil(maxVal / 5) * 5);
  }, [talhoesChartData]);

  const handleVerDetalhes = useCallback(() => {
    router.push("/(tabs)/History/history");
  }, [router]);

  const handleEscanearPress = useCallback(() => {
    router.push("/(tabs)/AI/scan");
  }, [router]);

  const emptyStateConfig = useMemo(() => {
    if (talhoes.length === 0) {
      return {
        title: "Nenhum talhão cadastrado",
        subtitle: "Cadastre seu primeiro talhão para começar a organizar sua propriedade.",
        buttonTitle: "Cadastrar Talhão",
        icon: "add" as const,
        action: () => {
          router.push({
            pathname: "/(tabs)/History/add-talhao",
            params: {
              propertyId: selectedProperty?.id,
              propertyName: selectedProperty?.name,
            },
          });
        },
      };
    }

    return {
      title: "Nenhuma árvore cadastrada",
      subtitle: "Cadastre as árvores do seu talhão para visualizar as métricas e iniciar as análises foliares.",
      buttonTitle: "Cadastrar Árvore",
      icon: "add" as const,
      action: () => {
        router.push({
          pathname: "/(tabs)/History/add-tree",
          params: {
            talhaoId: talhoes[0]?.id,
            talhaoName: talhoes[0]?.name,
            propertyId: selectedProperty?.id,
          },
        });
      },
    };
  }, [talhoes, selectedProperty, router]);

  const coveragePercent = totalTrees > 0 ? Math.min(100, Math.round((analyzedTrees / totalTrees) * 100)) : 0;

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        <Header
          userName={
            propertyContextLoading
              ? "Carregando..."
              : dbUser?.fullName || user?.name || "Usuário"
          }
          userSubtitle={
            propertyContextLoading
              ? "Carregando..."
              : selectedProperty?.name || "Sem propriedade"
          }
          userAvatar={dbUser?.avatarUrl}
          subtitleIcon="location-outline"
          onPropertyPress={showPropertyPicker}
          showPropertyChevron={canSwitchProperty}
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
        />

        {loading || propertyContextLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              !hasTrees && styles.scrollContentEmpty,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Cabeçalho */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Análises Gerais</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color={Palette.textSecondary} />
                <Text style={styles.dateText}>{getFormattedCurrentDate()}</Text>
              </View>
            </View>

            {!hasTrees ? (
              <View style={styles.emptyStateContainer}>
                <Image
                  source={require("@/assets/images/empty-state-geral.png")}
                  style={styles.emptyStateImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyStateTitle}>{emptyStateConfig.title}</Text>
                <Text style={styles.emptyStateSubtitle}>{emptyStateConfig.subtitle}</Text>
                <Button
                  title={emptyStateConfig.buttonTitle}
                  variant="primary"
                  size="full"
                  icon={emptyStateConfig.icon}
                  onPress={emptyStateConfig.action}
                />
              </View>
            ) : (
              <View style={styles.cardsContainer}>
                {/* CARD 1: Status Nutricional */}
                <View style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>Status Nutricional da Propriedade</Text>
                    <Ionicons name="information-circle-outline" size={18} color={Palette.textPrimary} />
                  </View>

                  <View style={styles.nutritionalRow}>
                    <View style={styles.nutritionalCol}>
                      <Text style={styles.nutritionalValue}>{nutritionalPercentages.manganes}%</Text>
                      <View style={[styles.badge, styles.badgeManganes]}>
                        <Text style={styles.badgeTextManganes}>Manganês</Text>
                      </View>
                    </View>

                    <View style={styles.colDivider} />

                    <View style={styles.nutritionalCol}>
                      <Text style={styles.nutritionalValue}>{nutritionalPercentages.saudavel}%</Text>
                      <View style={[styles.badge, styles.badgeSaudavel]}>
                        <Text style={styles.badgeTextSaudavel}>Saudável</Text>
                      </View>
                    </View>

                    <View style={styles.colDivider} />

                    <View style={styles.nutritionalCol}>
                      <Text style={styles.nutritionalValue}>{nutritionalPercentages.semInfo}%</Text>
                      <View style={[styles.badge, styles.badgeSemInfo]}>
                        <Text style={styles.badgeTextSemInfo}>S/ Info.</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* CARD 2: Cobertura das análises */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Cobertura das análises</Text>

                  <View style={styles.coverageValueRow}>
                    <Text style={styles.coverageValueBig}>{analyzedTrees}</Text>
                    <Text style={styles.coverageValueTotal}>/{totalTrees} árvores analisadas</Text>
                  </View>

                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${coveragePercent}%` }]} />
                  </View>

                  <View style={styles.coverageFooterRow}>
                    <View style={styles.warningRow}>
                      <Ionicons name="warning" size={16} color={Palette.orangePrimary} />
                      <Text style={styles.warningText}>
                        {notAnalyzedTrees} árvores não analisadas
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.escanearButton}
                      activeOpacity={0.85}
                      onPress={handleEscanearPress}
                    >
                      <Text style={styles.escanearButtonText}>Escanear</Text>
                      <Ionicons name="camera-outline" size={16} color={Palette.white} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CARD 3: Evolução da deficiência de manganês (%) */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Evolução da deficiência de manganês (%)</Text>

                  {/* Chips de Período distribuídos uniformemente */}
                  <View style={styles.periodRow}>
                    <TouchableOpacity
                      style={[
                        styles.periodChip,
                        selectedPeriod === "6months" && styles.periodChipActive,
                      ]}
                      onPress={() => setSelectedPeriod("6months")}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.periodChipText,
                          selectedPeriod === "6months" && styles.periodChipTextActive,
                        ]}
                      >
                        Últimos 6 meses
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.periodChip,
                        selectedPeriod === "3months" && styles.periodChipActive,
                      ]}
                      onPress={() => setSelectedPeriod("3months")}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.periodChipText,
                          selectedPeriod === "3months" && styles.periodChipTextActive,
                        ]}
                      >
                        Últimos 3 meses
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.periodChip,
                        selectedPeriod === "1month" && styles.periodChipActive,
                      ]}
                      onPress={() => setSelectedPeriod("1month")}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.periodChipText,
                          selectedPeriod === "1month" && styles.periodChipTextActive,
                        ]}
                      >
                        Último mês
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Área do Gráfico */}
                  <View
                    style={styles.chartContainer}
                    onLayout={(e) => {
                      const w = e.nativeEvent.layout.width;
                      if (w > 0 && Math.abs(w - chartWidth) > 1) {
                        setChartWidth(w);
                      }
                    }}
                  >
                    {(() => {
                      const CHART_HEIGHT = 145;
                      const PADDING_LEFT = 28;
                      const PADDING_RIGHT = 14;
                      const PADDING_TOP = 14;
                      const PADDING_BOTTOM = 24;
                      const plotWidth = Math.max(10, chartWidth - PADDING_LEFT - PADDING_RIGHT);
                      const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

                      const maxVal = Math.max(...evolutionChartData.values, 0);
                      const yMax = maxVal <= 50 ? 50 : 100;
                      const ySteps = yMax === 50 ? [50, 40, 30, 20, 10, 0] : [100, 80, 60, 40, 20, 0];

                      const numPoints = evolutionChartData.values.length;
                      const points = evolutionChartData.values.map((v, i) => {
                        const x =
                          numPoints > 1
                            ? PADDING_LEFT + (i / (numPoints - 1)) * plotWidth
                            : PADDING_LEFT + plotWidth / 2;
                        const y =
                          PADDING_TOP + (1 - Math.min(yMax, Math.max(0, v)) / yMax) * plotHeight;
                        return { x, y, value: v, label: evolutionChartData.labels[i] };
                      });

                      const baseY = PADDING_TOP + plotHeight;
                      const linePath = points
                        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                        .join(" ");
                      const areaPath =
                        points.length > 0
                          ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baseY.toFixed(1)} L ${points[0].x.toFixed(1)} ${baseY.toFixed(1)} Z`
                          : "";

                      return (
                        <Svg width={chartWidth} height={CHART_HEIGHT}>
                          <Defs>
                            <SvgGradient id="evolutionAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <Stop offset="0%" stopColor={Palette.deficiencyManganese} stopOpacity="0.35" />
                              <Stop offset="100%" stopColor={Palette.deficiencyManganese} stopOpacity="0.02" />
                            </SvgGradient>
                          </Defs>

                          {/* Linhas de Grade e Eixo Y */}
                          {ySteps.map((step) => {
                            const y = PADDING_TOP + (1 - step / yMax) * plotHeight;
                            return (
                              <G key={`grid-${step}`}>
                                <SvgLine
                                  x1={PADDING_LEFT}
                                  y1={y}
                                  x2={chartWidth - PADDING_RIGHT}
                                  y2={y}
                                  stroke="#E5E7EB"
                                  strokeWidth={1}
                                />
                                <SvgText
                                  x={PADDING_LEFT - 6}
                                  y={y + 4}
                                  fontSize={11}
                                  fill={Palette.textSecondary}
                                  textAnchor="end"
                                  fontWeight="500"
                                >
                                  {step}
                                </SvgText>
                              </G>
                            );
                          })}

                          {/* Gráfico preenchido e curva */}
                          {hasTrees && points.length > 0 && (
                            <>
                              <Path d={areaPath} fill="url(#evolutionAreaGrad)" />
                              <Path
                                d={linePath}
                                fill="none"
                                stroke={Palette.deficiencyManganese}
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Pontos nas coordenadas */}
                              {points.map((p, i) => (
                                <G key={`pt-${i}`}>
                                  <SvgCircle
                                    cx={p.x}
                                    cy={p.y}
                                    r={5}
                                    fill="#FFFFFF"
                                    stroke={Palette.deficiencyManganese}
                                    strokeWidth={2}
                                  />
                                  <SvgCircle
                                    cx={p.x}
                                    cy={p.y}
                                    r={2.5}
                                    fill={Palette.deficiencyManganese}
                                  />
                                </G>
                              ))}

                              {/* Badge de destaque com o valor na medição atual */}
                              {points.length > 0 && (hasAnalyses || evolutionChartData.hasData) && (
                                <G>
                                  <SvgRect
                                    x={points[points.length - 1].x - 17}
                                    y={Math.max(2, points[points.length - 1].y - 20)}
                                    width={34}
                                    height={16}
                                    rx={8}
                                    fill={Palette.deficiencyManganese}
                                  />
                                  <SvgText
                                    x={points[points.length - 1].x}
                                    y={Math.max(2, points[points.length - 1].y - 20) + 11.5}
                                    fontSize={10}
                                    fill="#FFFFFF"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                  >
                                    {`${points[points.length - 1].value}%`}
                                  </SvgText>
                                </G>
                              )}
                            </>
                          )}

                          {/* Rótulos do Eixo X perfeitamente alinhados sob os pontos */}
                          {points.map((p, i) => (
                            <SvgText
                              key={`xlabel-${i}`}
                              x={p.x}
                              y={baseY + 16}
                              fontSize={11}
                              fill={Palette.textSecondary}
                              textAnchor="middle"
                              fontWeight="500"
                            >
                              {p.label}
                            </SvgText>
                          ))}
                        </Svg>
                      );
                    })()}
                  </View>

                  <TouchableOpacity
                    style={styles.verDetalhesButton}
                    activeOpacity={0.8}
                    onPress={handleVerDetalhes}
                  >
                    <Text style={styles.verDetalhesButtonText}>Ver detalhes</Text>
                  </TouchableOpacity>
                </View>

                {/* CARD 4: Deficiência por talhão */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Deficiência por talhão</Text>

                  <View style={styles.columnChartWrapper}>
                    {[
                      maxTalhaoTreeCount,
                      Math.round(maxTalhaoTreeCount * 0.75),
                      Math.round(maxTalhaoTreeCount * 0.5),
                      Math.round(maxTalhaoTreeCount * 0.25),
                      0,
                    ].map((val) => (
                      <View key={val} style={styles.chartGridRow}>
                        <Text style={styles.chartYAxisText}>{val}</Text>
                        <View style={styles.chartGridLine} />
                      </View>
                    ))}

                    <View style={styles.columnsContentRow}>
                      {talhoesChartData.map((item) => (
                        <View key={item.id} style={styles.talhaoGroupCol}>
                          <View style={styles.barsGroupRow}>
                            <View
                              style={[
                                styles.barSaudavel,
                                {
                                  height:
                                    item.saudavel > 0
                                      ? Math.max(12, (item.saudavel / maxTalhaoTreeCount) * 85)
                                      : 4,
                                },
                              ]}
                            />
                            <View
                              style={[
                                styles.barManganes,
                                {
                                  height:
                                    item.manganes > 0
                                      ? Math.max(12, (item.manganes / maxTalhaoTreeCount) * 85)
                                      : 4,
                                },
                              ]}
                            />
                          </View>
                          <Text style={styles.talhaoNameText} numberOfLines={1}>{item.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#A5D6A7' }]} />
                      <Text style={styles.legendText}>Saudável</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: Palette.deficiencyManganese }]} />
                      <Text style={styles.legendText}>Manganês</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },

  /* Cabeçalho */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },

  /* Cartões */
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 18,
  },
  card: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#EEF0F2",
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 12,
  },

  /* Card 1: Status Nutricional */
  nutritionalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  nutritionalCol: {
    flex: 1,
    alignItems: "center",
  },
  colDivider: {
    width: 1,
    height: 48,
    backgroundColor: Palette.surfaceGray,
  },
  nutritionalValue: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeManganes: {
    backgroundColor: Palette.deficiencyManganese,
  },
  badgeTextManganes: {
    color: Palette.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  badgeSaudavel: {
    backgroundColor: "#D1F2D0",
  },
  badgeTextSaudavel: {
    color: "#2D5016",
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
  },
  badgeSemInfo: {
    backgroundColor: Palette.borderDisabled,
  },
  badgeTextSemInfo: {
    color: Palette.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
  },

  /* Card 2: Cobertura */
  coverageValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 14,
  },
  coverageValueBig: {
    fontSize: 24,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  coverageValueTotal: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    marginLeft: 4,
  },
  progressBarTrack: {
    height: 8,
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Palette.primary,
    borderRadius: 4,
  },
  coverageFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  warningText: {
    fontSize: 12,
    color: Palette.orangePrimary,
    fontWeight: FontWeights.medium,
  },
  escanearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  escanearButtonText: {
    color: Palette.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },

  /* Card 3: Evolução */
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  periodChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  periodChipActive: {
    backgroundColor: Palette.borderDisabled,
  },
  periodChipText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  periodChipTextActive: {
    color: Palette.textPrimary,
    fontWeight: FontWeights.bold,
  },
  chartContainer: {
    position: "relative",
    height: 145,
    marginBottom: 18,
  },
  chartGridRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  chartYAxisText: {
    width: 24,
    fontSize: 12,
    color: Palette.textSecondary,
  },
  chartGridLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 6,
  },
  chartAreaWrapper: {
    position: "absolute",
    left: 30,
    right: 0,
    top: 6,
    bottom: 20,
    justifyContent: "flex-end",
  },
  chartAreaFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "75%",
    backgroundColor: `${Palette.deficiencyManganese}20`,
    borderTopWidth: 2,
    borderTopColor: Palette.deficiencyManganese,
  },
  pointsRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  chartPoint: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.deficiencyManganese,
    borderWidth: 1.5,
    borderColor: Palette.white,
  },
  chartXAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 30,
    marginTop: 4,
  },
  chartXAxisText: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: "center",
  },
  verDetalhesButton: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  verDetalhesButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Palette.primary,
  },

  /* Card 4: Deficiência por talhão */
  columnChartWrapper: {
    position: "relative",
    height: 135,
    marginBottom: 14,
  },
  columnsContentRow: {
    position: "absolute",
    left: 30,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  talhaoGroupCol: {
    flex: 1,
    maxWidth: 58,
    minWidth: 44,
    alignItems: "center",
  },
  barsGroupRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  barSaudavel: {
    width: 10,
    backgroundColor: "#A5D6A7",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barManganes: {
    width: 10,
    backgroundColor: Palette.deficiencyManganese,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  talhaoNameText: {
    fontSize: 12,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginTop: 6,
    textAlign: "center",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: FontWeights.medium,
    color: Palette.textPrimary,
  },

  /* Estado vazio */
  emptyStateContainer: {
    flex: 1,
    backgroundColor: Palette.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF0F2",
    marginVertical: 20,
  },
  emptyStateImage: {
    width: 220,
    height: 140,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: FontSizes.md + 1,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: FontSizes.base,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 290,
    marginBottom: 32,
  },
});