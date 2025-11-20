// app/(tabs)/explore.tsx - EXPLORE SCREEN
import Footer from "@/components/footer";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");

  const plantTypes = [
    {
      id: 1,
      name: "Tomate",
      icon: "leaf",
      color: "#E74C3C",
      description: "Plantação de tomate industrial",
    },
    {
      id: 2,
      name: "Alface",
      icon: "leaf",
      color: "#27AE60",
      description: "Cultivo hidropônico",
    },
    {
      id: 3,
      name: "Cenoura",
      icon: "leaf",
      color: "#E67E22",
      description: "Plantação em solo",
    },
    {
      id: 4,
      name: "Brócolis",
      icon: "leaf",
      color: "#2ECC71",
      description: "Cultivo orgânico",
    },
    {
      id: 5,
      name: "Melancia",
      icon: "leaf",
      color: "#E74C3C",
      description: "Plantação sazonal",
    },
    {
      id: 6,
      name: "Abacaxi",
      icon: "leaf",
      color: "#F39C12",
      description: "Fruta tropical",
    },
  ];

  const filteredPlants = plantTypes.filter((plant) =>
    plant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Explorar Plantações</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar plantação..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#CCC"
          />
        </View>

        {/* Plant Grid */}
        <View style={styles.gridContainer}>
          {filteredPlants.map((plant) => (
            <TouchableOpacity key={plant.id} style={styles.plantCard}>
              <View style={[styles.plantIcon, { backgroundColor: plant.color }]}>
                <Ionicons name={plant.icon as any} size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantDescription}>{plant.description}</Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#2B2B2B",
  },
  gridContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  plantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  plantIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 4,
  },
  plantDescription: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
    textAlign: "center",
  },
  viewButton: {
    backgroundColor: "#6BC24A",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  spacer: {
    height: 40,
  },
});