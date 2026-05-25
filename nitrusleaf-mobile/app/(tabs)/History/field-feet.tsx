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
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
import { getTalhaoById } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";

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

  const filteredArvores = arvores.filter((arvore) =>
    arvore.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Ordenar árvores
  const sortedArvores = [...filteredArvores].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    return sortOrder === "asc" ? numA - numB : numB - numA;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tratado":
        return "#4CAF50";
      case "Não-Tratado":
      case "Não tratado":
        return "#F44336";
      case "Em tratamento":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Tratado":
        return "#E8F5E9";
      case "Não-Tratado":
      case "Não tratado":
        return "#FFEBEE";
      case "Em tratamento":
        return "#FFF3E0";
      default:
        return "#F5F5F5";
    }
  };

  const handleBackPress = useCallback(() => {
    safeBack(router, ROUTES.history);
  }, [router]);

  const handleArvorePress = useCallback(
    (arvoreId: string) => {
      console.log("Navigate to tree details:", arvoreId);
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
        pathname: "/(tabs)/add-foot",
        params: {
          talhaoId,
          talhaoName: talhao?.name ?? "",
        },
      });
    }
  }, [talhaoId, talhao?.name, router]);

  const handleVerAnalises = useCallback(() => {
    router.push("/(tabs)/AI/home");
  }, [router]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

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
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            {/* Título do Talhão */}
            <View style={styles.titleRow}>
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#1A2C3E" />
              </TouchableOpacity>
              <Text style={styles.title}>{talhao?.name || "Talhão"}</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* CARD - Lista de Árvores (White Large) */}
            <CustomCard
              variant="white-large-feet"
              bottomContent={
                <View style={styles.cardContent}>
                  {/* Busca e Cadastro */}
                  <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                      <Ionicons name="search-outline" size={20} color="#999" />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar árvore"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddArvore}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="#6BC24A"
                      />
                      <Text style={styles.addButtonText}>Cadastrar Árvore</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Lista de Árvores */}
                  <View style={styles.listHeader}>
                    <Text style={styles.listCount}>
                      {sortedArvores.length} Árvores cadastradas
                    </Text>
                    <TouchableOpacity
                      style={styles.sortButton}
                      onPress={handleSortToggle}
                    >
                      <Text style={styles.sortText}>Ordenar</Text>
                      <Ionicons
                        name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                        size={14}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {sortedArvores.length === 0 ? (
                    <View style={styles.emptyTrees}>
                      <Ionicons name="alert-circle-outline" size={32} color="#888" />
                      <Text style={styles.emptyText}>
                        Nenhuma árvore cadastrada neste talhão. Clique no botão acima para cadastrar a primeira!
                      </Text>
                    </View>
                  ) : (
                    sortedArvores.map((arvore) => (
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
                              <Text style={styles.deficiencyText}>
                                {arvore.deficiency}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.arvoreInfo}>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusBgColor(arvore.status) },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                { color: getStatusColor(arvore.status) },
                              ]}
                            >
                              {arvore.status}
                            </Text>
                          </View>

                          <View style={styles.dateInfo}>
                            <Ionicons
                              name="calendar-outline"
                              size={12}
                              color="#888"
                            />
                            <Text style={styles.arvoreDate}>
                              Criado em: {arvore.date}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}

                  {/* Botão Ver Análises Detalhadas */}
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
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2C3E",
  },

  cardContent: {
    padding: 16,
  },

  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1A2C3E",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },

  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6BC24A",
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

  sortText: {
    fontSize: 12,
    color: "#666",
  },

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

  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },

  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  arvoreDate: {
    fontSize: 12,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTrees: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
