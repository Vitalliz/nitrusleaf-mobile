import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { WebView } from "react-native-webview";
import Menu from "@/components/menu"

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

      {/* Satellite Map (WebView Google Maps Embed) */}
      <View style={styles.mapContainer}>
        <WebView
          style={styles.webview}
          source={{
            uri:
              "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.8192687378106!2d-46.62529028447607!3d-23.507150584715266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c1f8dfd90bf497%3A0xbaa7a3f2f07e0df2!2sSample%20Farm!5e0!3m2!1sen!2sbr!4v1700000000000!5m2!1sen!2sbr",
          }}
        />
      </View>

      {/* Expand Button */}
      <View style={styles.expandContainer}>
        <TouchableOpacity style={styles.expandButton}>
          <Text style={styles.expandText}>Expandir ↗️</Text>
        </TouchableOpacity>
      </View>

       <Menu/>
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
  webview: {
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
  menuContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  topBadgeContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#57B33E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6BC24A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 26,
  },
  centerButton: {
    backgroundColor: "#5DBF4A",
    padding: 18,
    borderRadius: 40,
    marginTop: -30,
  },
  centerIcon: {
    fontSize: 30,
    color: "white",
  },
});
