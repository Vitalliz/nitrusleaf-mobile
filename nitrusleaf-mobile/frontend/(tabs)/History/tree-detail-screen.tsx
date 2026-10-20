import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
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
} from "react-native";

import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { CustomAlert, AlertType } from "@/components/ui/alert";
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
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function HistoryTreeScreen() {
  const { treeId } = useLocalSearchParams<{ treeId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { selectedProperty } = useProperty();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dbUser, setDbUser] = useState<any>(null);
  const [arvore, setArvore] = useState<any>(null);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTratado, setSavingTratado] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: AlertType;
    onCloseAction?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = useCallback(
    (title: string, message: string, type: AlertType = "info", onCloseAction?: () => void) => {
      setAlertConfig({ visible: true, title, message, type, onCloseAction });
    },
    []
  );

  const handleCloseAlert = useCallback(() => {
    const action = alertConfig.onCloseAction;
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (action) action();
  }, [alertConfig.onCloseAction]);

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

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

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

  const handleSaveArvore = useCallback(
    async (newName: string) => {
      if (!treeId) return;
      await updatePe(treeId, { nome: newName });
      setArvore((prev: any) => ({ ...prev, nome: newName }));
      showAlert("Sucesso", "O nome da árvore foi alterado.", "success");
    },
    [treeId, showAlert]
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
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        <Header
          userName={
            loading ? "Carregando..." : dbUser?.fullName || user?.name || "Usuário"
          }
          userSubtitle={
            loading ? "Carregando..." : selectedProperty?.name || "Sem propriedade"
          }
          userAvatar={dbUser?.avatarUrl || DEFAULT_AVATAR}
          subtitleIcon="location-outline"
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.primary} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header da Árvore */}
            <View style={styles.titleRow}>
              <TouchableOpacity
                style={styles.backButtonCircle}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={20} color={Palette.white} />
              </TouchableOpacity>

              <Text style={styles.title} numberOfLines={1}>
                {treeName}
              </Text>

              {/* Ícone de edição original mantido */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={Palette.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Cabeçalho da Lista de Análises */}
            <View style={styles.listHeader}>
              <Text style={styles.listCount}>
                {sortedAnalyses.length} Análises realizadas
              </Text>
              <TouchableOpacity
                style={styles.sortButton}
                activeOpacity={0.7}
                onPress={() =>
                  setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                }
              >
                <Ionicons
                  name="reorder-three-outline"
                  size={18}
                  color={Palette.textPrimary}
                />
                <Text style={styles.sortText}>Ordenar</Text>
              </TouchableOpacity>
            </View>

            {savingTratado && (
              <ActivityIndicator
                size="small"
                color={Palette.primary}
                style={styles.savingIndicator}
              />
            )}

            {/* Lista de Análises */}
            {sortedAnalyses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={48} color={Palette.borderDisabled} />
                <Text style={styles.emptyAnalyses}>
                  Nenhuma análise salva para esta árvore.
                </Text>
                <Text style={styles.emptyAnalysesSub}>
                  Use a Câmera na aba inferior para fotografar e iniciar um novo relatório.
                </Text>
              </View>
            ) : (
              sortedAnalyses.map((analysis) => (
                <AnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  onVerAnalise={() => handleViewAnalysis(analysis)}
                />
              ))
            )}
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

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={handleCloseAlert}
        />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listCount: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Palette.textSecondary,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surfaceGray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  sortText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
  },
  savingIndicator: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: Palette.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    borderStyle: "dashed",
    marginTop: 10,
  },
  emptyAnalyses: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  emptyAnalysesSub: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});