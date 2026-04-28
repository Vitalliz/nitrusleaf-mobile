// // app/TestChartsScreen.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import { Background } from '@/components/ui/background';
// import { Header } from '@/components/header';
// import BottomNavbar from '@/components/ui/menu';

// // Import all chart components
// import { GroupedColumnChart, GroupedColumnData } from '@/components/charts/columnchart';
// import { EvolutionBarChart, EvolutionData, TimePeriod } from '@/components/charts/barchart';
// import { DonutChart, DonutData } from '@/components/charts/donutchart';
// import { NutritionalStatusCard } from '@/components/charts/nutricionalstatus';
// import { GaugeChart } from '@/components/charts/gaugechart';
// import { CoverageCard } from '@/components/charts/coverage';

// export default function TestChartsScreen() {
//   const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('6months');

//   // Mock data for Grouped Column Chart
//   const groupedColumnData: GroupedColumnData[] = [
//     { talhao: 'Talhão 1', cobre: 12, manganes: 18 },
//     { talhao: 'Talhão 2', cobre: 8, manganes: 15 },
//     { talhao: 'Talhão 3', cobre: 6, manganes: 10 },
//     { talhao: 'Talhão 4', cobre: 15, manganes: 22 },
//     { talhao: 'Talhão 5', cobre: 4, manganes: 9 },
//   ];

//   // Mock data for Evolution Line Chart
//   const evolutionData: Record<TimePeriod, EvolutionData[]> = {
//     '6months': [
//       { period: 'Set', cobre: 15, manganes: 25 },
//       { period: 'Out', cobre: 18, manganes: 28 },
//       { period: 'Nov', cobre: 22, manganes: 32 },
//       { period: 'Dez', cobre: 20, manganes: 35 },
//       { period: 'Jan', cobre: 25, manganes: 38 },
//       { period: 'Fev', cobre: 30, manganes: 43 },
//     ],
//     '3months': [
//       { period: 'Dez', cobre: 20, manganes: 35 },
//       { period: 'Jan', cobre: 25, manganes: 38 },
//       { period: 'Fev', cobre: 30, manganes: 43 },
//     ],
//     '1month': [
//       { period: 'Sem 1', cobre: 28, manganes: 40 },
//       { period: 'Sem 2', cobre: 29, manganes: 41 },
//       { period: 'Sem 3', cobre: 31, manganes: 44 },
//       { period: 'Sem 4', cobre: 30, manganes: 43 },
//     ],
//   };

//   // Mock data for Donut Chart
//   const donutData: DonutData[] = [
//     { name: 'Cobre', percentage: 19, value: 10, color: '#E65723' },
//     { name: 'Manganês', percentage: 43, value: 24, color: '#FBBF24' },
//     { name: 'Adversos', percentage: 38, value: 21, color: '#9CA3AF' },
//   ];

//   const handleDetailPress = () => {
//     console.log('Detalhar pressionado');
//   };

//   const handlePeriodChange = (period: TimePeriod) => {
//     setSelectedPeriod(period);
//     console.log('Período alterado:', period);
//   };

//   const handleTechnicalPress = () => {
//     console.log('Ver resumo técnico');
//   };

//   const handleInfoPress = () => {
//     console.log('O que significa?');
//   };

//   const handleNutritionalPress = () => {
//     console.log('Ver detalhes nutricionais');
//   };

//   return (
//     <Background>
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />
        
//         <Header 
//           title="Teste de Componentes" 
//           subtitle="Visualização de Dados"
//           onMenuPress={() => console.log("Menu pressed")}
//           onAvatarPress={() => console.log("Avatar pressed")}
//         />

//         <ScrollView 
//           contentContainerStyle={styles.container}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Section Title */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>📊 Componentes de Visualização</Text>
//             <Text style={styles.sectionSubtitle}>
//               Teste completo de todos os gráficos e cards
//             </Text>
//           </View>

//           {/* 1. Donut Chart - Ocorrências totais de deficiências */}
//           <View style={styles.section}>
//             <Text style={styles.componentTitle}>1. Donut Chart</Text>
//             <Text style={styles.componentDescription}>
//               Ocorrências totais de deficiências em %
//             </Text>
//             <DonutChart
//               data={donutData}
//               size={220}
//               innerRadius={65}
//               centerText="56/87"
//               showLabels={true}
//             />
//           </View>

