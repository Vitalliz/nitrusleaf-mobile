import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === `/${route}`;
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={[styles.button, isActive("tabs/home") && styles.active]}
        onPress={() => router.push("/(tabs)/AI/home")}
      >
        <Ionicons name="home-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isActive("tabs/fields") && styles.active]}
        onPress={() => router.push("/(tabs)/History/fields")}
      >
        <Ionicons name="time-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => router.push("/(tabs)/AI/scan")}
      >
        <Ionicons name="camera-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isActive("tabs/maps") && styles.active]}
        onPress={() => router.push("/(tabs)/Maps/maps")}
      >
        <Ionicons name="map-outline" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isActive("tabs/profile") && styles.active]}
        onPress={() => router.push("/(tabs)/Settings/profile")}
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
    position: "relative",
  },

  button: {
    padding: 10,
    borderRadius: 10,
  },

  active: {
    backgroundColor: "#EAD2B7",
  },

  centerButton: {
    position: "absolute",
    top: -25,
    left: "50%",
    marginLeft: -35,
    backgroundColor: "#4CAF50",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});