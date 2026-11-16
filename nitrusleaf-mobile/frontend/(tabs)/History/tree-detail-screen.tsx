import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { useProperty } from "@/contexts/PropertyContext";
import { getPeById, updatePe, deletePe } from "@/repositories/peRepository";
import { getRelatoriosByPe } from "@/repositories/relatorioRepository";
import { ArvoreEditModal } from "@/components/modals/arvore-edit-modal";
import { mapRelatorioToAnalysisData } from "@/utils/relatorioDisplay";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import { useLanguage } from "@/i18n/LanguageContext";

function formatDisplayDate(dateStr?: string | Date, isEn = false): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return isEn ? "No date" : "Sem data";
  const day = String(d.getDate()).padStart(2, "0");
  const monthNamesPt = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const monthNamesEn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = isEn ? monthNamesEn[d.getMonth()] : monthNamesPt[d.getMonth()];
  const year = d.getFullYear();
  return isEn ? `${month} ${day}, ${year}` : `${day} ${month}, ${year}`;
}

export default function HistoryTreeScreen() {
  const { treeId } = useLocalSearchParams<{ treeId: string }>();
  const router = useRouter();
  const { t, isEn } = useLanguage();
  const { user } = useAuth();
  const {
    selectedProperty,
    showPropertyPicker,
    canSwitchProperty,
    loading: propertyContextLoading,
  } = useProperty();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dbUser, setDbUser] = useState<any>(null);
  const [arvore, setArvore] = useState<any>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const loadData = useCallback(async () => {
    if (!user?.id || !treeId) return;
    try {
      setLoading(true);
      const details = await getUsuarioDetails(user.id);
      setDbUser(details);

      const tree = await getPeById(treeId);
      setArvore(tree);

      const relatorios = await getRelatoriosByPe(treeId);
      const mapped = relatorios.map((r: any) => {
        const itemData = mapRelatorioToAnalysisData(r, tree?.situacao);
        return {
          ...itemData,
          rawDate: r.createdAt || r.data,
          displayDate: formatDisplayDate(r.createdAt || r.data, isEn),
        };
      });
      setAnalyses(mapped);
    } catch (err) {
      console.error("Erro ao carregar árvore e análises:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, treeId, isEn]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const sortedAnalyses = useMemo(() => {
    return [...analyses].sort((a, b) => {
      const nA = parseInt(a.id, 10);
      const nB = parseInt(b.id, 10);
      if (!isNaN(nA) && !isNaN(nB)) {
        return sortOrder === "asc" ? nA - nB : nB - nA;
      }
      return sortOrder === "asc"
        ? String(a.id).localeCompare(String(b.id))
        : String(b.id).localeCompare(String(a.id));
    });
  }, [analyses, sortOrder]);

  const handleBack = useCallback(() => {
    safeBack(router, ROUTES.history);
  }, [router]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const handleViewAnalysis = useCallback(
    (analysis: any) => {
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
      showAlert(
        isEn ? "Success" : "Sucesso",
        isEn ? "The tree name was updated." : "O nome da árvore foi alterado.",
        "success"
      );
    },
    [treeId, showAlert, isEn]
  );

  const handleDeleteArvore = useCallback(async () => {
    if (!treeId) return;
    await deletePe(treeId);
    safeBack(router, ROUTES.history);
  }, [treeId, router]);

  const renderStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || "";

    if (s.includes("tratamento") || s.includes("andamento")) {
      return (
        <View style={[styles.badge, styles.badgeEmTratamento]}>
          <Ionicons name="time-outline" size={13} color={Palette.white} />
          <Text style={styles.badgeTextWhite}>{t("status_in_treatment")}</Text>
        </View>
      );
    }

    if (s === "tratado") {
      return (
        <View style={[styles.badge, styles.badgeTratado]}>
          <Ionicons name="checkmark" size={13} color={Palette.white} />
          <Text style={styles.badgeTextWhite}>{t("status_treated")}</Text>
        </View>
      );
    }

    if (s.includes("não-tratado") || s.includes("não tratado")) {
      return (
        <View style={[styles.badge, styles.badgeNaoTratado]}>
          <Ionicons name="remove-circle-outline" size={13} color={Palette.white} />
          <Text style={styles.badgeTextWhite}>{t("status_untreated")}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.badgeSemInfo]}>
        <Ionicons name="remove-outline" size={13} color={Palette.textSecondary} />
        <Text style={styles.badgeTextGray}>{t("status_unknown")}</Text>
      </View>
    );
  };

  const renderAnalysisCard = useCallback(
    ({ item }: { item: any }) => {
      const numId = parseInt(item.id, 10);
      const title = !isNaN(numId)
        ? `${t("summary_analysis_title")} #${String(numId).padStart(2, "0")}`
        : item.title || `${t("summary_analysis_title")} #${item.id}`;

      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => handleViewAnalysis(item)}
        >
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{title}</Text>

            <View style={styles.badgesRow}>
              {renderStatusBadge(item.status || arvore?.situacao)}
            </View>

            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>{isEn ? "Created at: " : "Criado em: "}</Text>
              <Ionicons name="calendar-outline" size={12} color="#888" />
              <Text style={styles.dateValue}> {item.displayDate}</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#374151" />
        </TouchableOpacity>
      );
    },
    [arvore?.situacao, handleViewAnalysis, isEn, t]
  );

  const treeName =
    arvore?.nome ||
    (isEn
      ? `Tree #${String(treeId).padStart(2, "0")}`
      : `Árvore #${String(treeId).padStart(2, "0")}`);

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <StatusBar style="dark" />

        <Header
          userName={
            loading || propertyContextLoading
              ? "..."
              : dbUser?.fullName || user?.name || "Usuário"
          }
          userSubtitle={
            loading || propertyContextLoading
              ? "..."
              : selectedProperty?.name || t("common_no_property")
          }
          userAvatar={dbUser?.avatarUrl}
          subtitleIcon="location-outline"
          onPropertyPress={showPropertyPicker}
          showPropertyChevron={canSwitchProperty}
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.primary} />
          </View>
        ) : (
          <FlatList
            data={sortedAnalyses}
            renderItem={renderAnalysisCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.titleRow}>
                  <TouchableOpacity
                    style={styles.backButtonCircle}
                    onPress={handleBack}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={20} color={Palette.white} />
                  </TouchableOpacity>

                  <Text style={styles.treeTitle} numberOfLines={1}>
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
                      color={Palette.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.listSubHeader}>
                  <Text style={styles.listCount}>
                    {sortedAnalyses.length}{" "}
                    {sortedAnalyses.length === 1
                      ? isEn
                        ? "Analysis performed"
                        : "Análise realizada"
                      : isEn
                        ? "Analyses performed"
                        : "Análises realizadas"}
                  </Text>

                  <TouchableOpacity
                    style={styles.sortButton}
                    activeOpacity={0.7}
                    onPress={handleSortToggle}
                  >
                    <Ionicons
                      name="reorder-three-outline"
                      size={18}
                      color="#374151"
                    />
                    <Text style={styles.sortText}>{t("history_sort")}</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={48} color={Palette.borderDisabled} />
                <Text style={styles.emptyTitle}>
                  {isEn
                    ? "No analysis saved for this tree."
                    : "Nenhuma análise salva para esta árvore."}
                </Text>
                <Text style={styles.emptyText}>
                  {isEn
                    ? "Use the Camera tab below to photograph and start a new analysis."
                    : "Use a Câmera na aba inferior para fotografar e iniciar uma nova análise."}
                </Text>
              </View>
            }
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  treeTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginHorizontal: 12,
  },
  editButton: {
    padding: 4,
  },

  listSubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  listCount: {
    fontSize: 13,
    fontWeight: FontWeights.medium,
    color: Palette.textSecondary,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
    color: "#374151",
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeEmTratamento: {
    backgroundColor: "#E5A93C",
  },
  badgeTratado: {
    backgroundColor: Palette.primary,
  },
  badgeNaoTratado: {
    backgroundColor: Palette.error,
  },
  badgeSemInfo: {
    backgroundColor: "#F3F4F6",
  },
  badgeTextWhite: {
    color: Palette.white,
    fontSize: 11,
    fontWeight: FontWeights.semiBold,
  },
  badgeTextGray: {
    color: Palette.textSecondary,
    fontSize: 11,
    fontWeight: FontWeights.medium,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  dateValue: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
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
  emptyTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});