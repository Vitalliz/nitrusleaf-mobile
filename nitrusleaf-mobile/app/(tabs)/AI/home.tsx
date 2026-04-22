// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";

// import { Background } from "@/components/ui/background";
// import { Header } from "@/components/header";
// import BottomNavbar from "@/components/ui/menu";
// import { CustomCard } from "@/components/card";
// import {
//   SimpleDonutChart,
//   SimpleBarChart,
//   SimpleColumnChart,
// } from "@/components/chart";
// import { Button } from "@/components/ui/button";

// export default function HomeScreen() {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fakeData = {
//       totalTrees: 87,
//       analyzedTrees: 56,
//       deficientTrees: 42,
//       user: {
//         name: "Roberto Almeida",
//         property: "Sítio Santa Aurora",
//       },
//       date: "02 Fev, 2026",
//       deficiencies: [
//         { name: "Manganês", percentage: 43, count: 24 },
//         { name: "Cobre", percentage: 19, count: 10 },
//         { name: "Adversos", percentage: 38, count: 21 },
//       ],
//       talhoes: [
//         {
//           id: "01",
//           name: "Talhão #01",
//           analyzed: 27,
//           total: 32,
//           date: "02 Fev, 2026",
//         },
//       ],
//       analysis: {},
//     };

//     setTimeout(() => {
//       setData(fakeData);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   // Dados para o primeiro gráfico de coluna (Talhões)
//   const columnData = [
//     {
//       label: "Talhão 1",
//       values: [
//         { value: 13, color: "#D84315" },
//         { value: 18, color: "#F9A825" },
//       ],
//     },
//     {
//       label: "Talhão 2",
//       values: [
//         { value: 13, color: "#D84315" },
//         { value: 11, color: "#F9A825" },
//       ],
//     },
//     {
//       label: "Talhão 3",
//       values: [
//         { value: 12, color: "#D84315" },
//         { value: 8, color: "#F9A825" },
//       ],
//     },
//   ];

//   // Dados para o gráfico de evolução mensal (apenas Cobre e Manganês)
//   const monthlyData = [
//     {
//       label: "Set",
//       values: [
//         { value: 50, color: "#D84315" }, // Cobre
//         { value: 40, color: "#F9A825" }, // Manganês
//       ],
//     },
//     {
//       label: "Out",
//       values: [
//         { value: 22, color: "#D84315" },
//         { value: 25, color: "#F9A825" },
//       ],
//     },
//     {
//       label: "Nov",
//       values: [
//         { value: 12, color: "#D84315" },
//         { value: 15, color: "#F9A825" },
//       ],
//     },
//   ];

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6BC24A" />
//         <Text style={styles.loadingText}>Carregando análises...</Text>
//       </View>
//     );
//   }

//   const totalTrees = data?.totalTrees ?? 0;
//   const analyzedTrees = data?.analyzedTrees ?? 0;
//   const deficiencies = data?.deficiencies ?? [];

//   return (
//     <Background>
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

//         <Header title={data?.user?.name} subtitle={data?.user?.property} />

//         <ScrollView contentContainerStyle={styles.container}>
//           <View style={styles.titleRow}>
//             <Text style={styles.title}>Análises Gerais</Text>
//             <View style={styles.dateRow}>
//               <Text style={styles.dateIcon}>📅</Text>
//               <Text style={styles.date}>{data?.date}</Text>
//             </View>
//           </View>

//           {/* DADOS GERAIS EM CARDS */}
//           <CustomCard
//             variant="yellow"
//             bottomContent={
//               <View style={styles.statusContainer}>
//                 <View style={styles.statusItem}>
//                   <Text style={styles.statusPercentage}>43%</Text>
//                   <View style={styles.badgeYellow}>
//                     <Text style={styles.badgeText}>Manganês</Text>
//                   </View>
//                 </View>

//                 <View style={styles.divider} />

//                 <View style={styles.statusItem}>
//                   <Text style={styles.statusPercentage}>19%</Text>
//                   <View style={styles.badgeOrange}>
//                     <Text style={styles.badgeText}>Cobre</Text>
//                   </View>
//                 </View>
//               </View>
//             }
//           />

