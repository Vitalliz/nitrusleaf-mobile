// app/HomeScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

export default function HomeScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("6months");

  const nutritionalData = { manganes: 43, cobre: 19 };
  const coverageData = { analyzed: 56, total: 87, notAnalyzed: 31 };

  const donutData = [
    { name: "Cobre", percentage: 19, value: 10, color: "#E65723" },
    { name: "Manganês", percentage: 43, value: 24, color: "#FBBF24" },
    { name: "Adversos", percentage: 38, value: 21, color: "#9CA3AF" },
  ];

  const groupedColumnData: GroupedColumnData[] = [
    { talhao: "Talhão 1", cobre: 12, manganes: 18 },
    { talhao: "Talhão 2", cobre: 8, manganes: 15 },
    { talhao: "Talhão 3", cobre: 6, manganes: 10 },
  ];

  // Dados fictícios com meses dinâmicos baseados na data atual
  const evolutionData: Record<TimePeriod, EvolutionData[]> = useMemo(() => {
    const months6 = getLastMonths(6);
    const months3 = getLastMonths(3);
    const currentMonth = getCurrentMonth();

    // Valores fictícios fixos — só os labels mudam
    const values6 = [
      { cobre: 50, manganes: 40 },
      { cobre: 22, manganes: 25 },
      { cobre: 12, manganes: 15 },
      { cobre: 10, manganes: 8 },
      { cobre: 8, manganes: 6 },
      { cobre: 5, manganes: 4 },
    ];
    const values3 = [
      { cobre: 10, manganes: 8 },
      { cobre: 8, manganes: 6 },
      { cobre: 5, manganes: 4 },
    ];

    return {
      "6months": months6.map((period, i) => ({ period, ...values6[i] })),
      "3months": months3.map((period, i) => ({ period, ...values3[i] })),
      // Último mês: uma única barra com o mês atual
      "1month": [{ period: currentMonth, cobre: 8, manganes: 6 }],
    };
  }, []);

  const handleDetailPress = useCallback(() => console.log("Detalhar pressed"), []);
  const handlePeriodChange = useCallback((period: TimePeriod) => setSelectedPeriod(period), []);
  const handleVerDetalhes = useCallback(() => console.log("Ver detalhes pressed"), []);
  const handleNutritionalPress = useCallback(() => console.log("Ver detalhes nutricionais"), []);

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <Header
          userName="Roberto Almeida"
          userSubtitle="Sítio Santa Aurora"
          userAvatar="https://media.istockphoto.com/id/1410538853/pt/foto/young-man-in-the-public-park.jpg?s=2048x2048&w=is&k=20&c=MIzvR5V8GPSO0zVoFnyE6E-AdkmH_TdBO0MSeEs1Ik4="
          subtitleIcon="location-outline"
          onMenuPress={() => console.log('menu')}
          onAvatarPress={() => console.log('avatar')}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
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
            onDetailPress={handleDetailPress}
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

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 40,
    paddingHorizontal: 25,
    gap: 5,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardContent: { padding: 16, width: "100%" },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A2C3E', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  dateText: { fontSize: 12, color: '#888' },
});