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
import { useProperty } from "@/contexts/PropertyContext";
import { getTalhaoById, updateTalhao, deleteTalhao } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { Input } from "@/components/ui/input";
import { TalhaoEditModal } from "@/components/modals/talhao-edit-modal";
import ArvoreCard from "@/components/cards/arvore-card";

export default function TalhaoDetailScreen() {
  const router = useRouter();
  const { talhaoId } = useLocalSearchParams<{ talhaoId?: string }>();
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const { selectedProperty } = useProperty();

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [dbUser, setDbUser] = useState<any>(null);
  const [talhao, setTalhao] = useState<any>(null);
  const [arvores, setArvores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const filters = ["Todos", "Manganês", "Cobre", "Adversos"];

  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user?.id || !talhaoId) return;
      try {
        setLoading(true);
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);

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
    if (isFocused) void loadData();
  }, [user, talhaoId, isFocused]);

  const filteredArvores = arvores.filter((arvore) => {
    const matchesSearch = arvore.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      selectedFilter === "Todos" ||
      (arvore.deficiency && arvore.deficiency.includes(selectedFilter));
    return matchesSearch && matchesFilter;
  });

  const sortedArvores = [...filteredArvores].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    return sortOrder === "asc" ? numA - numB : numB - numA;
  });

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

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

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

  const renderEmptyFullScreen = () => (
    <View style={styles.emptyFullScreen}>
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
          userSubtitle={loading ? "Carregando..." : (selectedProperty?.name || "Sem propriedade")}
          userAvatar={dbUser?.avatarUrl || DEFAULT_AVATAR}
          subtitleIcon="location-outline"
          onMenuPress={() => console.log("Menu pressed")}
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
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
            <CustomCard
              variant="white"
              bottomContent={
                <View style={styles.cardContent}>

                  {/* Título + botão voltar + editar */}
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

                  {/* Busca + Cadastrar */}
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
                    <View style={styles.filtersRow}>
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
                    </View>
                  </View>

                  {/* Header da lista */}
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

                  {/* Lista de árvores usando ArvoreCard */}
                  {sortedArvores.map((arvore) => (
                    <ArvoreCard
                      key={arvore.id}
                      arvore={arvore}
                      onPress={() => handleArvorePress(arvore.id)}
                    />
                  ))}

                </View>
              }
            />
          </ScrollView>
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
  safeArea: { flex: 1 },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

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
    flexWrap: "wrap",
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