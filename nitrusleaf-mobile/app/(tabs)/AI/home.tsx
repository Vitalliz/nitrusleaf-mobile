// app/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Background } from '@/components/ui/background';
import { Header } from '@/components/header';
import BottomNavbar from '@/components/ui/menu';
import { Button } from '@/components/ui/button';
import { CustomCard } from '@/components/cards/card';
import { NutritionalStatusCard } from '@/components/charts/nutricionalstatus';
import { CoverageCard } from '@/components/charts/coverage';
import { DonutChart } from '@/components/charts/donutchart';
import { GroupedColumnChart, GroupedColumnData } from '@/components/charts/columnchart';
import { EvolutionBarChart, EvolutionData, TimePeriod } from '@/components/charts/barchart';

export default function HomeScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('6months');

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
    { name: 'Cobre', percentage: 19, value: 10, color: '#E65723' },
    { name: 'Manganês', percentage: 43, value: 24, color: '#FBBF24' },
    { name: 'Adversos', percentage: 38, value: 21, color: '#9CA3AF' },
  ];

  // Mock data for Grouped Column Chart (Deficiência por talhão)
  const groupedColumnData: GroupedColumnData[] = [
    { talhao: 'Talhão 1', cobre: 12, manganes: 18 },
    { talhao: 'Talhão 2', cobre: 8, manganes: 15 },
    { talhao: 'Talhão 3', cobre: 6, manganes: 10 },
  ];

  // Mock data for Evolution Bar Chart
  const evolutionData: Record<TimePeriod, EvolutionData[]> = {
    '6months': [
      { period: 'Set', cobre: 50, manganes: 40 },
      { period: 'Out', cobre: 22, manganes: 25 },
      { period: 'Nov', cobre: 12, manganes: 15 },
      { period: 'Dez', cobre: 10, manganes: 8 },
      { period: 'Jan', cobre: 8, manganes: 6 },
      { period: 'Fev', cobre: 5, manganes: 4 },
    ],
    '3months': [
      { period: 'Dez', cobre: 10, manganes: 8 },
      { period: 'Jan', cobre: 8, manganes: 6 },
      { period: 'Fev', cobre: 5, manganes: 4 },
    ],
    '1month': [
      { period: 'Sem 1', cobre: 8, manganes: 6 },
      { period: 'Sem 2', cobre: 7, manganes: 5 },
      { period: 'Sem 3', cobre: 6, manganes: 4 },
      { period: 'Sem 4', cobre: 5, manganes: 4 },
    ],
  };

  const handleDetailPress = useCallback(() => {
    console.log('Detalhar pressed');
  }, []);

  const handlePeriodChange = useCallback((period: TimePeriod) => {
    setSelectedPeriod(period);
    console.log('Period changed:', period);
  }, []);

  const handleVerDetalhes = useCallback(() => {
    console.log('Ver detalhes pressed');
  }, []);

  const handleNutritionalPress = useCallback(() => {
    console.log('Ver detalhes nutricionais');
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <Header 
          title="Roberto Almeida" 
          subtitle="Sítio Santa Aurora"
          onMenuPress={() => console.log("Menu pressed")}
          onAvatarPress={() => console.log("Avatar pressed")}
        />

        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Título da tela */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Análises Gerais</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.date}>02 Fev, 2026</Text>
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
                size={200}
                innerRadius={60}
                centerText={`${coverageData.analyzed}/${coverageData.total}`}
                showLabels={true}
              />
              
              <Button
                title="Ver detalhes"
                variant="primary"
                size="full"
                onPress={handleVerDetalhes}
              />
            </View>
          </CustomCard>

          {/* Deficiência por talhão */}
          <GroupedColumnChart
            data={groupedColumnData}
            onDetailPress={handleDetailPress}
            height={280}
            showDownloadButton={false}
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
    gap: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A2C3E',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  cardContent: {
    padding: 16,
    width: '100%',
    // justifyContent: 'center',
    // display: 'flex',
   
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2C3E',
    marginBottom: 16,
    textAlign: 'center',
  },
});