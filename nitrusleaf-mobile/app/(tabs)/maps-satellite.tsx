import Footer from "@/components/footer";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function SatelliteMapScreen(props: { navigation: { goBack: () => void; }; }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <Text style={styles.greeting}>Olá, Paulo!</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Breadcrumb */}
      <View style={styles.breadcrumbContainer}>
        <Text style={styles.breadcrumb}>Mapas</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Mapa de Satélite</Text>
      <View style={styles.divider}></View>

      {/* Property Name */}
      <Text style={styles.propertyName}>Propriedade 1</Text>

      {/* Satellite Map usando MapView igual ao segundo código */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -24.68964,
            longitude: -47.85112,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          mapType="satellite" // Define como mapa satélite
        >
          <Marker
            coordinate={{ latitude: -24.68964, longitude: -47.85112 }}
            title="Propriedade 1"
            description="Sua propriedade"
          />
        </MapView>
      </View>

      {/* Expand Button */}
      <View style={styles.expandContainer}>
        <TouchableOpacity style={styles.expandButton}>
          <Text style={styles.expandText}>Expandir ↗️</Text>
        </TouchableOpacity>
      </View>
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9DA",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuIcon: {
    fontSize: 28,
    fontWeight: "700",
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  breadcrumb: {
    fontSize: 16,
    color: "#6C6C6C",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#5DBF4A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  backArrow: {
    fontSize: 16,
    color: "white",
    marginRight: 6,
  },
  backText: {
    fontSize: 15,
    color: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
    marginLeft: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#C3A678",
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  propertyName: {
    marginLeft: 20,
    fontSize: 15,
    marginBottom: 10,
  },
  mapContainer: {
    width: "90%",
    height: 250,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  map: {
    flex: 1,
  },
  expandContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  expandButton: {
    backgroundColor: "#EDEDED",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  expandText: {
    fontSize: 15,
    color: "#5A5A5A",
  },
});