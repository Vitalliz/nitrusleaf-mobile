import Footer from "@/components/footer";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LocationMapScreenWeb() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Localização de pés</Text>
        <Text style={styles.message}>
          O mapa interativo está disponível no app Android ou iOS. Use o Expo Go ou
          um build nativo para visualizar a localização das árvores.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF1E5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2D2D",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "#5C5C5C",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F4A024",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
