// app/(tabs)/maps.tsx - MAPS SCREEN
import Footer from "@/components/footer";
import { Ionicons } from "@expo/vector-icons";
import { Background } from '@/components/ui/background';
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";


export default function MapsScreen() {
  const [selectedPlantation, setSelectedPlantation] = useState<number | null>(1);
  const router = useRouter();

  return (
    <Background>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header com título */}
        <View style={styles.header}>
          <Text style={styles.title}>Mapas</Text>
        </View>

        


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="map-outline" size={20} color="#555" />
            <Text style={styles.sectionTitle}>Visualização de Mapas</Text>
          </View>
          
          <View style={styles.mapOptions}>
            <TouchableOpacity style={styles.mapOption}
            onPress={() => router.push('/(tabs)/maps-ndvi')}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="leaf-outline" size={20} color="#6BC24A" />
              </View>
              <Text style={styles.optionLabel}>Infravermelho (NDVI)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mapOption}
              onPress={() => router.push('/(tabs)/maps-satellite')}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="planet-outline" size={20} color="#6BC24A" />
              </View>
              <Text style={styles.optionLabel}>Satélite</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mapOption}>
              <View style={styles.optionIcon}>
                <Ionicons name="flame-outline" size={20} color="#6BC24A" />
              </View>
              <Text style={styles.optionLabel}>Mapa de Calor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mapOption}>
              <View style={styles.optionIcon}>
                <Ionicons name="location-outline" size={20} color="#6BC24A" />
              </View>
              <Text style={styles.optionLabel}>Localização de Pés</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.spacer} />
      </ScrollView>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E8D7",
  },
  content: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2B2B2B",
  },
 
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  editButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8D7BD",
    marginBottom: 16,
  },
  propertyInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 15,
    color: "#5A3E2B",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#2B2B2B",
    fontWeight: "600",
  },
  statusContainer: {
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
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2B2B",
    marginLeft: 8,
  },
  mapOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mapOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: "48%",
  },
  optionIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#E8F5E8",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: "#2B2B2B",
    fontWeight: "500",
    flex: 1,
  },
  spacer: {
    height: 40,
  },
});