import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import React, { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { CustomCard } from "@/components/cards/card";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getTalhaoById, updateTalhao, deleteTalhao } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { Input } from "@/components/ui/input";
import { TalhaoEditModal } from "@/components/modals/talhao-edit-modal";

export default function TalhaoDetailScreen() {
  const router = useRouter();
  const { talhaoId } = useLocalSearchParams<{ talhaoId?: string }>();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [dbUser, setDbUser] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [talhao, setTalhao] = useState<any>(null);
  const [arvores, setArvores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const filters = ["Todos", "Manganês", "Cobre", "Adversos"];

  // ── Modal ──
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user?.id || !talhaoId) return;
      try {
        setLoading(true);
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);

        const props = await getPropertiesByUser(user.id);
        if (props && props.length > 0) {
          setProperty(props[0]);
        }

        const tInfo = await getTalhaoById(talhaoId);
        setTalhao(tInfo);

        const dbTrees = await getPesByTalhao(talhaoId);
        const mapped = dbTrees.map(tree => {
          const defs = [];
          if (tree.deficienciaCobre) defs.push("Cobre");
          if (tree.deficienciaManganes) defs.push("Manganês");
          if (tree.outros) defs.push("Outros");

          const dateStr = tree.createdAt
            ? new Date(tree.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Sem data';

          return {
            id: tree.id,
            name: tree.nome,
            deficiency: defs.length > 0 ? defs.join(", ") : null,
            status: tree.situacao || "Sem-informações",
            date: dateStr,
          };
        });
        setArvores(mapped);
      } catch (err) {
        console.error("Erro ao carregar dados do talhão:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isFocused) {
      void loadData();
    }
  }, [user, talhaoId, isFocused]);

  const filteredArvores = arvores.filter((arvore) => {
    const matchesSearch = arvore.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesFilter =
      selectedFilter === "Todos" ||
      (arvore.deficiency &&
        arvore.deficiency.includes(selectedFilter));

    return matchesSearch && matchesFilter;
  });

  const sortedArvores = [...filteredArvores].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    return sortOrder === "asc" ? numA - numB : numB - numA;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tratado":       return "#4CAF50";
      case "Não-Tratado":
      case "Não tratado":   return "#F44336";
      case "Em tratamento": return "#FF9800";
      default:              return "#9E9E9E";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Tratado":       return "#E8F5E9";
      case "Não-Tratado":
      case "Não tratado":   return "#FFEBEE";
      case "Em tratamento": return "#FFF3E0";
      default:              return "#F5F5F5";
    }
  };

  const handleBackPress = useCallback(() => {
    safeBack(router, ROUTES.history);
  }, [router]);

  const handleArvorePress = useCallback(
    (arvoreId: string) => {
      router.push({
        pathname: "/(tabs)/History/field-three",
        params: { treeId: arvoreId },
      });
    },
    [router],
  );

  const handleAddArvore = useCallback(() => {
    if (talhaoId) {
      router.push({
        pathname: "/(tabs)/History/add-tree",
        params: { talhaoId, talhaoName: talhao?.name ?? "" },
      });
    }
  }, [talhaoId, talhao?.name, router]);

  const handleVerAnalises = useCallback(() => {
    router.push("/(tabs)/AI/home");
  }, [router]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // ── Handlers do modal ──
  const handleSaveTalhao = useCallback(async (newName: string) => {
    if (!talhaoId) return;
    await updateTalhao(talhaoId, { name: newName });
    setTalhao((prev: any) => ({ ...prev, name: newName }));
  }, [talhaoId]);

  const handleDeleteTalhao = useCallback(async () => {
    if (!talhaoId) return;
    await deleteTalhao(talhaoId);
    safeBack(router, ROUTES.history);
  }, [talhaoId, router]);

  // ─── Barra de título (botão voltar + nome do talhão + lápis) ─────────────
  const renderTitleRow = () => (
    <View style={[styles.titleRow, { paddingHorizontal: 12, paddingTop: 25 }]}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.titleCenter}>
        <Text style={styles.title} numberOfLines={1}>
          {talhao?.name || "Talhão"}
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
  );

  // ─── Empty State ──────────────────────────────────────────────────────────
  const renderEmptyFullScreen = () => (
    <View style={styles.emptyFullScreen}>
      {renderTitleRow()}
      <View style={styles.emptyContent}>
        <Image
          source={require("@/assets/images/empty-state-arvore.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>
          Você ainda não cadastrou nenhuma árvore.
        </Text>
        <Text style={styles.emptyText}>
          Cadastre sua primeira árvore para começar a analisar!
        </Text>
        <View style={styles.emptyButtonContainer}>
          <Button
            title="Cadastrar Árvore"
            variant="primary"
            size="full"
            icon="add-circle-outline"
            onPress={handleAddArvore}
          />
        </View>
      </View>
    </View>
  );

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <Header
          userName={loading ? "Carregando..." : (dbUser?.fullName || user?.name || "Usuário")}
          userSubtitle={loading ? "Carregando..." : (property?.name || "Sem propriedade")}
          userAvatar={dbUser?.avatarUrl || DEFAULT_AVATAR}
          subtitleIcon="location-outline"
          onMenuPress={() => console.log("Menu pressed")}
          onAvatarPress={() => router.push("/(tabs)/Settings/profile")}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : arvores.length === 0 ? (
          <View style={styles.emptyWrapper}>
            {renderEmptyFullScreen()}
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            {/* Título com lápis */}
            <View style={styles.titleRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>

              <View style={styles.titleCenter}>
                <Text style={styles.title} numberOfLines={1}>
                  {talhao?.name || "Talhão"}
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

            <CustomCard
              variant="white-large"
              bottomContent={
                <View style={styles.cardContent}>
                  <View style={styles.searchContainer}>
                    <Input
                      placeholder="Buscar árvore"
                      value={searchText}
                      onChangeText={setSearchText}
                      rightIcon="search-outline"
                      size="full"
                    />
                    <Button
                      title="Cadastrar Árvore"
                      variant="primary"
                      size="full"
                      icon="add-circle-outline"
                      onPress={handleAddArvore}
                    />
                  </View>

                  {/* Filtros */}
                  <View style={styles.filtersContainer}>
                    <Text style={styles.filtersTitle}>Filtros:</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filtersRow}
                    >
                      {filters.map((filter) => {
                        const active = selectedFilter === filter;
                        return (
                          <TouchableOpacity
                            key={filter}
                            style={[styles.filterChip, active && styles.filterChipActive]}
                            onPress={() => setSelectedFilter(filter)}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                              {filter}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Lista */}
                  <View style={styles.listHeader}>
                    <Text style={styles.listCount}>
                      {sortedArvores.length} Árvores cadastradas
                    </Text>
                    <TouchableOpacity style={styles.sortButton} onPress={handleSortToggle}>
                      <Text style={styles.sortText}>Ordenar</Text>
                      <Ionicons
                        name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                        size={14}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {sortedArvores.map((arvore) => (
                    <TouchableOpacity
                      key={arvore.id}
                      style={styles.arvoreCard}
                      onPress={() => handleArvorePress(arvore.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.arvoreHeader}>
                        <Text style={styles.arvoreName}>{arvore.name}</Text>
                        {arvore.deficiency && (
                          <View style={styles.deficiencyBadge}>
                            <Text style={styles.deficiencyText}>{arvore.deficiency}</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.arvoreInfo}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(arvore.status) }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(arvore.status) }]}>
                            {arvore.status}
                          </Text>
                        </View>
                        <View style={styles.dateInfo}>
                          <Ionicons name="calendar-outline" size={12} color="#888" />
                          <Text style={styles.arvoreDate}>Criado em: {arvore.date}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}

                  <Button
                    title="Ver análises detalhadas"
                    variant="primary"
                    size="full"
                    onPress={handleVerAnalises}
                  />
                </View>
              }
            />
          </ScrollView>
        )}

        <BottomNavbar />

        {/* Modal de edição/exclusão do talhão */}
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
  safeArea: { flex: 1 },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

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

  editButton: {
    padding: 4,
  },

  backButton: {
    padding: 8,
    backgroundColor: "#58B741",
    borderRadius: 500,
  },

  cardContent: { padding: 16 },

  searchContainer: { marginBottom: 20 },

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

  arvoreCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  arvoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  arvoreName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
  },

  deficiencyBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  deficiencyText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#D84315",
  },

  arvoreInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: { fontSize: 12, fontWeight: "500" },

  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  arvoreDate: { fontSize: 12, color: "#888" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  filtersContainer: { marginBottom: 20 },

  filtersTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },

  filtersRow: {
    flexDirection: "row",
    gap: 10,
  },

  filterChip: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  filterChipActive: { backgroundColor: "#F3D9B1" },

  filterChipText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },

  filterChipTextActive: {
    color: "#1A1A1A",
    fontWeight: "700",
  },

  emptyWrapper: { flex: 1 },

  emptyFullScreen: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#FFFFFF",
    marginVertical: 30,
  },

  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 8,
  },

  emptyImage: {
    width: 240,
    height: 200,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },

  emptyButtonContainer: {
    width: "100%",
    marginTop: 16,
  },
});