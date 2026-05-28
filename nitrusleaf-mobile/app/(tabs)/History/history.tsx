// app/HistoryScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { CustomCard } from "@/components/cards/card";
import StatCard from "@/components/cards/statcard";
import TalhaoCard, { TalhaoData } from "@/components/cards/talhaocard";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { computeTalhaoPeStats } from "@/utils/peStats";
import { Input } from "@/components/ui/input";

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dbUser, setDbUser] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [talhoes, setTalhoes] = useState<TalhaoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);

        const props = await getPropertiesByUser(user.id);
        if (props && props.length > 0) {
          const mainProp = props[0];
          setProperty(mainProp);

          const dbTalhoes = await getTalhoesByProperty(mainProp.id);
          const mapped = await Promise.all(
            dbTalhoes.map(async (t) => {
              const pes = await getPesByTalhao(t.id);
              const stats = computeTalhaoPeStats(pes);
              const dateStr = t.createdAt
                ? new Date(t.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Sem data";
              return {
                id: t.id,
                name: t.name,
                analyzed: stats.analyzed,
                total: stats.total,
                date: dateStr,
                deficientTrees: stats.deficient,
              };
            })
          );
          setTalhoes(mapped);
        } else {
          setTalhoes([]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do histórico:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isFocused) {
      void loadData();
    }
  }, [user, isFocused]);

  const filteredTalhoes = useMemo(() => {
    let filtered = talhoes.filter((talhao) =>
      talhao.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    if (sortOrder === "asc") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    return filtered;
  }, [talhoes, searchText, sortOrder]);

  const totalAnalyzed = useMemo(() => talhoes.reduce((acc, t) => acc + t.analyzed, 0), [talhoes]);
  const totalTrees = useMemo(() => talhoes.reduce((acc, t) => acc + t.total, 0), [talhoes]);
  const totalDeficient = useMemo(() => talhoes.reduce((acc, t) => acc + t.deficientTrees, 0), [talhoes]);

  const handleTalhaoPress = useCallback(
    (talhaoId: string) => {
      router.push({
        pathname: "/(tabs)/History/field-detail-screen",
        params: { talhaoId },
      });
    },
    [router],
  );

  const handleAddTalhao = useCallback(() => {
    if (property) {
      router.push({
        pathname: "/(tabs)/History/add-talhao",
        params: { propertyId: property.id, propertyName: property.name },
      });
    } else {
      Alert.alert("Aviso", "Cadastre uma propriedade primeiro nas configurações.");
    }
  }, [property, router]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const renderTalhaoItem = useCallback(
    ({ item }: { item: TalhaoData }) => (
      <TalhaoCard talhao={item} onPress={() => handleTalhaoPress(item.id)} />
    ),
    [handleTalhaoPress],
  );

  const keyExtractor = useCallback((item: TalhaoData) => item.id, []);

  // ─── Empty State (tela inteira) ───────────────────────────────────────────
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
      <View style={styles.emptyButtonContainer}>
        <Button
          title="Cadastrar Talhão"
          variant="primary"
          size="full"
          icon="add-circle-outline"
          onPress={handleAddTalhao}
        />
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
          onAvatarPress={() => router.push("/(tabs)/Settings/profile-new")}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : talhoes.length === 0 ? (
          // ── Nenhum talhão: mostra empty state em tela cheia ──
          renderEmptyFullScreen()
        ) : (
          // ── Com talhões: mostra fluxo normal ──
          <FlatList
            data={[]}
            renderItem={() => null}
            keyExtractor={() => "dummy"}
            ListHeaderComponent={
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Histórico de Análises</Text>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color="#888" />
                  <Text style={styles.date}>
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              </View>
            }
            ListFooterComponent={
              <>
                {/* CARD 1: DADOS GERAIS */}
                <View style={styles.dadosGeraisCard}>
                  <Text style={styles.cardTitle}>Dados Gerais</Text>
                  <View style={styles.statsRow}>
                    <StatCard
                      icon="search-outline"
                      iconColor="#2196F3"
                      backgroundColor="#E3F2FD"
                      label="Árvores Analisadas"
                      value={`${totalAnalyzed}/${totalTrees}`}
                    />
                    <StatCard
                      icon="leaf-outline"
                      iconColor="#4CAF50"
                      backgroundColor="#E8F5E9"
                      label="Árvores com deficiência detectada"
                      value={String(totalDeficient)}
                    />
                  </View>
                </View>

                {/* CARD 2: TALHÕES */}
                <CustomCard variant="white-large-feet">
                  <View style={styles.cardInnerContent}>
                    <Text style={styles.cardTitle}>Talhões</Text>
                    <Input
                      placeholder="Buscar"
                      value={searchText}
                      onChangeText={setSearchText}
                      rightIcon="search-outline"
                      size="full"
                    />

                    <Button
                      title="Cadastrar Talhão"
                      variant="primary"
                      size="full"
                      icon="add-circle-outline"
                      onPress={handleAddTalhao}
                    />

                    <View style={styles.listHeader}>
                      <Text style={styles.listCount}>
                        {filteredTalhoes.length} Talhões cadastrados
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

                    <FlatList
                      data={filteredTalhoes}
                      renderItem={renderTalhaoItem}
                      keyExtractor={keyExtractor}
                      scrollEnabled={false}
                      initialNumToRender={5}
                      maxToRenderPerBatch={3}
                      windowSize={5}
                    />
                  </View>
                </CustomCard>
              </>
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
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
  container: {
    padding: 16,
    paddingBottom: 40,
    paddingHorizontal: 25,
    gap: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },

  /* CARD DADOS GERAIS */
  dadosGeraisCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 4,
    borderTopColor: "#F5A623",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  /* CARD TALHÕES */
  cardInnerContent: {
    width: "100%",
    padding: 16,
    paddingHorizontal: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1A2C3E",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  listCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
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

  /* EMPTY STATE TELA CHEIA */
  emptyFullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    gap: 8,
    backgroundColor: "#FFFFFF",
    marginVertical: 30,
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