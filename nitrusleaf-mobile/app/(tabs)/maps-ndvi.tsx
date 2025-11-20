import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen(props: { navigation: { goBack: () => void; }; }) {
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

      {/* Title */}
      <Text style={styles.title}>Mapa da Propriedade</Text>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -24.689680996798725,
          longitude: -47.851206422814904,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: -24.689680996798725, longitude:  -47.851206422814904 }}
          title="Propriedade"
        />
      </MapView>

      {/* Back Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
    marginBottom: 10,
  },
  map: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  footer: {
    backgroundColor: "#FFB22C",
    paddingVertical: 20,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#5DBF4A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  backArrow: {
    fontSize: 20,
    color: "white",
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: "white",
  },
});