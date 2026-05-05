// app/HomeScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
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
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";

export default function HomeScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("6months");

  // Mock data for Nutritional Status
  const nutritionalData = {
    manganes: 43,
    cobre: 19,
  };

  // Mock data for Coverage
  const coverageData = {
    analyzed: 56,
    total: 87,
    notAnalyzed: 31,
  };

  // Mock data for Donut Chart (Ocorrências totais de deficiências)
  const donutData = [
    { name: "Cobre", percentage: 19, value: 10, color: "#E65723" },
    { name: "Manganês", percentage: 43, value: 24, color: "#FBBF24" },
    { name: "Adversos", percentage: 38, value: 21, color: "#9CA3AF" },
  ];

  // Mock data for Grouped Column Chart (Deficiência por talhão)
  const groupedColumnData: GroupedColumnData[] = [
    { talhao: "Talhão 1", cobre: 12, manganes: 18 },
    { talhao: "Talhão 2", cobre: 8, manganes: 15 },
    { talhao: "Talhão 3", cobre: 6, manganes: 10 },
  ];

  // Mock data for Evolution Bar Chart
  const evolutionData: Record<TimePeriod, EvolutionData[]> = {
    "6months": [
      { period: "Set", cobre: 50, manganes: 40 },
      { period: "Out", cobre: 22, manganes: 25 },
      { period: "Nov", cobre: 12, manganes: 15 },
      { period: "Dez", cobre: 10, manganes: 8 },
      { period: "Jan", cobre: 8, manganes: 6 },
      { period: "Fev", cobre: 5, manganes: 4 },
    ],
    "3months": [
      { period: "Dez", cobre: 10, manganes: 8 },
      { period: "Jan", cobre: 8, manganes: 6 },
      { period: "Fev", cobre: 5, manganes: 4 },
    ],
    "1month": [
      { period: "Sem 1", cobre: 8, manganes: 6 },
      { period: "Sem 2", cobre: 7, manganes: 5 },
      { period: "Sem 3", cobre: 6, manganes: 4 },
      { period: "Sem 4", cobre: 5, manganes: 4 },
    ],
  };

  const handleDetailPress = useCallback(() => {
    console.log("Detalhar pressed");
  }, []);

  const handlePeriodChange = useCallback((period: TimePeriod) => {
    setSelectedPeriod(period);
    console.log("Period changed:", period);
  }, []);

  const handleVerDetalhes = useCallback(() => {
    console.log("Ver detalhes pressed");
  }, []);

  const handleNutritionalPress = useCallback(() => {
    console.log("Ver detalhes nutricionais");
  }, []);

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
          onAvatarPress={() => router.push('/profile')}
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
                onDetailPress={handleVerDetalhes}   // ← botão agora vive dentro do componente
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
            height={300}
          />
        </ScrollView>

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    paddingHorizontal: 25,
    gap: 5,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  cardContent: {
    padding: 16,
    width: "100%",

  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2C3E',
    marginBottom: 12,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15},
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  dateText: { fontSize: 12, color: '#888' },
});
