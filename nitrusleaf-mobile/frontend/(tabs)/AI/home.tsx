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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";

// Componentes da UI
import { Button } from "@/components/ui/button";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { CustomCard } from "@/components/cards/card";
import {
  EvolutionBarChart,
  EvolutionData,
  TimePeriod,
} from "@/components/charts/barchart";
import {
  GroupedColumnChart,
  GroupedColumnData,
} from "@/components/charts/columnchart";
import { CoverageCard } from "@/components/charts/coverage";
import { DonutChart } from "@/components/charts/donutchart";
import { NutritionalStatusCard } from "@/components/charts/nutricionalstatus";

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

function getLastMonths(n: number): string[] {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return monthNames[d.getMonth()];
  });
}

function getCurrentMonth(): string {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return monthNames[new Date().getMonth()];
}

function getMonthLabel(dateStr: string): string {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const d = new Date(dateStr);
  return monthNames[d.getMonth()];
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
          console.error("Erro ao carregar painel home:", err);
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
  const notAnalyzedTrees = totalTrees - analyzedTrees;
  const hasAnalyses = analyzedTrees > 0;

  const deficiencyStats = useMemo(
    () => computePropertyDeficiencyStats(allTrees),
    [allTrees]
  );

  const nutritionalData = useMemo(
    () => ({
      manganes: deficiencyStats.nutritionalManganesPct,
      cobre: deficiencyStats.nutritionalCobrePct,
    }),
    [deficiencyStats]
  );

  const coverageData = useMemo(() => {
    return { analyzed: analyzedTrees, total: totalTrees, notAnalyzed: notAnalyzedTrees };
  }, [analyzedTrees, totalTrees, notAnalyzedTrees]);

  const donutData = useMemo(() => {
    return [
      {
        name: "Cobre",
        percentage: deficiencyStats.cobrePct,
        value: deficiencyStats.cobre,
        color: "#E65723",
      },
      {
        name: "Manganês",
        percentage: deficiencyStats.manganesPct,
        value: deficiencyStats.manganes,
        color: "#FBBF24",
      },
      {
        name: "Adversos",
        percentage: deficiencyStats.adversosPct,
        value: deficiencyStats.adversos,
        color: "#9CA3AF",
      },
    ];
  }, [deficiencyStats]);

  const groupedColumnData: GroupedColumnData[] = useMemo(() => {
    return talhoes.map((t) => {
      const tTrees = allTrees.filter((tree) => tree.talhaoId === t.id);
      const cobre = tTrees.filter((tree) => tree.deficienciaCobre).length;
      const manganes = tTrees.filter((tree) => tree.deficienciaManganes).length;
      return {
        talhao: t.name,
        cobre,
        manganes,
      };
    });
  }, [talhoes, allTrees]);

  const evolutionData: Record<TimePeriod, EvolutionData[]> = useMemo(() => {
    const months6 = getLastMonths(6);
    const months3 = getLastMonths(3);
    const currentMonth = getCurrentMonth();

    const getEvolutionForPeriods = (periods: string[]) => {
      return periods.map((monthLabel) => {
        const monthTrees = allTrees.filter((tree) => {
          if (!isPeAnalyzed(tree)) return false;
          const dateStr = tree.updatedAt || tree.createdAt;
          if (!dateStr) return false;
          return getMonthLabel(dateStr) === monthLabel;
        });
        const stats = computePropertyDeficiencyStats(monthTrees);
        return {
          period: monthLabel,
          cobre: stats.nutritionalCobrePct,
          manganes: stats.nutritionalManganesPct,
        };
      });
    };

    return {
      "6months": getEvolutionForPeriods(months6),
      "3months": getEvolutionForPeriods(months3),
      "1month": getEvolutionForPeriods([currentMonth]),
    };
  }, [allTrees]);

  const handleDetailPress = useCallback(() => {
    router.push("/(tabs)/History/history");
  }, [router]);

  const handlePeriodChange = useCallback((period: TimePeriod) => setSelectedPeriod(period), []);
  const handleVerDetalhes = useCallback(() => {
    router.push("/(tabs)/History/history");
  }, [router]);

  const handleNutritionalPress = useCallback(() => {
    router.push("/(tabs)/History/history");
  }, [router]);

  // Configuração dinâmica do Empty State conforme o progresso do usuário
  const emptyStateConfig = useMemo(() => {
    // Etapa 1: Não há talhões cadastrados
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

    // Etapa 2: Há talhão, mas nenhuma árvore cadastrada
    if (allTrees.length === 0) {
      return {
        title: "Nenhuma árvore cadastrada",
        subtitle: "Cadastre as árvores do seu talhão para poder iniciar as análises foliares.",
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
    }

    // Etapa 3: Há árvores, mas nenhuma análise realizada ainda
    return {
      title: "Nenhuma Análise realizada ainda",
      subtitle: "Realize a primeira análise para visualizar os indicadores da sua propriedade.",
      buttonTitle: "Fazer Análise",
      icon: "scan-outline" as const,
      action: () => {
        router.push({
          pathname: "/(tabs)/History/tree-detail-screen",
          params: {
            treeId: allTrees[0]?.id,
            talhaoId: allTrees[0]?.talhaoId,
          },
        });
      },
    };
  }, [talhoes, allTrees, selectedProperty, router]);

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
              !hasAnalyses && styles.scrollContentEmpty,
            ]}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {/* Barra de título e data */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Análises Gerais</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={15} color="#888" />
                <Text style={styles.dateText}>{getFormattedCurrentDate()}</Text>
              </View>
            </View>

            {/* Empty State Dinâmico */}
            {!hasAnalyses ? (
              <View style={styles.emptyStateContainer}>
                <Image
                  source={require("@/assets/images/empty-state-geral.png")}
                  style={styles.emptyStateImage}
                  resizeMode="contain"
                />

                <Text style={styles.emptyStateTitle}>
                  {emptyStateConfig.title}
                </Text>

                <Text style={styles.emptyStateSubtitle}>
                  {emptyStateConfig.subtitle}
                </Text>

                <Button
                  title={emptyStateConfig.buttonTitle}
                  variant="primary"
                  size="full"
                  icon={emptyStateConfig.icon}
                  onPress={emptyStateConfig.action}
                />
              </View>
            ) : (
              <View style={styles.chartsContainer}>
                <NutritionalStatusCard
                  manganesPercentage={nutritionalData.manganes}
                  cobrePercentage={nutritionalData.cobre}
                  onPress={handleNutritionalPress}
                />

                <CoverageCard
                  analyzed={coverageData.analyzed}
                  total={coverageData.total}
                  notAnalyzed={coverageData.notAnalyzed}
                />

                <CustomCard variant="white-large">
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>
                      Ocorrências totais de deficiências em %
                    </Text>
                    <DonutChart
                      data={donutData}
                      size={100}
                      innerRadius={35}
                      centerText={`${coverageData.analyzed}/${coverageData.total}`}
                      showLabels={true}
                      onDetailPress={handleVerDetalhes}
                    />
                  </View>
                </CustomCard>

                <GroupedColumnChart
                  data={groupedColumnData}
                  height={180}
                />

                <EvolutionBarChart
                  data={evolutionData[selectedPeriod]}
                  onPeriodChange={handlePeriodChange}
                  onDetailPress={handleDetailPress}
                  height={200}
                />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#F8F9FA",
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
  emptyStateContainer: {
    flex: 1,
    backgroundColor: Palette.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF0F2",
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
  chartsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  cardContent: {
    padding: 16,
    width: "100%",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});