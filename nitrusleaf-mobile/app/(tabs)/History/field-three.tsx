import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomCard } from "@/components/cards/card";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";

interface AnalysisData {
  id: string;
  status: "Tratado" | "Em tratamento";
  date: string;
}

// Dados mock
const analysesData: AnalysisData[] = [
  { id: "#06", status: "Em tratamento", date: "10 Nov, 2025" },
  { id: "#05", status: "Tratado", date: "10 Nov, 2025" },
  { id: "#04", status: "Tratado", date: "10 Nov, 2025" },
  { id: "#03", status: "Tratado", date: "10 Nov, 2025" },
  { id: "#02", status: "Tratado", date: "10 Nov, 2025" },
];

// Componente StatusBadge
const StatusBadge = ({ status }: { status: AnalysisData["status"] }) => {
  const config = {
    "Em tratamento": {
      bg: "#FBBF24",
      text: "#92400E",
      icon: "time-outline",
      label: "Em tratamento",
    },
    Tratado: {
      bg: "#10B981",
      text: "#FFFFFF",
      icon: "checkmark-done-outline",
      label: "Tratado",
    },
  };

  const { bg, text, icon, label } = config[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Ionicons name={icon as any} size={14} color={text} />
      <Text style={[styles.statusText, { color: text }]}>{label}</Text>
    </View>
  );
};

// Componente AnalysisCard
const AnalysisCard = React.memo(
  ({
    analysis,
    onPress,
    isFirst,
  }: {
    analysis: AnalysisData;
    onPress: () => void;
    isFirst: boolean;
  }) => {
    // Apenas o primeiro card (#06 - Em tratamento) tem background #FFF9F0
    const bgColor =
      isFirst && analysis.status === "Em tratamento" ? "#FFF9F0" : "#FFFFFF";

    return (
      <TouchableOpacity
        style={[
          styles.analysisCard,
          { backgroundColor: bgColor },
          // Apenas cards brancos têm borda
          !(isFirst && analysis.status === "Em tratamento") &&
            styles.whiteCardBorder,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={`Ver detalhes da ${analysis.id}`}
        accessibilityHint={`Toque para ver análise ${analysis.id}`}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.analysisId}>{analysis.id}</Text>
          <StatusBadge status={analysis.status} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text style={styles.dateText}>Criado em: {analysis.date}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  },
);

// Tela Principal
export default function HistoryTreeScreen() {
  const { treeId } = useLocalSearchParams<{ treeId: string }>();
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [menuVisible, setMenuVisible] = useState(false);

  const sortedAnalyses = useMemo(() => {
    const sorted = [...analysesData];
    return sorted.sort((a, b) => {
      const idA = parseInt(a.id.replace("#", ""));
      const idB = parseInt(b.id.replace("#", ""));
      return sortOrder === "asc" ? idA - idB : idB - idA;
    });
  }, [analysesData, sortOrder]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleAnalysisPress = useCallback(
    (analysisId: string) => {
      router.push({
        pathname: "/AI/analysis-summary",
        params: { id: analysisId.replace("#", "") },
      });
    },
    [router],
  );

  const handleSort = useCallback(() => {
    console.log("Ordenar análises");
  }, []);

  const handleMenuPress = useCallback(() => {
    setMenuVisible(!menuVisible);
    console.log("Menu aberto");
  }, [menuVisible]);

  const renderAnalysisItem = useCallback(
    ({ item, index }: { item: AnalysisData; index: number }) => (
      <AnalysisCard
        analysis={item}
        onPress={() => handleAnalysisPress(item.id)}
        isFirst={index === 0}
      />
    ),
    [handleAnalysisPress],
  );

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FEF3C7" />

        <View style={styles.container}>
          {/* HEADER SUPERIOR COM PERFIL DO USUÁRIO */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Botão voltar e título */}
            <View style={styles.headerSection}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                accessibilityLabel="Voltar para talhão"
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Árvore #{treeId?.padStart(2, "0") || "01"}
              </Text>
            </View>

            {/* Contagem e Ordenação */}
            <View style={styles.listHeader}>
              <Text style={styles.countText}>
                {sortedAnalyses.length} Análises realizadas
              </Text>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={handleSort}
                accessibilityLabel="Ordenar análises"
              >
                <Ionicons
                  name="reorder-three-outline"
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.sortText}>Ordenar</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de Análises - CORRIGIDO: usando bottomContent */}
            <CustomCard
              variant="white-large-feet"
              bottomContent={
                <View style={styles.cardContent}>
                  <FlatList
                    data={sortedAnalyses}
                    renderItem={renderAnalysisItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={3}
                    removeClippedSubviews={true}
                  />
                </View>
              }
            />
          </ScrollView>
        </View>

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
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  // Profile Header Styles
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FEF3C7",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileText: {
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userLocation: {
    fontSize: 13,
    color: "#888",
  },
  menuButton: {
    padding: 4,
  },
  // Header Section (Back button + Title)
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  // List Header (Count + Sort)
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  sortText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  // Card Content
  cardContent: {
    padding: 16,
  },
  // Analysis Card Styles
  analysisCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  whiteCardBorder: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  analysisId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