//           {/* COBERTURA DAS ANÁLISES */}
//           <CustomCard
//             variant="gray"
//             bottomContent={
//               <View>
//                 <View style={styles.coverageContainer}>
//                   <View style={styles.coverageHeader}>
//                     <View>
//                       <Text style={styles.coverageValue}>
//                         {analyzedTrees}/{totalTrees} árvores analisadas
//                       </Text>
//                       <View style={styles.warningRow}>
//                         <Text style={styles.warningIcon}>⚠️</Text>
//                         <Text style={styles.warningText}>
//                           {totalTrees - analyzedTrees} árvores não analisadas
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.treeIcon}>
//                       <View style={styles.treeCircle} />
//                       <View style={styles.treeTrunk} />
//                     </View>
//                   </View>

//                   <View style={styles.separator} />

//                   <SimpleBarChart
//                     data={[
//                       {
//                         label: "Árvores analisadas",
//                         value: analyzedTrees,
//                         max: totalTrees,
//                         color: "#F5A623",
//                       },
//                     ]}
//                   />
//                 </View>
//               </View>
//             }
//           />

//           {/* OCORRÊNCIAS TOTAIS DE DEFICIÊNCIAS */}
//           <CustomCard
//             variant="white"
//             bottomContent={
//               <View style={{ width: "100%" }}>
//                 <Text style={styles.cardTitle}>
//                   Ocorrências totais de deficiências em %
//                 </Text>

//                 <View style={styles.row}>
//                   <View style={styles.chartContainer}>
//                     <SimpleDonutChart
//                       centerText={`${analyzedTrees}/${totalTrees}`}
//                       data={deficiencies.map((d: any) => ({
//                         name: d.name,
//                         percentage: d.percentage,
//                         color:
//                           d.name === "Cobre"
//                             ? "#D35400"
//                             : d.name === "Manganês"
//                             ? "#F5A623"
//                             : "#9E9E9E",
//                       }))}
//                     />
//                   </View>

//                   <View style={styles.legendContainerDonut}>
//                     {deficiencies.map((item: any) => (
//                       <View key={item.name} style={styles.legendRow}>
//                         <View
//                           style={[
//                             styles.badge,
//                             {
//                               backgroundColor:
//                                 item.name === "Cobre"
//                                   ? "#D35400"
//                                   : item.name === "Manganês"
//                                   ? "#F5A623"
//                                   : "#9E9E9E",
//                             },
//                           ]}
//                         >
//                           <Text style={styles.badgeText}>
//                             {item.percentage}%
//                           </Text>
//                         </View>
//                         <Text style={styles.legendText}>{item.name}</Text>
//                         <Text style={styles.legendValue}>{item.count}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>

//                 <TouchableOpacity style={styles.button}>
//                   <Text style={styles.buttonText}>Ver detalhes</Text>
//                 </TouchableOpacity>
//               </View>
//             }
//           />

//           {/* PRIMEIRO CARD - Deficiência por talhão */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Deficiência por talhão</Text>

//             <SimpleColumnChart data={columnData} />

//             <View style={styles.legendContainer}>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: "#D84315" }]} />
//                 <Text style={styles.legendText}>Cobre</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: "#F9A825" }]} />
//                 <Text style={styles.legendText}>Manganês</Text>
//               </View>
//             </View>

//             <Button
//               title="Detalhar"
//               variant="primary"
//               size="full"
//               onPress={() => console.log("Detalhar")}
//             />
//           </View>

//           {/* SEGUNDO CARD - Evolução mensal das deficiências */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Evolução mensal das deficiências (%)</Text>

//             {/* Gráfico de barras por mês */}
//             <SimpleColumnChart data={monthlyData} />

//             {/* Legenda */}
//             <View style={styles.legendContainer}>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: "#D84315" }]} />
//                 <Text style={styles.legendText}>Cobre</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendDot, { backgroundColor: "#F9A825" }]} />
//                 <Text style={styles.legendText}>Manganês</Text>
//               </View>
//             </View>

//             {/* Tabela de valores para referência */}
//             <View style={styles.valuesTable}>
//               <Text style={styles.tableTitle}>Valores por período:</Text>
//               <View style={styles.tableHeader}>
//                 <Text style={styles.tableHeaderText}>Deficiência</Text>
//                 <Text style={styles.tableHeaderText}>Set</Text>
//                 <Text style={styles.tableHeaderText}>Out</Text>
//                 <Text style={styles.tableHeaderText}>Nov</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.deficiencyName}>Cobre</Text>
//                 <Text style={styles.tableCell}>50%</Text>
//                 <Text style={styles.tableCell}>22%</Text>
//                 <Text style={styles.tableCell}>12%</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.deficiencyName}>Manganês</Text>
//                 <Text style={styles.tableCell}>40%</Text>
//                 <Text style={styles.tableCell}>25%</Text>
//                 <Text style={styles.tableCell}>15%</Text>
//               </View>
//             </View>

