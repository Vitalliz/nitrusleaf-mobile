// app/HistoryScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomCard } from "@/components/cards/card";
import StatCard from "@/components/cards/statcard";
import TalhaoCard, { TalhaoData } from "@/components/cards/talhaocard";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/tab-bar";
import { Header } from "@/components/ui/user-header";

// Mock data
const talhoesData: TalhaoData[] = [
  {
    id: "01",
    name: "Talhão #01",
    analyzed: 27,
    total: 32,
    date: "02 Fev, 2026",
    deficientTrees: 18,
  },
  {
    id: "02",
    name: "Talhão #02",
    analyzed: 25,
    total: 30,
    date: "02 Fev, 2026",
    deficientTrees: 15,
  },
  {
    id: "03",
    name: "Talhão #03",
    analyzed: 20,
    total: 25,
    date: "02 Fev, 2026",
    deficientTrees: 12,
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredTalhoes = useMemo(() => {
    let filtered = talhoesData.filter((talhao) =>
      talhao.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    if (sortOrder === "asc") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [searchText, sortOrder]);

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
    console.log("Add new talhao");
  }, []);

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
          title="Roberto Almeida"
          subtitle="Sítio Santa Aurora"
          onMenuPress={() => console.log("Menu pressed")}
          onAvatarPress={() => console.log("Avatar pressed")}
        />

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
                  <Text style={styles.date}>02 Fev, 2026</Text>
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
                      value="52/82"
                    />
                    <StatCard
                      icon="leaf-outline"
                      iconColor="#4CAF50"
                      backgroundColor="#E8F5E9"
                      label="Árvores com deficiência detectada"
                      value="42"
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

              {/* Botão Ver Análises */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Ver análises detalhadas"
                  variant="primary"
                  size="full"
                  onPress={() => console.log("Ver análises detalhadas")}
                />
              </View>
            </>
          }
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />

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
});
