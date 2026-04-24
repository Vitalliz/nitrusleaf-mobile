// // app/ResultadoScreen.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import React, { useCallback } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { GaugeChart } from "@/components/charts/gaugechart";
// import { Background } from "@/components/ui/background";
// import { Button } from "@/components/ui/button";
// import BottomNavbar from "@/components/ui/menu";

// // Tipagem para os parâmetros de navegação
// interface ResultadoParams {
//   analysisId: string;
//   percentage: number;
//   deficiencyType: "Cobre" | "Manganês";
//   probability: number;
//   technicalSummary?: string;
// }

// export default function ResultadoScreen() {
//   const route = useRoute();
//   const navigation = useNavigation();

//   // Dados recebidos da navegação ou fallback para mock
//   const params = route.params as ResultadoParams;

//   const analysisId = params?.analysisId || "006";
//   const percentage = params?.percentage || 92;
//   const deficiencyType = params?.deficiencyType || "Cobre";
//   const probability = params?.probability || 92;

//   const handleTechnicalPress = useCallback(() => {
//     console.log("Ver resumo técnico - Análise:", analysisId);
//     // Navegar para tela de resumo técnico ou abrir modal
//   }, [analysisId]);

//   const handleInfoPress = useCallback(() => {
//     console.log("O que significa - Deficiência de:", deficiencyType);
//     // Abrir modal ou expandir card com informações
//   }, [deficiencyType]);

//   const handleBackPress = useCallback(() => {
//     navigation.goBack();
//   }, [navigation]);

//   return (
//     <Background>
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

//         {/* Header com botão de voltar */}
//         <View style={styles.headerContainer}>
//           <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="#1A2C3E" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Resultado da análise</Text>
//           <View style={styles.placeholder} />
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.container}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Card Principal - Branco com borda superior laranja */}
//           <View style={styles.mainCard}>
//             {/* Análise # */}
//             <Text style={styles.analysisId}>Análise #{analysisId}</Text>

//             {/* Linha divisória */}
//             <View style={styles.divider} />

//             {/* Gauge Circular */}
//             <View style={styles.gaugeContainer}>
//               <GaugeChart
//                 percentage={probability}
//                 size={200}
//                 backgroundColor="#E5E7EB"
//                 showPercentage={true}
//               />
//             </View>

//             {/* Texto abaixo do gauge */}
//             <Text style={styles.probabilityLabel}>Probabilidade estimada</Text>
//             <Text style={styles.deficiencyTitle}>
//               Deficiência de {deficiencyType}
//             </Text>

//             {/* Botão Ver resumo técnico */}
//             <Button
//               title="Ver resumo técnico"
//               variant="primary"
//               size="full"
//               onPress={handleTechnicalPress}
//             />
//           </View>

//           {/* Card "O que significa?" - Fundo verde */}
//           <TouchableOpacity
//             style={styles.infoCard}
//             onPress={handleInfoPress}
//             activeOpacity={0.9}
//           >
//             <View style={styles.infoContent}>
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoTitle}>O que significa?</Text>
//                 <Text style={styles.infoSubtitle}>Clique para saber mais</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
//             </View>
//           </TouchableOpacity>

//           {/* Nota adicional (opcional) */}
//           <Text style={styles.note}>
//             Esta análise foi baseada na imagem enviada. Consulte um agrônomo
//             para recomendações específicas.
//           </Text>
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
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 8,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1A2C3E",
//   },
//   placeholder: {
//     width: 40,
//   },
//   container: {
//     padding: 16,
//     paddingBottom: 40,
//     gap: 16,
//   },
//   mainCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 20,
//     borderTopWidth: 4,
//     borderTopColor: "#E65723",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   analysisId: {
//     fontSize: 14,
//     color: "#888",
//     marginBottom: 12,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#E5E5E5",
//     marginBottom: 24,
//   },
//   gaugeContainer: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   probabilityLabel: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   deficiencyTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#1A2C3E",
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   infoCard: {
//     backgroundColor: "#6BC24A",
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 8,
//   },
//   infoContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   infoTextContainer: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     marginBottom: 4,
//   },
//   infoSubtitle: {
//     fontSize: 13,
//     color: "#FFFFFF",
//     opacity: 0.9,
//   },
//   note: {
//     fontSize: 12,
//     color: "#888",
//     textAlign: "center",
//     marginTop: 8,
//     paddingHorizontal: 16,
//   },
// });
