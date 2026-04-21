import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BottomNavbar() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const isActive = (routeName: string) => route.name === routeName;

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={[styles.button, isActive("Home") && styles.active]}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isActive("History") && styles.active]}
        onPress={() => navigation.navigate("History")}
      >
        <Ionicons name="time-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("scan")}
      >
        <Ionicons name="camera-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isActive("Map") && styles.active]}
        onPress={() => navigation.navigate("Map")}
      >
        <Ionicons name="map-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isActive("Profile") && styles.active]}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-outline" size={24} color="#000" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "space-around",
  },

  button: {
    padding: 10,
    borderRadius: 10,
  },

  active: {
    backgroundColor: "#EAD2B7", // tom bege do botão ativo
  },

  centerButton: {
    position: "absolute",
    top: -25,
    alignSelf: "center",
    backgroundColor: "#4CAF50", // verde
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});