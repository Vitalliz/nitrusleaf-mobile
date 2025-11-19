
// app/(tabs)/maps.tsx - MAPS SCREEN
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "@/components/footer";
import Menu from "@/components/menu";

export default function MapsScreen() {
  const [selectedPlantation, setSelectedPlantation] = useState<number | null>(null);

  const plantations = [
    {
      id: 1,
      name: "Plantation A",
      area: "12.5 ha",
      temperature: "28°C",
      humidity: "68%",
      status: "healthy",
    },
    {
      id: 2,
      name: "Plantation B",
      area: "8.3 ha",
      temperature: "26°C",
      humidity: "72%",
      status: "warning",
    },
    {
      id: 3,
      name: "Plantation C",
      area: "15.7 ha",
      temperature: "29°C",
      humidity: "65%",
      status: "healthy",
    },
    {
      id: 4,
      name: "Plantation D",
      area: "5.2 ha",
      temperature: "25°C",
      humidity: "58%",
      status: "alert",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#2ECC71";
      case "warning":
        return "#F39C12";
      case "alert":
        return "#E74C3C";
      default:
        return "#95A5A6";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "healthy":
        return "Saudável";
      case "warning":
        return "Atenção";
      case "alert":
        return "Alerta";
      default:
        return "Desconhecido";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mapa de Plantações</Text>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={60} color="#DDD" />
          <Text style={styles.mapText}>Mapa interativo (em desenvolvimento)</Text>
        </View>

        {/* Plantation List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Plantações Cadastradas</Text>

          {plantations.map((plantation) => (
            <TouchableOpacity
              key={plantation.id}
              style={[
                styles.plantationCard,
                selectedPlantation === plantation.id && styles.plantationCardSelected,
              ]}
              onPress={() =>
                setSelectedPlantation(
                  selectedPlantation === plantation.id ? null : plantation.id
                )
              }
            >
              <View style={styles.plantationHeader}>
                <View style={styles.plantationInfo}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(plantation.status) },
                    ]}
                  />
                  <View>
                    <Text style={styles.plantationName}>{plantation.name}</Text>
                    <Text style={styles.plantationArea}>{plantation.area}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusLabel}>
                    {getStatusLabel(plantation.status)}
                  </Text>
                </View>
              </View>

              {selectedPlantation === plantation.id && (
                <View style={styles.plantationDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="thermometer" size={18} color="#E74C3C" />
                    <Text style={styles.detailText}>
                      Temperatura: {plantation.temperature}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="water" size={18} color="#3B82F6" />
                    <Text style={styles.detailText}>
                      Umidade: {plantation.humidity}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.detailButton}>
                    <Text style={styles.detailButtonText}>Ver Localização</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
      <Menu />
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
  mapPlaceholder: {
    height: 250,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  mapText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 15,
  },
  plantationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  plantationCardSelected: {
    borderWidth: 2,
    borderColor: "#6BC24A",
  },
  plantationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plantationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  plantationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  plantationArea: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6BC24A",
  },
  plantationDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: "#6BC24A",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  spacer: {
    height: 40,
  },
});