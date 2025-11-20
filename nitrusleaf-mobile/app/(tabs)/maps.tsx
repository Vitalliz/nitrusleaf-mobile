// app/(tabs)/maps.tsx - MAPS SCREEN
import Footer from "@/components/footer";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MapsScreen() {
  const [selectedPlantation, setSelectedPlantation] = useState<number | null>(1);

  const plantations = [
    {
      id: 1,
      name: "Propriedade 1",
      area: "12.5 ha",
    },
  ];

  const mapOptions = [
    { id: 1, name: "Infravermelho (NDVI)", icon: "leaf" },
    { id: 2, name: "Satélite", icon: "planet" },
    { id: 3, name: "Mapa de Calor", icon: "flame" },
    { id: 4, name: "Localização de pés", icon: "location" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mapas</Text>
        </View>

        {/* Selected Property */}
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>Propriedade 1</Text>
          <View style={styles.divider} />
          <Text style={styles.propertySubtitle}>Selecione para ver as informações.</Text>
        </View>

        {/* Map Options */}
        <View style={styles.optionsContainer}>
          {mapOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionButton}>
              <Ionicons name={option.icon as any} size={24} color="#6BC24A" />
              <Text style={styles.optionText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={80} color="#CCCCCC" />
          <Text style={styles.mapText}>Visualização do mapa</Text>
        </View>

        {/* Plantation Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Detalhes da Propriedade</Text>
          
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailLabel}>Área Total</Text>
              <Text style={styles.detailValue}>12.5 ha</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailLabel}>Plantas Cadastradas</Text>
              <Text style={styles.detailValue}>1,247</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailLabel}>Status Geral</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Saudável</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportButtonText}>Gerar Relatório Completo</Text>
            <Ionicons name="document-text" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginBottom: 8,
  },
  propertySubtitle: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#2B2B2B",
    marginLeft: 12,
    fontWeight: "500",
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapText: {
    marginTop: 12,
    color: "#999999",
    fontSize: 14,
    fontWeight: "500",
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    color: "#666666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    color: "#2B2B2B",
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  reportButton: {
    backgroundColor: "#6BC24A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  spacer: {
    height: 40,
  },
});