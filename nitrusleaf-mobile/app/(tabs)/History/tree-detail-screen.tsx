import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { CustomCard } from "@/components/cards/card";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { useProperty } from "@/contexts/PropertyContext";
import { getPeById, updatePe, deletePe } from "@/repositories/peRepository";
import { getRelatoriosByPe } from "@/repositories/relatorioRepository";
import { syncTalhaoStatsFromPes } from "@/services/syncTalhaoStats";
import { ArvoreEditModal } from "@/components/modals/arvore-edit-modal";
import AnalysisCard, { AnalysisData } from "@/components/cards/analysis-card";
import { mapRelatorioToAnalysisData } from "@/utils/relatorioDisplay";

export default function HistoryTreeScreen() {
  const { treeId } = useLocalSearchParams<{ treeId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const { selectedProperty } = useProperty();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dbUser, setDbUser] = useState<any>(null);
  const [arvore, setArvore] = useState<any>(null);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTratado, setSavingTratado] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const reloadTreeData = useCallback(async () => {
    if (!user?.id || !treeId) return;
    const details = await getUsuarioDetails(user.id);
    setDbUser(details);

    const tree = await getPeById(treeId);
    setArvore(tree);

    const relatorios = await getRelatoriosByPe(treeId);
    setAnalyses(
      relatorios.map((r) => mapRelatorioToAnalysisData(r, tree?.situacao))
    );
  }, [user?.id, treeId]);

  const loadData = useCallback(async () => {
    if (!user?.id || !treeId) return;
    try {
      setLoading(true);
      await reloadTreeData();
    } catch (err) {
      console.error("Erro ao carregar árvore:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, treeId, reloadTreeData]);

  React.useEffect(() => {
    if (isFocused) void loadData();
  }, [isFocused, loadData]);

  const sortedAnalyses = useMemo(() => {
    return [...analyses].sort((a, b) => {
      const nA = parseInt(a.id, 10);
      const nB = parseInt(b.id, 10);
      return sortOrder === "asc" ? nA - nB : nB - nA;
    });
  }, [analyses, sortOrder]);

  const handleBack = useCallback(() => {
    safeBack(router, ROUTES.history);
  }, [router]);

  const handleViewAnalysis = useCallback(
    (analysis: AnalysisData) => {
      router.push({
        pathname: ROUTES.analysisSummary,
        params: {
          analysisId: analysis.id,
          probability: String(analysis.probability ?? 0),
          deficiencyType: analysis.deficiencyType ?? "",
          returnTo: treeId
            ? `/(tabs)/History/tree-detail-screen?treeId=${treeId}`
            : ROUTES.history,
        },
      });
    },
    [router, treeId]
  );

  const handleMarkAsTratado = useCallback(async () => {
    if (!treeId) return;
    setSavingTratado(true);
    try {
      await updatePe(treeId, { situacao: "Tratado" });
      if (arvore?.talhaoId) {
        try {
          await syncTalhaoStatsFromPes(arvore.talhaoId);
        } catch (syncErr) {
          console.warn("Sync talhão:", syncErr);
        }
      }
      await reloadTreeData();
      Alert.alert("Sucesso", "Árvore marcada como tratada.");
    } catch (err) {
      console.error("Erro ao marcar como tratado:", err);
      const msg =
        err instanceof Error ? err.message : "Não foi possível atualizar o status.";
      Alert.alert("Erro", msg);
    } finally {
      setSavingTratado(false);
    }
  }, [treeId, arvore?.talhaoId, reloadTreeData]);

  const handleVerAnalisePress = useCallback(
    (analysis: AnalysisData) => {
      Alert.alert(analysis.label, "O que deseja fazer?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Definir como tratado",
          onPress: () => void handleMarkAsTratado(),
        },
        {
          text: "Ver análise novamente",
          onPress: () => handleViewAnalysis(analysis),
        },
      ]);
    },
    [handleMarkAsTratado, handleViewAnalysis]
  );

  const handleSaveArvore = useCallback(
    async (newName: string) => {
      if (!treeId) return;
      await updatePe(treeId, { nome: newName });
      setArvore((prev: any) => ({ ...prev, nome: newName }));
    },
    [treeId]
  );

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
          userName={
            loading ? "Carregando..." : dbUser?.fullName || user?.name || "Usuário"
          }
          userSubtitle={
            loading ? "Carregando..." : selectedProperty?.name || "Sem propriedade"
          }
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
                  <View style={styles.titleRow}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={handleBack}
                    >
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
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#58B741"
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: 40 }} />
                  </View>

                  <View style={styles.listHeader}>
                    <Text style={styles.listCount}>
                      {sortedAnalyses.length} Análises realizadas
                    </Text>
                    <TouchableOpacity
                      style={styles.sortButton}
                      onPress={() =>
                        setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                      }
                    >
                      <Text style={styles.sortText}>Ordenar</Text>
                      <Ionicons
                        name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                        size={14}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {savingTratado && (
                    <ActivityIndicator
                      size="small"
                      color="#6BC24A"
                      style={styles.savingIndicator}
                    />
                  )}

                  {sortedAnalyses.length === 0 ? (
                    <Text style={styles.emptyAnalyses}>
                      Nenhuma análise salva para esta árvore. Use o scan na aba IA e
                      vincule ao pé no resumo técnico.
                    </Text>
                  ) : (
                    sortedAnalyses.map((analysis) => (
                      <AnalysisCard
                        key={analysis.id}
                        analysis={analysis}
                        onVerAnalise={() => handleVerAnalisePress(analysis)}
                      />
                    ))
                  )}
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
  scrollContent: { padding: 16, paddingBottom: 80 },
  cardContent: { padding: 16 },
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
  savingIndicator: { marginBottom: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyAnalyses: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingVertical: 16,
  },
});
