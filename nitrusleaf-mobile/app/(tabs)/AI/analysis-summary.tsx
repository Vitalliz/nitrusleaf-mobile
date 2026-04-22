// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   TouchableOpacity,
//   TextInput,
// } from "react-native";

// import { Header } from "@/components/header";
// import { Background } from "@/components/ui/background";
// import { Button } from "@/components/ui/button";
// import BottomNavbar from "@/components/ui/menu";
// import { CustomCard } from "@/components/card";

// export default function Dashboard() {
//   const [reportText, setReportText] = useState("");
//   const [status, setStatus] = useState("Em tratamento");
//   const [showStatusOptions, setShowStatusOptions] = useState(false);

//   const currentAnalysis = {
//     id: "#006",
//     date: "23 de Março de 2026",
//     deficiency: "Cobre",
//     probability: 92,
//     author: "Roberto Almeida",
//     location: {
//       talhao: "Talhão 3",
//       tree: "Árvore 6",
//     },
//   };

//   const statusOptions = ["+ Adicionar status", "Em tratamento", "Concluído", "Pendente"];

//   return (
//     <Background>
//       <SafeAreaView style={{ flex: 1 }}>
//         <Header title={""} />

//         <ScrollView contentContainerStyle={styles.content}>
//           {/* Título da tela */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Resumo da Análise</Text>
//             <Text style={styles.date}>02 Fev, 2026</Text>
//           </View>

//           {/* CARD ÚNICO - Unindo primeira e segunda parte */}
//           <CustomCard variant="red-large">
//             <View style={styles.cardContent}>
//               {/* ===== PRIMEIRA PARTE (imagem 1) ===== */}
//               <Text style={styles.resultTitle}>Resultado da análise por imagem</Text>

//               <View style={styles.analysisHeader}>
//                 <Text style={styles.analysisId}>Análise {currentAnalysis.id}</Text>
//                 <Text style={styles.analysisDate}>{currentAnalysis.date}</Text>
//               </View>

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Deficiência detectada:</Text>
//                 <Text style={styles.infoValueBold}>{currentAnalysis.deficiency}</Text>
//               </View>

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Probabilidade estimada da IA:</Text>
//                 <Text style={styles.infoValueBold}>{currentAnalysis.probability}%</Text>
//               </View>

//               <View style={styles.divider} />

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Autor da análise:</Text>
//                 <Text style={styles.infoValue}>{currentAnalysis.author}</Text>
//               </View>

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Status:</Text>
//                 {status === "+ Adicionar status" ? (
//                   <TouchableOpacity onPress={() => setShowStatusOptions(!showStatusOptions)}>
//                     <Text style={styles.statusAdd}>+ Adicionar status</Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity onPress={() => setStatus("+ Adicionar status")}>
//                     <Text style={styles.statusValue}>{status}</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {showStatusOptions && (
//                 <View style={styles.statusOptionsContainer}>
//                   {statusOptions.map((option) => (
//                     <TouchableOpacity
//                       key={option}
//                       style={styles.statusOption}
//                       onPress={() => {
//                         setStatus(option);
//                         setShowStatusOptions(false);
//                       }}
//                     >
//                       <Text style={styles.statusOptionText}>{option}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}

//               <View style={styles.locationSection}>
//                 <Text style={styles.locationTitle}>Localização da amostra</Text>
//                 <View style={styles.locationList}>
//                   <Text style={styles.locationItem}>• {currentAnalysis.location.talhao}</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.linkText}>Alterar localização</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.reportSection}>
//                 <Text style={styles.reportTitle}>Escrever Relatório</Text>
//                 <TextInput
//                   style={styles.reportInput}
//                   placeholder="Adicione suas observações..."
//                   placeholderTextColor="#999"
//                   multiline
//                   value={reportText}
//                   onChangeText={setReportText}
//                 />
//               </View>

//               <Button
//                 title="Salvar no histórico"
//                 variant="primary"
//                 size="full"
//                 onPress={() => console.log("Salvar no histórico - Parte 1", { reportText, status })}
//               />

//               {/* ===== LINHA DIVISÓRIA ENTRE AS PARTES ===== */}
//               <View style={styles.bigDivider} />

//               {/* ===== SEGUNDA PARTE (imagem 2) ===== */}
//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Deficiência detectada:</Text>
//                 <Text style={styles.infoValueBold}>{currentAnalysis.deficiency}</Text>
//               </View>

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Probabilidade estimada da IA:</Text>
//                 <Text style={styles.infoValueBold}>{currentAnalysis.probability}%</Text>
//               </View>

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Autor da análise:</Text>
//                 <Text style={styles.infoValue}>{currentAnalysis.author}</Text>
//               </View>

