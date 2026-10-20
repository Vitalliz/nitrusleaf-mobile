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

// Componentes reutilizáveis e layout
import { Button } from "@/components/ui/button";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";

import { DEFAULT_AVATAR } from "@/constants/profile";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import type { Pe } from "@/types/pe";
import {
  computePropertyDeficiencyStats,
  isPeAnalyzed,
} from "@/utils/peStats";

type TimePeriod = "6months" | "3months" | "1month";

function getLastMonths(n: number): string[] {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return monthNames[d.getMonth()];
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
  const [dbUser, setDbUser] = useState<any>(null);
  const [talhoes, setTalhoes] = useState<any[]>([]);
  const [allTrees, setAllTrees] = useState<Pe[]>([]);
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
            if (isActive) setAllTrees(treesList);
          } else {
            if (isActive) setAllTrees([]);
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

  const totalTrees = allTrees.length;
  const analyzedTrees = allTrees.filter(isPeAnalyzed).length;
  const notAnalyzedTrees = Math.max(0, totalTrees - analyzedTrees);
  const hasTrees = totalTrees > 0;
  const hasAnalyses = analyzedTrees > 0;

  const deficiencyStats = useMemo(
    () => computePropertyDeficiencyStats(allTrees),
    [allTrees]
  );

  const nutritionalPercentages = useMemo(() => {
    if (totalTrees === 0) return { manganes: 0, saudavel: 0, semInfo: 100 };

    const manganesTrees = deficiencyStats.manganes;
    const semInfoTrees = notAnalyzedTrees;
    const saudavelTrees = Math.max(0, analyzedTrees - manganesTrees - deficiencyStats.adversos);

    const manganesPct = Math.round((manganesTrees / totalTrees) * 100);
    const semInfoPct = Math.round((semInfoTrees / totalTrees) * 100);
    const saudavelPct = Math.max(0, 100 - manganesPct - semInfoPct);

    return {
      manganes: manganesPct,
      saudavel: saudavelPct,
      semInfo: semInfoPct,
    };
  }, [totalTrees, analyzedTrees, notAnalyzedTrees, deficiencyStats]);

  const evolutionChartData = useMemo(() => {
    const monthsCount = selectedPeriod === "6months" ? 6 : selectedPeriod === "3months" ? 3 : 1;
    const labels = getLastMonths(monthsCount);

    let hasDataForPeriod = false;

    const values = labels.map((monthLabel) => {
      const monthTrees = allTrees.filter((tree) => {
        if (!isPeAnalyzed(tree)) return false;
        const dateStr = tree.updatedAt || tree.createdAt;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const mLabel = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()];
        return mLabel === monthLabel;
      });

      if (monthTrees.length > 0) {
        hasDataForPeriod = true;
        const stats = computePropertyDeficiencyStats(monthTrees);
        return stats.manganesPct;
      }
      return 0;
    });

    return { labels, values, hasData: hasDataForPeriod };
  }, [allTrees, selectedPeriod]);

  // Exibe os primeiros 5 talhões cadastrados no banco
  const talhoesChartData = useMemo(() => {
    if (talhoes.length === 0) {
      return [];
    }

    return talhoes.slice(0, 5).map((t, index) => {
      const tTrees = allTrees.filter((tree) => tree.talhaoId === t.id);
      const manganesCount = tTrees.filter((tree) => tree.deficienciaManganes).length;
      const analyzedCount = tTrees.filter(isPeAnalyzed).length;
      const saudavelCount = Math.max(0, analyzedCount - manganesCount);

      return {
        id: t.id,
        name: t.name || `Talhão ${index + 1}`,
        saudavel: saudavelCount,
        manganes: manganesCount,
      };
    });
  }, [talhoes, allTrees]);

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
          userAvatar={dbUser?.avatarUrl || DEFAULT_AVATAR}
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
                  <View style={styles.chartContainer}>
                    {[50, 40, 30, 20, 10, 0].map((val) => (
                      <View key={val} style={styles.chartGridRow}>
                        <Text style={styles.chartYAxisText}>{val}</Text>
                        <View style={styles.chartGridLine} />
                      </View>
                    ))}

                    {/* Exibe a área laranja e os pontos APENAS se houver análises reais */}
                    {hasAnalyses && evolutionChartData.hasData && (
                      <View style={styles.chartAreaWrapper}>
                        <View style={styles.chartAreaFill} />
                        <View style={styles.pointsRow}>
                          {evolutionChartData.values.map((v, i) => (
                            <View
                              key={i}
                              style={[
                                styles.chartPoint,
                                { bottom: Math.min(100, Math.max(8, (v / 50) * 105)) },
                              ]}
                            />
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Eixo X com alinhamento horizontal compensando a coluna Y */}
                    <View style={styles.chartXAxisRow}>
                      {evolutionChartData.labels.map((m, i) => (
                        <Text key={i} style={styles.chartXAxisText}>{m}</Text>
                      ))}
                    </View>
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
                    {[20, 15, 10, 5, 0].map((val) => (
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
                                { height: item.saudavel > 0 ? Math.max(12, (item.saudavel / 20) * 85) : 4 },
                              ]}
                            />
                            <View
                              style={[
                                styles.barManganes,
                                { height: item.manganes > 0 ? Math.max(12, (item.manganes / 20) * 85) : 4 },
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