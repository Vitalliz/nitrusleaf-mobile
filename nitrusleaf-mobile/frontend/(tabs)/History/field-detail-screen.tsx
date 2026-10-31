import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import React, { useCallback, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { useAuth } from "@/contexts/AuthContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { useProperty } from "@/contexts/PropertyContext";
import {
  getTalhaoById,
  updateTalhao,
  deleteTalhao,
} from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { TalhaoEditModal } from "@/components/modals/talhao-edit-modal";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

function formatDisplayDate(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return "Sem data";
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = [
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
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function TalhaoDetailScreen() {
  const router = useRouter();
  const { talhaoId } = useLocalSearchParams<{ talhaoId?: string }>();
  const { user } = useAuth();
  const {
    selectedProperty,
    showPropertyPicker,
    canSwitchProperty,
    loading: propertyContextLoading,
  } = useProperty();

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [dbUser, setDbUser] = useState<any>(null);
  const [talhao, setTalhao] = useState<any>(null);
  const [arvores, setArvores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const filters = ["Todos", "Manganês", "Adversos"];

  const [editModalVisible, setEditModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadData() {
        if (!user?.id || !talhaoId) return;
        try {
          if (isActive) setLoading(true);
          const details = await getUsuarioDetails(user.id);
          if (isActive) setDbUser(details);

          const tInfo = await getTalhaoById(talhaoId);
          if (isActive) setTalhao(tInfo);

          const dbTrees = await getPesByTalhao(talhaoId);
          const mapped = dbTrees.map((tree) => {
            const defs = [];
            if (tree.deficienciaManganes) defs.push("Manganês");
            if (tree.outros) defs.push("Adversos");

            return {
              id: tree.id,
              name: tree.nome,
              deficiency: defs.length > 0 ? defs[0] : null,
              status: tree.situacao || "Sem-informações",
              date: formatDisplayDate(tree.createdAt),
            };
          });
          if (isActive) setArvores(mapped);
        } catch (err) {
          console.error("Erro ao carregar dados do talhão:", err);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      loadData();

      return () => {
        isActive = false;
      };
    }, [user?.id, talhaoId])
  );

  const filteredArvores = useMemo(() => {
    let result = arvores.filter((arvore) => {
      const matchesSearch = arvore.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesFilter =
        selectedFilter === "Todos" ||
        (arvore.deficiency && arvore.deficiency === selectedFilter);
      return matchesSearch && matchesFilter;
    });

    return result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name, undefined, { numeric: true })
        : b.name.localeCompare(a.name, undefined, { numeric: true });
    });
  }, [arvores, searchText, selectedFilter, sortOrder]);

  const handleBackPress = useCallback(() => {
    safeBack(router, ROUTES.history);
  }, [router]);

  const handleArvorePress = useCallback(
    (arvoreId: string) => {
      router.push({
        pathname: "/(tabs)/History/tree-detail-screen",
        params: { treeId: arvoreId },
      });
    },
    [router]
  );

  const handleAddArvore = useCallback(() => {
    if (talhaoId) {
      router.push({
        pathname: "/(tabs)/History/add-tree",
        params: { talhaoId, talhaoName: talhao?.name ?? "" },
      });
    }
  }, [talhaoId, talhao?.name, router]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const handleSaveTalhao = useCallback(
    async (newName: string) => {
      if (!talhaoId) return;
      await updateTalhao(talhaoId, { name: newName });
      setTalhao((prev: any) => ({ ...prev, name: newName }));
    },
    [talhaoId]
  );

  const handleDeleteTalhao = useCallback(async () => {
    if (!talhaoId) return;
    await deleteTalhao(talhaoId);
    safeBack(router, ROUTES.history);
  }, [talhaoId, router]);

  const renderStatusBadge = (status: string) => {
    if (status === "Tratado") {
      return (
        <View style={[styles.badge, styles.badgeTratado]}>
          <Ionicons name="checkmark" size={12} color={Palette.white} />
          <Text style={styles.badgeTextWhite}>Tratado</Text>
        </View>
      );
    }

    if (status === "Não-Tratado" || status === "Não tratado") {
      return (
        <View style={[styles.badge, styles.badgeNaoTratado]}>
          <Ionicons name="remove-circle-outline" size={12} color={Palette.white} />
          <Text style={styles.badgeTextWhite}>Não tratado</Text>
        </View>
      );
    }

    return (
      <View style={[styles.badge, styles.badgeSemInfo]}>
        <Ionicons name="remove-outline" size={12} color={Palette.textSecondary} />
        <Text style={styles.badgeTextGray}>Não informado</Text>
      </View>
    );
  };

  const renderArvoreItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.arvoreCard}
        activeOpacity={0.7}
        onPress={() => handleArvorePress(item.id)}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.arvoreName}>{item.name}</Text>

          <View style={styles.badgesRow}>
            {item.deficiency && (
              <View
                style={[
                  styles.badge,
                  item.deficiency === "Manganês"
                    ? styles.badgeManganes
                    : styles.badgeAdverso,
                ]}
              >
                <Text style={styles.badgeTextWhite}>{item.deficiency}</Text>
              </View>
            )}

            {renderStatusBadge(item.status)}
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Criado em: </Text>
            <Ionicons name="calendar-outline" size={12} color="#888" />
            <Text style={styles.dateValue}> {item.date}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#374151" />
      </TouchableOpacity>
    ),
    [handleArvorePress]
  );

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <StatusBar style="dark" />

        <Header
          userName={
            loading || propertyContextLoading
              ? "Carregando..."
              : dbUser?.fullName || user?.name || "Usuário"
          }
          userSubtitle={
            loading || propertyContextLoading
              ? "Carregando..."
              : selectedProperty?.name || "Sem propriedade"
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
            data={filteredArvores}
            renderItem={renderArvoreItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.titleRow}>
                  <TouchableOpacity
                    style={styles.backButtonCircle}
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={20} color={Palette.white} />
                  </TouchableOpacity>

                  <Text style={styles.talhaoTitle} numberOfLines={1}>
                    {talhao?.name || "Talhão"}
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

                <View style={styles.searchContainer}>
                  <TextInput
                    placeholder="Buscar árvore"
                    placeholderTextColor={Palette.textSecondary}
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                  />
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color="#888"
                    style={styles.searchIcon}
                  />
                </View>

                <TouchableOpacity
                  style={styles.cadastrarButton}
                  activeOpacity={0.85}
                  onPress={handleAddArvore}
                >
                  <Ionicons name="add" size={20} color={Palette.white} />
                  <Text style={styles.cadastrarButtonText}>Cadastrar Árvore</Text>
                </TouchableOpacity>

                <View style={styles.filtersSection}>
                  <Text style={styles.filtersTitle}>Filtros:</Text>
                  <View style={styles.filtersDivider} />
                  <View style={styles.filtersRow}>
                    {filters.map((filter) => {
                      const active = selectedFilter === filter;
                      return (
                        <TouchableOpacity
                          key={filter}
                          style={[
                            styles.filterChip,
                            active
                              ? styles.filterChipActive
                              : styles.filterChipInactive,
                          ]}
                          onPress={() => setSelectedFilter(filter)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.filterChipText,
                              active && styles.filterChipTextActive,
                            ]}
                          >
                            {filter}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.listSubHeader}>
                  <Text style={styles.listCount}>
                    {filteredArvores.length} Árvores cadastradas
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
                    <Text style={styles.sortText}>Ordenar</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            ListEmptyComponent={() => {
              const isFiltered =
                selectedFilter !== "Todos" || searchText.trim().length > 0;

              const emptyTitle = !isFiltered
                ? "Você ainda não cadastrou nenhuma árvore."
                : selectedFilter === "Manganês"
                ? "Nenhuma árvore com deficiência de Manganês"
                : selectedFilter === "Adversos"
                ? "Nenhuma árvore com adversos encontrada"
                : "Nenhuma árvore encontrada";

              const emptySubtitle = !isFiltered
                ? "Cadastre sua primeira árvore para começar a analisar!"
                : `Não há árvores com ${selectedFilter.toLowerCase()} registradas neste talhão.`;

              return (
                <View style={styles.emptyContainer}>
                  <Image
                    source={require("@/assets/images/empty-state-arvore.png")}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                  <Text style={styles.emptyText}>{emptySubtitle}</Text>
                </View>
              );
            }}
          />
        )}

        <BottomNavbar />

        <TalhaoEditModal
          visible={editModalVisible}
          talhaoName={talhao?.name ?? ""}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveTalhao}
          onDelete={handleDeleteTalhao}
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
    paddingTop: 12,
    paddingBottom: 40,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 4,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  talhaoTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginHorizontal: 12,
  },
  editButton: {
    padding: 4,
  },

  searchContainer: {
    position: "relative",
    width: "100%",
    height: 46,
    backgroundColor: Palette.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 40,
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
  },
  searchIcon: {
    position: "absolute",
    right: 14,
  },

  cadastrarButton: {
    width: "100%",
    height: 48,
    backgroundColor: Palette.primary,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  cadastrarButtonText: {
    color: Palette.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
  },

  filtersSection: {
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 10,
  },
  filtersDivider: {
    height: 1,
    backgroundColor: "#EEF0F2",
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: "#E5E7EB",
  },
  filterChipInactive: {
    backgroundColor: "#F3F4F6",
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  filterChipTextActive: {
    color: Palette.textPrimary,
    fontWeight: FontWeights.bold,
  },

  listSubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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

  arvoreCard: {
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
  arvoreName: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  badgeManganes: {
    backgroundColor: Palette.deficiencyManganese,
  },
  badgeAdverso: {
    backgroundColor: Palette.textSecondary,
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
    paddingVertical: 30,
    paddingHorizontal: 25,
    gap: 8,
    backgroundColor: Palette.white,
    marginVertical: 20,
    borderRadius: 16,
  },
  emptyImage: {
    width: 220,
    height: 160,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
});