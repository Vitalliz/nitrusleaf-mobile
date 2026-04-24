import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Background } from "@/components/ui/background";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/menu";
import { CustomCard } from "@/components/cards/card";

export default function TalhaoDetailScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const arvores = [
    {
      id: "01",
      name: "Árvore #01",
      deficiency: "Cobre",
      status: "Não tratado",
      date: "10 Nov, 2025",
    },
    {
      id: "02",
      name: "Árvore #02",
      deficiency: null,
      status: "Tratado",
      date: "12 Nov, 2025",
    },
    {
      id: "03",
      name: "Árvore #03",
      deficiency: "Cobre",
      status: "Não informado",
      date: "13 Nov, 2025",
    },
    {
      id: "04",
      name: "Árvore #04",
      deficiency: "Manganês",
      status: "Não tratado",
      date: "10 Nov, 2025",
    },
    {
      id: "05",
      name: "Árvore #05",
      deficiency: "Ferro",
      status: "Tratado",
      date: "15 Nov, 2025",
    },
    {
      id: "06",
      name: "Árvore #06",
      deficiency: "Cobre",
      status: "Em tratamento",
      date: "18 Nov, 2025",
    },
  ];

  const filteredArvores = arvores.filter(arvore =>
    arvore.name.toLowerCase().includes(searchText.toLowerCase())
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
      case "Não tratado":
        return "#FFEBEE";
      case "Em tratamento":
        return "#FFF3E0";
      default:
        return "#F5F5F5";
    }
  };

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleArvorePress = useCallback((arvoreId: string) => {
    console.log("Navigate to tree details:", arvoreId);
    router.push({
      pathname: '/(tabs)/History/field-three',
      params: { treeId: arvoreId },
    });
  }, [router]);

  const handleAddArvore = useCallback(() => {
    console.log("Add new tree");
  }, []);

  const handleVerAnalises = useCallback(() => {
    console.log("Ver análises detalhadas");
  }, []);

  const handleSortToggle = useCallback(() => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  }, []);

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

        <ScrollView contentContainerStyle={styles.container}>
          {/* Título do Talhão */}
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#1A2C3E" />
            </TouchableOpacity>
            <Text style={styles.title}>Talhão #01</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* CARD - Lista de Árvores (White Large) - CORRIGIDO */}
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

                  <TouchableOpacity style={styles.addButton} onPress={handleAddArvore}>
                    <Ionicons name="add-circle-outline" size={24} color="#6BC24A" />
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
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBgColor(arvore.status) }
                      ]}>
                        <Text style={[styles.statusText, { color: getStatusColor(arvore.status) }]}>
                          {arvore.status}
                        </Text>
                      </View>

                      <View style={styles.dateInfo}>
                        <Ionicons name="calendar-outline" size={12} color="#888" />
                        <Text style={styles.arvoreDate}>
                          Criado em: {arvore.date}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

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
});