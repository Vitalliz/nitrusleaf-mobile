// app/analysis/SummaryScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomCard } from "@/components/cards/card";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/tab-bar";

// Tipagem para os parâmetros
interface SummaryParams {
  analysisId: string;
  date: string;
  deficiency: "Cobre" | "Manganês";
  probability: number;
  author: string;
  talhao: string;
  tree: string;
}

export default function SummaryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as SummaryParams;

  // Estados
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  // Dados (usando params ou fallback)
  const analysisData = {
    id: params?.analysisId || "006",
    date: params?.date || "23 de Março de 2026",
    deficiency: params?.deficiency || "Cobre",
    probability: params?.probability || 92,
    author: params?.author || "Roberto Almeida",
    location: {
      talhao: params?.talhao || "Talhão 3",
      tree: params?.tree || "Árvore 6",
    },
  };

  const statusOptions = [
    {
      label: "Em tratamento",
      value: "treatment",
      color: "#FBBF24",
      bgColor: "#FEFCE8",
    },
    {
      label: "Concluído",
      value: "completed",
      color: "#58B741",
      bgColor: "#F0FDF4",
    },
    {
      label: "Pendente",
      value: "pending",
      color: "#9CA3AF",
      bgColor: "#F3F4F6",
    },
  ];

  const getStatusDisplay = () => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option;
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setShowStatusOptions(false);
  };

  const handleSave = useCallback(() => {
    if (!reportText.trim()) {
      Alert.alert("Aviso", "Adicione suas observações antes de salvar.");
      return;
    }

    console.log("Salvando análise:", {
      ...analysisData,
      status,
      report: reportText,
    });

    Alert.alert("Sucesso!", "Análise salva no histórico.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }, [reportText, status, analysisData, navigation]);

  const handleExportPDF = useCallback(() => {
    console.log("Exportando como PDF...");
    Alert.alert("PDF", "Exportando relatório...");
  }, []);

  const handleEditLocation = useCallback(() => {
    console.log("Alterar localização");
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Determina se os botões de relatório devem aparecer
  const showReportActions = status !== null;

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        {/* Header Customizado */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A2C3E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo da Análise</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Principal */}
          <CustomCard variant="red-large">
            <View style={styles.cardContent}>
              {/* Título */}
              <Text style={styles.mainTitle}>
                Resultado da análise por imagem
              </Text>

              {/* Análise ID e Data */}
              <View style={styles.analysisHeader}>
                <Text style={styles.analysisId}>Análise {analysisData.id}</Text>
                <Text style={styles.analysisDate}>{analysisData.date}</Text>
              </View>

              {/* Deficiência Detectada */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Deficiência detectada:</Text>
                <Text style={styles.infoValueBold}>
                  {analysisData.deficiency}
                </Text>
              </View>

              {/* Probabilidade */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>
                  Probabilidade estimada da IA:
                </Text>
                <Text style={styles.infoValueBold}>
                  {analysisData.probability}%
                </Text>
              </View>

              {/* Linha divisória */}
              <View style={styles.divider} />

              {/* Autor */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Autor da análise:</Text>
                <Text style={styles.infoValue}>{analysisData.author}</Text>
              </View>

              {/* Status */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Status:</Text>
                {status === null ? (
                  <TouchableOpacity
                    onPress={() => setShowStatusOptions(!showStatusOptions)}
                  >
                    <Text style={styles.addStatusText}>+ Adicionar status</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowStatusOptions(!showStatusOptions)}
                    style={styles.statusContainer}
                  >
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusDisplay()?.bgColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusDisplay()?.color },
                        ]}
                      >
                        {getStatusDisplay()?.label}
                      </Text>
                    </View>
                    <Ionicons name="chevron-down" size={16} color="#888" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Opções de Status (dropdown) */}
              {showStatusOptions && (
                <View style={styles.statusOptionsContainer}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.statusOption}
                      onPress={() => handleStatusChange(option.value)}
                    >
                      <View
                        style={[
                          styles.statusOptionBadge,
                          { backgroundColor: option.bgColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            { color: option.color },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Localização da amostra */}
              <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>Localização da amostra</Text>
                <View style={styles.locationList}>
                  <Text style={styles.locationItem}>
                    {analysisData.location.talhao}
                  </Text>
                  <Text style={styles.locationItem}>
                    {analysisData.location.tree}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleEditLocation}>
                  <Text style={styles.linkText}>Alterar localização</Text>
                </TouchableOpacity>
              </View>

              {/* Escrever Relatório */}
              <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Escrever Relatório</Text>
                <TextInput
                  style={styles.reportInput}
                  placeholder="Adicione suas observações..."
                  placeholderTextColor="#999"
                  multiline
                  value={reportText}
                  onChangeText={setReportText}
                />

                {/* Botões do relatório - só aparecem após adicionar status */}
                {showReportActions && (
                  <View style={styles.reportActions}>
                    <TouchableOpacity
                      onPress={() => console.log("Editar relatório")}
                    >
                      <Text style={styles.reportAction}>Editar relatório</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleExportPDF}>
                      <Text style={styles.reportAction}>Exportar como PDF</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Botão Salvar */}
              <Button
                title="Salvar no histórico"
                variant="primary"
                size="full"
                onPress={handleSave}
              />
            </View>
          </CustomCard>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A2C3E",
  },
  placeholder: {
    width: 40,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  cardContent: {
    width: "100%",
    paddingTop: 400,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 20,
  },
  analysisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  analysisId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2C3E",
  },
  analysisDate: {
    fontSize: 14,
    color: "#888",
  },
  infoBlock: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 160,
  },
  infoValue: {
    fontSize: 14,
    color: "#1A2C3E",
    flex: 1,
  },
  infoValueBold: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A2C3E",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  addStatusText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusOptionsContainer: {
    marginLeft: 160,
    marginBottom: 16,
    gap: 8,
  },
  statusOption: {
    paddingVertical: 4,
  },
  statusOptionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  locationSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A2C3E",
    marginBottom: 12,
  },
  locationList: {
    marginBottom: 8,
    gap: 4,
  },
  locationItem: {
    fontSize: 14,
    color: "#1A2C3E",
  },
  linkText: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "500",
  },
  reportSection: {
    marginBottom: 24,
  },
  reportInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    color: "#1A2C3E",
    textAlignVertical: "top",
    marginBottom: 12,
  },
  reportActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  reportAction: {
    fontSize: 13,
    color: "#6BC24A",
    fontWeight: "500",
  },
});