//           {/* 2. Nutritional Status Card */}
//           <View style={styles.section}>
//             <Text style={styles.componentTitle}>2. Status Nutricional</Text>
//             <Text style={styles.componentDescription}>
//               Status Nutricional da Propriedade
//             </Text>
//             <NutritionalStatusCard
//               manganesPercentage={43}
//               cobrePercentage={19}
//               onPress={handleNutritionalPress}
//             />
//           </View>

//           {/* 3. Coverage Card */}
//           <View style={styles.section}>
//             <Text style={styles.componentTitle}>3. Cobertura das Análises</Text>
//             <Text style={styles.componentDescription}>
//               Progresso das análises realizadas
//             </Text>
//             <CoverageCard
//               analyzed={56}
//               total={87}
//               notAnalyzed={31}
//             />
//           </View>

//           {/* 4. Grouped Column Chart */}
//           <View style={styles.section}>
//             <Text style={styles.componentTitle}>4. Gráfico de Barras Agrupadas</Text>
//             <Text style={styles.componentDescription}>
//               Deficiência por talhão (Cobre vs Manganês)
//             </Text>
//             <GroupedColumnChart
//               data={groupedColumnData}
//               onDetailPress={handleDetailPress}
//               height={300}
//               showDownloadButton={true}
//             />
//           </View>

//           {/* 5. Evolution Line Chart */}
//           <View style={styles.section}>
//             <Text style={styles.componentTitle}>5. Gráfico de Evolução</Text>
//             <Text style={styles.componentDescription}>
//               Evolução das deficiências ao longo do tempo
//             </Text>
//             <EvolutionBarChart
//               data={evolutionData[selectedPeriod]}
//               onPeriodChange={handlePeriodChange}
//               height={300}
//             />
//           </View>

//           {/* 6. Gauge Chart */}
//           <View style={styles.section}>
//             <Text style={styles.componentTitle}>6. Gauge Circular</Text>
//             <Text style={styles.componentDescription}>
//               Resultado da análise por imagem
//             </Text>
//             <GaugeChart
//               percentage={92}
//               label="Deficiência de Cobre"
//               sublabel="Alta probabilidade detectada"
//               size={260}
//               onTechnicalPress={handleTechnicalPress}
//               onInfoPress={handleInfoPress}
//             />
//           </View>

//           {/* Additional Info - Data Summary */}
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryTitle}>📈 Resumo dos Dados de Teste</Text>
            
//             <View style={styles.summaryRow}>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>Total de Talhões:</Text>
//                 <Text style={styles.summaryValue}>5</Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>Período analisado:</Text>
//                 <Text style={styles.summaryValue}>6 meses</Text>
//               </View>
//             </View>

//             <View style={styles.summaryRow}>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>Média Cobre:</Text>
//                 <Text style={styles.summaryValue}>9%</Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>Média Manganês:</Text>
//                 <Text style={styles.summaryValue}>14.8%</Text>
//               </View>
//             </View>

//             <View style={styles.noteContainer}>
//               <Ionicons name="information-circle-outline" size={20} color="#6BC24A" />
//               <Text style={styles.noteText}>
//                 Estes são dados de exemplo para demonstração. Conecte sua API para dados reais.
//               </Text>
//             </View>
//           </View>

//           {/* Bottom spacing */}
//           <View style={styles.bottomSpacing} />
//         </ScrollView>

//         <BottomNavbar />
//       </SafeAreaView>
//     </Background>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   sectionHeader: {
//     marginBottom: 24,
//     paddingBottom: 16,
//     borderBottomWidth: 2,
//     borderBottomColor: '#E5E5E5',
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1A2C3E',
//     marginBottom: 8,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: '#888',
//     lineHeight: 20,
//   },
//   section: {
//     marginBottom: 32,
//   },
//   componentTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1A2C3E',
//     marginBottom: 4,
//   },
//   componentDescription: {
//     fontSize: 13,
//     color: '#888',
//     marginBottom: 16,
//     fontStyle: 'italic',
//   },
//   summaryCard: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A2C3E',
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   summaryItem: {
//     flex: 1,
//   },
//   summaryLabel: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 4,
//   },
//   summaryValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A2C3E',
//   },
//   noteContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E5E5',
//   },
//   noteText: {
//     flex: 1,
//     fontSize: 12,
//     color: '#888',
//     lineHeight: 16,
//   },
//   bottomSpacing: {
//     height: 20,
//   },
// });