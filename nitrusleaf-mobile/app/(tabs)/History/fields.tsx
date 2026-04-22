
import React, { useState } from "react";
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

import { Background } from "@/components/ui/background";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/ui/menu";
import { CustomCard } from "@/components/card";

export default function HistoryScreen() {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const talhoes = [
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

  const filteredTalhoes = talhoes.filter(talhao =>
    talhao.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
          {/* Título da tela */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Histórico de Análises</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.date}>02 Fev, 2026</Text>
            </View>
          </View>

          {/* PRIMEIRO CARD - Dados Gerais (Yellow) */}
          <CustomCard variant = "yellow-large">
            <View style={styles.cardContent}>
              <Text style={styles.statsTitle}>Dados Gerais</Text>
              
              <View style={styles.statItem}>
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>Árvores Analisadas</Text>
                  <Text style={styles.statValue}>52/82</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statColumn}>
                  <Text style={styles.statLabel}>Árvores com deficiência detectada</Text>
                  <Text style={styles.statValue}>42</Text>
                </View>
              </View>
            </View>
          </CustomCard>

          {/* SEGUNDO CARD - Talhões (White) */}
          <CustomCard variant = "white-large">
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>Talhões</Text>
              
              {/* Busca e Cadastro */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Ionicons name="search-outline" size={20} color="#999" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar talhão"
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                </View>
                
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add-circle-outline" size={24} color="#6BC24A" />
                  <Text style={styles.addButtonText}>Cadastrar Talhão</Text>
                </TouchableOpacity>
              </View>

              {/* Lista de Talhões */}
              <View style={styles.talhoesList}>
                <View style={styles.listHeader}>
                  <Text style={styles.listCount}>
                    {filteredTalhoes.length} Talhões cadastrados
                  </Text>
                  <TouchableOpacity 
                    style={styles.sortButton}
                    onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <Text style={styles.sortText}>Ordenar</Text>
                    <Ionicons 
                      name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} 
                      size={14} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>

                {filteredTalhoes.map((talhao) => (
                  <TouchableOpacity key={talhao.id} style={styles.talhaoCard}>
                    <View style={styles.talhaoHeader}>
                      <Text style={styles.talhaoName}>{talhao.name}</Text>
                      <View style={styles.progressBadge}>
                        <Text style={styles.progressText}>
                          {Math.round((talhao.analyzed / talhao.total) * 100)}%
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.talhaoStats}>
                      {talhao.analyzed}/{talhao.total} árvores analisadas
                    </Text>
                    
                    <View style={styles.talhaoFooter}>
                      <View style={styles.dateInfo}>
                        <Ionicons name="calendar-outline" size={12} color="#888" />
                        <Text style={styles.talhaoDate}>
                          Criado em: {talhao.date}
                        </Text>
                      </View>
                      {talhao.deficientTrees > 0 && (
                        <View style={styles.deficientBadge}>
                          <Text style={styles.deficientText}>
                            ⚠️ {talhao.deficientTrees} com deficiência
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </CustomCard>

          {/* Botão Ver Análises Detalhadas */}
          <Button
            title="Ver análises detalhadas"
            variant="primary"
            size="full"
            onPress={() => console.log("Ver análises detalhadas")}
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

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  date: {
    fontSize: 14,
    color: "#888",
  },

  cardContent: {
    paddingTop: 150,
    padding: 10,
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
    marginBottom: 16,
  },

  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statColumn: {
    // flex: 1,
    // justifyContent: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },

  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A2C3E",
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#E5E5E5",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
    marginBottom: 16,
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

  talhoesList: {
    marginTop: 8,
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

  talhaoCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  talhaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  talhaoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
  },

  progressBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },

  talhaoStats: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },

  talhaoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  talhaoDate: {
    fontSize: 12,
    color: "#888",
  },

  deficientBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  deficientText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#FF9800",
  },
});