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
  TextInput,
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

  const totalAnalyzed = useMemo(() => {
    return talhoes.reduce((acc, t) => acc + t.analyzed, 0);
  }, [talhoes]);

  const totalTrees = useMemo(() => {
    return talhoes.reduce((acc, t) => acc + t.total, 0);
  }, [talhoes]);

  const totalDeficient = useMemo(() => {
    return talhoes.reduce((acc, t) => acc + t.deficientTrees, 0);
  }, [talhoes]);

  const handleTalhaoPress = useCallback(
    (talhaoId: string) => {
      console.log("Navigate to talhao details:", talhaoId);
      router.push({
        pathname: "/(tabs)/History/field-feet",
        params: { talhaoId: talhaoId },
      });
    },
    [router],
  );

  const handleAddTalhao = useCallback(() => {
    if (property) {
      router.push({
        pathname: "/(tabs)/add-talhao",
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
          <FlatList
            data={[]}
            renderItem={() => null}
            keyExtractor={() => "dummy"}
            ListHeaderComponent={
              <>
                {/* Título da tela */}
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Histórico de Análises</Text>
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#888" />
                    <Text style={styles.date}>
                      {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                </View>
              </>
            }
            ListFooterComponent={
              <>
                {/* CARD 1: DADOS GERAIS */}
                <CustomCard variant="yellow-large">
                  <View style={styles.cardInnerContent}>
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
                        label="Com deficiência"
                        value={String(totalDeficient)}
                      />
                    </View>
                  </View>
                </CustomCard>

                {/* CARD 2: TALHÕES */}
                <CustomCard variant="white-large-feet">
                  <View style={styles.cardInnerContent}>
                    <Text style={styles.cardTitle}>Talhões</Text>

                    {/* Search Box */}
                    <View style={styles.searchBox}>
                      <Ionicons name="search-outline" size={20} color="#999" />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar talhão"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                        accessibilityLabel="Buscar talhão"
                        accessibilityHint="Digite o nome do talhão para filtrar"
                      />
                    </View>

                    {/* Botão Cadastrar */}
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddTalhao}
                      activeOpacity={0.8}
                      accessibilityLabel="Cadastrar novo talhão"
                      accessibilityHint="Abre o formulário para cadastrar um novo talhão"
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="#6BC24A"
                      />
                      <Text style={styles.addButtonText}>Cadastrar Talhão</Text>
                    </TouchableOpacity>

                    {/* Lista Header */}
                    <View style={styles.listHeader}>
                      <Text style={styles.listCount}>
                        {filteredTalhoes.length} Talhões cadastrados
                      </Text>
                      <TouchableOpacity
                        style={styles.sortButton}
                        onPress={handleSortToggle}
                        accessibilityLabel="Ordenar talhões"
                        accessibilityHint={
                          sortOrder === "asc"
                            ? "Ordenação crescente"
                            : "Ordenação decrescente"
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

                    {/* Lista de Talhões */}
                    {filteredTalhoes.length === 0 ? (
                      <View style={styles.emptyTalhoes}>
                        <Ionicons name="alert-circle-outline" size={32} color="#888" />
                        <Text style={styles.emptyText}>
                          Nenhum talhão cadastrado no seu sítio. Cadastre seu primeiro talhão clicando no botão acima!
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={filteredTalhoes}
                        renderItem={renderTalhaoItem}
                        keyExtractor={keyExtractor}
                        scrollEnabled={false}
                        initialNumToRender={5}
                        maxToRenderPerBatch={3}
                        windowSize={5}
                      />
                    )}
                  </View>
                </CustomCard>

                {/* Botão Ver Análises */}
                <View style={styles.buttonContainer}>
                  <Button
                    title="Ver análises detalhadas"
                    variant="primary"
                    size="full"
                    onPress={() => router.push("/(tabs)/AI/home")}
                  />
                </View>
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
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 8,
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
  cardInnerContent: {
    width: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    top: 60,
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    height: 120,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 250,
    marginBottom: 20,
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
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    gap: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6BC24A",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 5,
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
  buttonContainer: {
    marginBottom: 16,
  },
  emptyTalhoes: {
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
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