//               <View style={styles.infoBlock}>
//                 <Text style={styles.infoLabel}>Status:</Text>
//                 <Text style={styles.statusEmTratamento}>Em tratamento</Text>
//               </View>

//               <View style={styles.locationSection}>
//                 <Text style={styles.locationTitle}>Localização da amostra</Text>
//                 <View style={styles.locationListPlain}>
//                   <Text style={styles.locationItemPlain}>{currentAnalysis.location.talhao}</Text>
//                   <Text style={styles.locationItemPlain}>{currentAnalysis.location.tree}</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.linkText}>Alterar localização</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.reportSection}>
//                 <Text style={styles.reportTitle}>Escrever Relatório</Text>
//                 <TextInput
//                   style={styles.reportInput}
//                   placeholder="Adicione suas observações..."
//                   placeholderTextColor="#999"
//                   multiline
//                   value={reportText}
//                   onChangeText={setReportText}
//                 />
//                 <View style={styles.reportActions}>
//                   <TouchableOpacity>
//                     <Text style={styles.reportActionLink}>Editar relatório</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity>
//                     <Text style={styles.reportActionLink}>Exportar como PDF</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <Button
//                 title="Salvar no histórico"
//                 variant="primary"
//                 size="full"
//                 onPress={() => console.log("Salvar no histórico - Parte 2", { reportText, status })}
//               />
//             </View>
//           </CustomCard>

//           <BottomNavbar />
//         </ScrollView>
//       </SafeAreaView>
//     </Background>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#1A2C3E",
//   },

//   date: {
//     fontSize: 14,
//     color: "#666",
//   },

//   cardContent: {
//     padding: 20,
//     paddingTop: 370,
//     flex: 1,
//   },

//   resultTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1A2C3E",
//     marginBottom: 16,
//   },

//   analysisHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   analysisId: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1A2C3E",
//   },

//   analysisDate: {
//     fontSize: 14,
//     color: "#999",
//   },

//   infoBlock: {
//     flexDirection: "row",
//     marginBottom: 12,
//     alignItems: "center",
//   },

//   infoLabel: {
//     fontSize: 14,
//     color: "#666",
//     width: 130,
//   },

//   infoValue: {
//     fontSize: 14,
//     color: "#1A2C3E",
//     flex: 1,
//   },

//   infoValueBold: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#1A2C3E",
//     flex: 1,
//   },

//   divider: {
//     height: 1,
//     backgroundColor: "#E5E5E5",
//     marginVertical: 12,
//   },

//   bigDivider: {
//     height: 1,
//     backgroundColor: "#CCC",
//     marginVertical: 24,
//   },

//   statusAdd: {
//     fontSize: 14,
//     color: "#2196F3",
//     textDecorationLine: "underline",
//   },

//   statusValue: {
//     fontSize: 14,
//     color: "#4CAF50",
//   },

//   statusEmTratamento: {
//     fontSize: 14,
//     color: "#FF9800",
//   },

//   statusOptionsContainer: {
//     backgroundColor: "#F5F5F5",
//     borderRadius: 8,
//     marginTop: 4,
//     marginBottom: 8,
//     marginLeft: 130,
//     padding: 8,
//   },

//   statusOption: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },

//   statusOptionText: {
//     fontSize: 14,
//     color: "#1A2C3E",
//   },

//   locationSection: {
//     marginTop: 16,
//     marginBottom: 16,
//   },

//   locationTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1A2C3E",
//     marginBottom: 8,
//   },

//   locationList: {
//     marginBottom: 8,
//   },

//   locationListPlain: {
//     marginBottom: 8,
//   },

//   locationItem: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 4,
//   },

//   locationItemPlain: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 4,
//   },

//   linkText: {
//     fontSize: 14,
//     color: "#2196F3",
//     textDecorationLine: "underline",
//   },

//   reportSection: {
//     marginBottom: 20,
//   },

//   reportTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1A2C3E",
//     marginBottom: 8,
//   },

//   reportInput: {
//     backgroundColor: "#F5F5F5",
//     borderRadius: 8,
//     padding: 12,
//     minHeight: 80,
//     fontSize: 14,
//     color: "#1A2C3E",
//     textAlignVertical: "top",
//   },

//   reportActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 16,
//     marginTop: 8,
//   },

//   reportActionLink: {
//     fontSize: 12,
//     color: "#2196F3",
//     textDecorationLine: "underline",
//   },
// });