//             {/* Indicador de tendência */}
//             <View style={styles.trendContainer}>
//               <Text style={styles.trendTitle}>Tendência geral</Text>
//               <View style={styles.trendIndicator}>
//                 <Text style={styles.trendDown}>▼ Redução de 35%</Text>
//                 <Text style={styles.trendText}>nos últimos 3 meses</Text>
//               </View>
//             </View>

//             <Button
//               title="Ver evolução completa"
//               variant="primary"
//               size="full"
//               onPress={() => console.log("Ver evolução completa")}
//             />
//           </View>
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
//     paddingBottom: 120,
//     paddingTop: 12,
//     alignItems: "center",
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#666",
//   },

//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 18,
//     paddingHorizontal: 16,
//     width: "100%",
//     maxWidth: 385,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#1A2C3E",
//   },

//   date: {
//     fontSize: 14,
//     color: "#888",
//   },

//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },

//   dateIcon: {
//     fontSize: 14,
//   },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     width: "100%",
//     maxWidth: 385,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },

//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 16,
//     color: "#1A2C3E",
//   },

//   statusContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   statusItem: {
//     alignItems: "center",
//     flex: 1,
//   },

//   statusPercentage: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#1A2C3E",
//   },

//   divider: {
//     width: 1,
//     height: 45,
//     backgroundColor: "#ddd",
//   },

//   badgeYellow: {
//     marginTop: 6,
//     backgroundColor: "#F5A623",
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },

//   badgeOrange: {
//     marginTop: 6,
//     backgroundColor: "#D35400",
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },

//   badgeText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 12,
//   },

//   coverageContainer: {
//     marginTop: 10,
//     width: "100%",
//   },

//   coverageValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1A2C3E",
//   },

//   warningRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },

//   warningIcon: {
//     marginRight: 6,
//   },

//   warningText: {
//     color: "#F5A623",
//     fontWeight: "500",
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 12,
//   },

//   chartContainer: {
//     flex: 1,
//     alignItems: "center",
//   },

//   legendContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 10,
//     gap: 16,
//   },

//   legendContainerDonut: {
//     flex: 1,
//     justifyContent: "space-around",
//     paddingLeft: 10,
//   },

//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   legendDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 6,
//   },

//   legendText: {
//     fontSize: 12,
//     color: "#555",
//   },

//   legendRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },

//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   badgeDonut: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   legendValue: {
//     fontWeight: "bold",
//     color: "#333",
//   },

//   button: {
//     backgroundColor: "#7ACB5A",
//     padding: 14,
//     borderRadius: 25,
//     alignItems: "center",
//     marginTop: 18,
//   },

//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },

//   coverageHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   separator: {
//     height: 1,
//     backgroundColor: "#ddd",
//     marginVertical: 10,
//   },

//   treeIcon: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 10,
//   },

//   treeCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 3,
//     borderColor: "#58B741",
//   },

//   treeTrunk: {
//     width: 4,
//     height: 18,
//     backgroundColor: "#58B741",
//     marginTop: -6,
//   },

//   // Estilos da tabela de valores
//   valuesTable: {
//     marginTop: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E5E5",
//   },

//   tableTitle: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#666",
//     marginBottom: 8,
//   },

//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#F5F5F5",
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 6,
//     marginBottom: 4,
//   },

//   tableHeaderText: {
//     flex: 1,
//     fontSize: 11,
//     fontWeight: "600",
//     color: "#666",
//     textAlign: "center",
//   },

//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },

//   tableCell: {
//     flex: 1,
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#1A2C3E",
//     textAlign: "center",
//   },

//   deficiencyName: {
//     flex: 1,
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#1A2C3E",
//   },

//   trendContainer: {
//     marginTop: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E5E5",
//   },

//   trendTitle: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#666",
//     marginBottom: 8,
//   },

//   trendIndicator: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },

//   trendDown: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#4CAF50",
//   },

//   trendText: {
//     fontSize: 12,
//     color: "#888",
//   },
// });