import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { TalhaoData } from "@/components/cards/talhao-card";
import { Background } from "@/components/ui/background";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { computeTalhaoPeStats } from "@/utils/peStats";

function formatDisplayDate(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return "Sem data";
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez",];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

export default function HistoryScreen() {
  const router = useRouter();
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
  const [talhoes, setTalhoes] = useState<TalhaoData[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadUser() {
        if (!user?.id) return;
        try {
          const details = await getUsuarioDetails(user.id);
          if (isActive) setDbUser(details);
        } catch (err) {
          console.error("Erro ao carregar usuário no histórico:", err);
        }
      }

      loadUser();

      return () => {
        isActive = false;
      };
    }, [user?.id])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadData() {
        if (!selectedProperty?.id) {
          if (isActive) {
            setTalhoes([]);
            setLoading(false);
          }
          return;
        }

        try {
          if (isActive) setLoading(true);
          const dbTalhoes = await getTalhoesByProperty(selectedProperty.id);
          const mapped = await Promise.all(
            dbTalhoes.map(async (t) => {
              const pes = await getPesByTalhao(t.id);
              const stats = computeTalhaoPeStats(pes);
              return {
                id: t.id,
                name: t.name,
                analyzed: stats.analyzed,
                total: stats.total,
                date: formatDisplayDate(t.createdAt),
                deficientTrees: stats.deficient,
              };
            })
          );

          if (isActive) setTalhoes(mapped);
        } catch (err) {
          console.error("Erro ao carregar dados do histórico:", err);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      loadData();

      return () => {
        isActive = false;
      };
    }, [selectedProperty?.id])
  );

  const filteredTalhoes = useMemo(() => {
    let filtered = talhoes.filter((talhao) =>
      talhao.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (sortOrder === "asc") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    return filtered;
  }, [talhoes, searchText, sortOrder]);

  const totalAnalyzed = useMemo(
    () => talhoes.reduce((acc, t) => acc + t.analyzed, 0),
    [talhoes]
  );
  const totalTrees = useMemo(
    () => talhoes.reduce((acc, t) => acc + t.total, 0),
    [talhoes]
  );
  const totalDeficient = useMemo(
    () => talhoes.reduce((acc, t) => acc + t.deficientTrees, 0),
    [talhoes]
  );

  const handleTalhaoPress = useCallback(
    (talhaoId: string) => {
      router.push({
        pathname: "/(tabs)/History/field-detail-screen",
        params: { talhaoId },
      });
    },
    [router]
  );

  const handleAddTalhao = useCallback(() => {
    if (selectedProperty) {
      router.push({
        pathname: "/(tabs)/History/add-talhao",
        params: {
          propertyId: selectedProperty.id,
          propertyName: selectedProperty.name,
        },
      });
    } else {
      Alert.alert(
        "Aviso",
        "Cadastre uma propriedade primeiro nas configurações."
      );
    }
  }, [selectedProperty, router]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const renderTalhaoItem = useCallback(
    ({ item }: { item: TalhaoData }) => (
      <TouchableOpacity
        style={styles.talhaoCard}
        activeOpacity={0.7}
        onPress={() => handleTalhaoPress(item.id)}
      >
        <View style={styles.talhaoInfo}>
          <Text style={styles.talhaoName}>{item.name}</Text>
          <Text style={styles.talhaoStats}>
            <Text style={styles.talhaoStatsBold}>
              {item.analyzed}/{item.total}
            </Text>{" "}
            árvores analisadas
          </Text>
          <View style={styles.talhaoDateRow}>
            <Text style={styles.talhaoDateLabel}>Criado em: </Text>
            <Ionicons name="calendar-outline" size={12} color="#888" />
            <Text style={styles.talhaoDateValue}> {item.date}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#374151" />
      </TouchableOpacity>
    ),
    [handleTalhaoPress]
  );

  const keyExtractor = useCallback((item: TalhaoData) => item.id, []);

  const renderEmptyFullScreen = () => (
    <View style={styles.emptyFullScreen}>
      <Image
        source={require("@/assets/images/empty-state-talhao.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>
        Você ainda não cadastrou nenhum talhão.
      </Text>
      <Text style={styles.emptyText}>
        Cadastre seu primeiro talhão para começar a analisar suas árvores!
      </Text>
      <TouchableOpacity
        style={styles.cadastrarButton}
        activeOpacity={0.85}
        onPress={handleAddTalhao}
      >
        <Ionicons name="add" size={20} color={Palette.white} />
        <Text style={styles.cadastrarButtonText}>Cadastrar Talhão</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <StatusBar style="dark" />

        <Header
          userName={
            propertyContextLoading
              ? "Carregando..."
              : dbUser?.fullName || user?.name || "Usuário"
          }
          userSubtitle={
            propertyContextLoading
              ? "Carregando..."
              : selectedProperty?.name || "Sem propriedade"
          }
          userAvatar={dbUser?.avatarUrl}
          subtitleIcon="location-outline"
          onPropertyPress={showPropertyPicker}
          showPropertyChevron={canSwitchProperty}
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
        />

        {loading || propertyContextLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.primary} />
          </View>
        ) : talhoes.length === 0 ? (
          renderEmptyFullScreen()
        ) : (
          <FlatList
            data={filteredTalhoes}
            renderItem={renderTalhaoItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.titleContainer}>
                  <Text style={styles.sectionHeaderTitle}>
                    Histórico de Análises
                  </Text>
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#888" />
                    <Text style={styles.dateText}>{formatDisplayDate()}</Text>
                  </View>
                </View>

                <View style={styles.dadosGeraisCard}>
                  <Text style={styles.dadosGeraisTitle}>Dados Gerais</Text>

                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <View style={styles.statHeaderRow}>
                        <Ionicons
                          name="search-outline"
                          size={22}
                          color="#2563EB"
                        />
                        <Text style={styles.statLabel}>Árvores Analisadas</Text>
                      </View>
                      <Text style={styles.statNumberGroup}>
                        <Text style={styles.statNumberBig}>
                          {totalAnalyzed}
                        </Text>
                        <Text style={styles.statNumberTotal}>
                          /{totalTrees}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.statBox}>
                      <View style={styles.statHeaderRow}>
                        <Ionicons
                          name="leaf-outline"
                          size={22}
                          color="#22C55E"
                        />
                        <Text style={styles.statLabel}>
                          Árvores com deficiência detectada
                        </Text>
                      </View>
                      <Text style={styles.statNumberBig}>
                        {totalDeficient}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.talhoesSection}>
                  <Text style={styles.talhoesTitle}>Talhões</Text>

                  <View style={styles.searchContainer}>
                    <TextInput
                      placeholder="Buscar talhão"
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
                    onPress={handleAddTalhao}
                  >
                    <Ionicons name="add" size={20} color={Palette.white} />
                    <Text style={styles.cadastrarButtonText}>
                      Cadastrar Talhão
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.listSubHeader}>
                    <Text style={styles.listCount}>
                      {filteredTalhoes.length} Talhões cadastrados
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
                </View>
              </>
            }
          />
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },

  dadosGeraisCard: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EEF0F2",
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dadosGeraisTitle: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    justifyContent: "space-between",
    minHeight: 105,
  },
  statHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
    color: "#374151",
    lineHeight: 14,
  },
  statNumberGroup: {
    textAlign: "center",
    marginTop: 8,
  },
  statNumberBig: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginTop: 8,
  },
  statNumberTotal: {
    fontSize: 14,
    fontWeight: FontWeights.semiBold,
    color: Palette.textSecondary,
  },

  talhoesSection: {
    width: "100%",
  },
  talhoesTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 12,
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

  talhaoCard: {
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
  talhaoInfo: {
    flex: 1,
  },
  talhaoName: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  talhaoStats: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  talhaoStatsBold: {
    fontWeight: FontWeights.bold,
  },
  talhaoDateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  talhaoDateLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  talhaoDateValue: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },

  emptyFullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    gap: 8,
    backgroundColor: Palette.white,
    marginVertical: 30,
  },
  emptyImage: {
    width: 240,
    height: 200,
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