// app/HomeScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

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
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { DEFAULT_AVATAR } from "@/constants/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import type { Pe } from "@/types/pe";
import { isPeAnalyzed } from "@/utils/peStats";

// Gera os nomes dos últimos N meses a partir da data atual
function getLastMonths(n: number): string[] {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return monthNames[d.getMonth()];
  });
}

// Nome do mês atual abreviado
function getCurrentMonth(): string {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return monthNames[new Date().getMonth()];
}

function getMonthLabel(dateStr: string): string {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const d = new Date(dateStr);
  return monthNames[d.getMonth()];
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();
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

  useEffect(() => {
    async function loadUser() {
      if (!user?.id) return;
      try {
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);
      } catch (err) {
        console.error("Erro ao carregar usuário na home:", err);
      }
    }
    if (isFocused) void loadUser();
  }, [user?.id, isFocused]);

  useEffect(() => {
    async function loadPropertyData() {
      if (!selectedProperty?.id) {
        setTalhoes([]);
        setAllTrees([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const dbTalhoes = await getTalhoesByProperty(selectedProperty.id);
        setTalhoes(dbTalhoes);

        if (dbTalhoes.length > 0) {
          const treesList: Pe[] = [];
          for (const t of dbTalhoes) {
            const pts = await getPesByTalhao(t.id);
            treesList.push(...pts);
          }
          setAllTrees(treesList);
        } else {
          setAllTrees([]);
        }
      } catch (err) {
        console.error("Erro ao carregar painel home:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isFocused) void loadPropertyData();
  }, [selectedProperty?.id, isFocused]);

  const hasTalhoes = talhoes.length > 0;

  // Estatísticas calculadas
  const totalTrees = allTrees.length;
  // Considera analisado qualquer pé com situação preenchida ou deficiência validada
  const analyzedTrees = allTrees.filter(isPeAnalyzed).length;
  const notAnalyzedTrees = totalTrees - analyzedTrees;

  const totalCopper = allTrees.filter((t) => t.deficienciaCobre).length;
  const totalManganese = allTrees.filter((t) => t.deficienciaManganes).length;
  const totalOutros = allTrees.filter((t) => t.outros).length;
  const totalDeficient = totalCopper + totalManganese + totalOutros;

  const nutritionalData = useMemo(() => {
    const copPerc = analyzedTrees > 0 ? Math.round((totalCopper / analyzedTrees) * 100) : 0;
    const manPerc = analyzedTrees > 0 ? Math.round((totalManganese / analyzedTrees) * 100) : 0;
    return { manganes: manPerc, cobre: copPerc };
  }, [analyzedTrees, totalCopper, totalManganese]);

  const coverageData = useMemo(() => {
    return { analyzed: analyzedTrees, total: totalTrees, notAnalyzed: notAnalyzedTrees };
  }, [analyzedTrees, totalTrees, notAnalyzedTrees]);

  const donutData = useMemo(() => {
    const copPerc = analyzedTrees > 0 ? Math.round((totalCopper / analyzedTrees) * 100) : 0;
    const manPerc = analyzedTrees > 0 ? Math.round((totalManganese / analyzedTrees) * 100) : 0;
    const outPerc = analyzedTrees > 0 ? Math.round((totalOutros / analyzedTrees) * 100) : 0;
    return [
      { name: "Cobre", percentage: copPerc, value: totalCopper, color: "#E65723" },
      { name: "Manganês", percentage: manPerc, value: totalManganese, color: "#FBBF24" },
      { name: "Adversos", percentage: outPerc, value: totalOutros, color: "#9CA3AF" },
    ];
  }, [analyzedTrees, totalCopper, totalManganese, totalOutros]);

  const groupedColumnData: GroupedColumnData[] = useMemo(() => {
    return talhoes.map(t => {
      const tTrees = allTrees.filter(tree => tree.talhaoId === t.id);
      const cobre = tTrees.filter(tree => tree.deficienciaCobre).length;
      const manganes = tTrees.filter(tree => tree.deficienciaManganes).length;
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
      return periods.map(monthLabel => {
        const monthTrees = allTrees.filter(tree => {
          if (!tree.createdAt) return false;
          return getMonthLabel(tree.createdAt) === monthLabel;
        });
        const cobre = monthTrees.filter(tree => tree.deficienciaCobre).length;
        const manganes = monthTrees.filter(tree => tree.deficienciaManganes).length;
        return {
          period: monthLabel,
          cobre: monthTrees.length > 0 ? Math.round((cobre / monthTrees.length) * 100) : 0,
          manganes: monthTrees.length > 0 ? Math.round((manganes / monthTrees.length) * 100) : 0,
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

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}  edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

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
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView} 
          >
            {!hasTalhoes && (
              <View style={styles.emptyBanner}>
                <Ionicons name="leaf-outline" size={28} color="#6BC24A" />
                <Text style={styles.emptyBannerTitle}>Nenhum talhão cadastrado</Text>
                <Text style={styles.emptyBannerText}>
                  Cadastre seu primeiro talhão para começar a registrar análises. Os gráficos abaixo aparecem vazios até você ter dados.
                </Text>
                <TouchableOpacity
                  style={styles.emptyBannerButton}
                  onPress={() => router.push("/(tabs)/History/history")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.emptyBannerButtonText}>Cadastrar talhão</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Análises Gerais</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            </View>

            {/* Status Nutricional da Propriedade */}
            <NutritionalStatusCard
              manganesPercentage={nutritionalData.manganes}
              cobrePercentage={nutritionalData.cobre}
              onPress={handleNutritionalPress}
            />

            {/* Cobertura das Análises */}
            <CoverageCard
              analyzed={coverageData.analyzed}
              total={coverageData.total}
              notAnalyzed={coverageData.notAnalyzed}
            />

            {/* Ocorrências totais de deficiências em % */}
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

            {/* Deficiência por talhão */}
            <GroupedColumnChart
              data={groupedColumnData}
              height={180}
            />

            {/* Evolução das deficiências (%) */}
            <EvolutionBarChart
              data={evolutionData[selectedPeriod]}
              onPeriodChange={handlePeriodChange}
              onDetailPress={handleDetailPress}
              height={200}
            />
          </ScrollView>
        )}

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: {
    flex: 1,         
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    paddingHorizontal: 25,
    gap: 8,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardContent: { padding: 16, width: "100%" },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A2C3E', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  dateText: { fontSize: 12, color: '#888' },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBanner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8D7BD",
    alignItems: "center",
    gap: 8,
  },
  emptyBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2C3E",
    textAlign: "center",
  },
  emptyBannerText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  emptyBannerButton: {
    marginTop: 4,
    backgroundColor: "#6BC24A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  emptyBannerButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});