import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { CustomCard } from "@/components/cards/card";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getPeById, updatePe, deletePe } from "@/repositories/peRepository";
import { getAnalisesByPe } from "@/repositories/analiseRepository";
import { ArvoreEditModal } from "@/components/modals/arvore-edit-modal";

interface AnalysisData {
  id: string;
  label: string;
  status: "Tratado" | "Em tratamento" | "Não tratado" | string;
  date: string;
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    "Em tratamento": { bg: "#FBBF24", text: "#92400E", icon: "time-outline" },
    Tratado:         { bg: "#10B981", text: "#FFFFFF", icon: "checkmark-done-outline" },
    "Não tratado":   { bg: "#F44336", text: "#FFFFFF", icon: "close-circle-outline" },
    "Não-Tratado":   { bg: "#F44336", text: "#FFFFFF", icon: "close-circle-outline" },
  };

  const { bg, text, icon } = config[status] ?? {
    bg: "#9E9E9E", text: "#FFFFFF", icon: "help-circle-outline",
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Ionicons name={icon as any} size={14} color={text} />
      <Text style={[styles.statusText, { color: text }]}>{status}</Text>
    </View>
  );
};

// ── AnalysisCard ──────────────────────────────────────────────────────────────
const AnalysisCard = React.memo(({
    analysis,
    onPress,
  }: {
    analysis: AnalysisData;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={styles.analysisCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.analysisLabel}>{analysis.label}</Text>
        <StatusBadge status={analysis.status} />
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Criado em:</Text>
          <Ionicons name="calendar-outline" size={14} color="#777" />
          <Text style={styles.dateText}>{analysis.date}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#757575" />
      </View>
    </TouchableOpacity>
));

AnalysisCard.displayName = "AnalysisCard";

// ── Tela Principal ────────────────────────────────────────────────────────────
export default function HistoryTreeScreen() {
  const { treeId } = useLocalSearchParams<{ treeId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dbUser, setDbUser] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [arvore, setArvore] = useState<any>(null);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user?.id || !treeId) return;
      try {
        setLoading(true);
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);

        const props = await getPropertiesByUser(user.id);
        if (props?.length > 0) setProperty(props[0]);

        const tree = await getPeById(treeId);
        setArvore(tree);

        // Substitua por seu repositório real de análises
        // const dbAnalyses = await getAnalisesByPe(treeId);
        // setAnalyses(dbAnalyses.map(...));

        // Mock enquanto não há repositório:
        setAnalyses([
          { id: "06", label: "Análise #06", status: "Em tratamento", date: "10 Nov, 2025" },
          { id: "05", label: "Análise #05", status: "Tratado",        date: "10 Nov, 2025" },
          { id: "04", label: "Análise #04", status: "Tratado",        date: "10 Nov, 2025" },
          { id: "03", label: "Análise #03", status: "Tratado",        date: "10 Nov, 2025" },
          { id: "02", label: "Análise #02", status: "Tratado",        date: "10 Nov, 2025" },
        ]);
      } catch (err) {
        console.error("Erro ao carregar árvore:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isFocused) void loadData();
  }, [user, treeId, isFocused]);

  const sortedAnalyses = useMemo(() => {
    return [...analyses].sort((a, b) => {
      const nA = parseInt(a.id), nB = parseInt(b.id);
      return sortOrder === "asc" ? nA - nB : nB - nA;
    });
  }, [analyses, sortOrder]);

  const handleBack = useCallback(() => {
    safeBack(router, ROUTES.history);
  }, [router]);

  const handleAnalysisPress = useCallback((analysisId: string) => {
    router.push({
      pathname: ROUTES.analysisSummary,
      params: { analysisId, returnTo: treeId ? `/(tabs)/History/tree-detail-screen?treeId=${treeId}` : ROUTES.history },
    });
  }, [router, treeId]);

  const handleSaveArvore = useCallback(async (newName: string) => {
    if (!treeId) return;
    await updatePe(treeId, { nome: newName });
    setArvore((prev: any) => ({ ...prev, nome: newName }));
  }, [treeId]);

  const handleDeleteArvore = useCallback(async () => {
    if (!treeId) return;
    await deletePe(treeId);
    safeBack(router, ROUTES.history);
  }, [treeId, router]);

  const treeName = arvore?.nome || `Árvore #${String(treeId).padStart(2, "0")}`;

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <Header
          userName={loading ? "Carregando..." : (dbUser?.fullName || user?.name || "Usuário")}
          userSubtitle={loading ? "Carregando..." : (property?.name || "Sem propriedade")}
          userAvatar={dbUser?.avatarUrl || DEFAULT_AVATAR}
          subtitleIcon="location-outline"
          onMenuPress={() => {}}
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <CustomCard
              variant="white"
              bottomContent={
                <View style={styles.cardContent}>

                  {/* Título + voltar + editar */}
                  <View style={styles.titleRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                      <Ionicons name="arrow-back" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <View style={styles.titleCenter}>
                      <Text style={styles.title} numberOfLines={1}>
                        {treeName}
                      </Text>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setEditModalVisible(true)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="create-outline" size={20} color="#58B741" />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: 40 }} />
                  </View>

                  {/* Header da lista */}
                  <View style={styles.listHeader}>
                    <Text style={styles.listCount}>
                      {sortedAnalyses.length} Análises realizadas
                    </Text>
                    <TouchableOpacity
                      style={styles.sortButton}
                      onPress={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
                    >
                      <Text style={styles.sortText}>Ordenar</Text>
                      <Ionicons
                        name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                        size={14}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Cards de análise */}
                  {sortedAnalyses.map((analysis) => (
                    <AnalysisCard
                      key={analysis.id}
                      analysis={analysis}
                      onPress={() => handleAnalysisPress(analysis.id)}
                    />
                  ))}

                </View>
              }
            />
          </ScrollView>
        )}

        <BottomNavbar />

        <ArvoreEditModal
          visible={editModalVisible}
          arvoreName={treeName}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveArvore}
          onDelete={handleDeleteArvore}
        />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },

  cardContent: { padding: 16 },

  // Título
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  titleCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2C3E",
    flexShrink: 1,
  },
  editButton: { padding: 4 },
  backButton: {
    padding: 8,
    backgroundColor: "#58B741",
    borderRadius: 500,
  },

  // Header da lista
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  listCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2C3E",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: { fontSize: 12, color: "#666" },

  // Analysis Card — mesmo padrão do ArvoreCard
  analysisCard: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  analysisLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },
  dateText: {
    fontSize: 14,
    color: "#777",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});