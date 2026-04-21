import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { Header } from "@/components/header";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { SimpleColumnChart } from "@/components/chart";
import BottomNavbar from "@/components/ui/menu";

export default function Dashboard() {
  const columnData = [
    {
      label: "Talhão 1",
      values: [
        { value: 13, color: "#D84315" },
        { value: 18, color: "#F9A825" },
      ],
    },
    {
      label: "Talhão 2",
      values: [
        { value: 13, color: "#D84315" },
        { value: 11, color: "#F9A825" },
      ],
    },
    {
      label: "Talhão 3",
      values: [
        { value: 12, color: "#D84315" },
        { value: 8, color: "#F9A825" },
      ],
    },
  ];

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title={""} />

        <ScrollView contentContainerStyle={styles.content}>
          {/* HEADER */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Análises Gerais</Text>
            <Text style={styles.date}>02 Fev, 2026</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Deficiência por talhão</Text>

            <SimpleColumnChart data={columnData} />

            {/* LEGENDA */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#D84315" }]}
                />
                <Text style={styles.legendText}>Cobre</Text>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#F9A825" }]}
                />
                <Text style={styles.legendText}>Manganês</Text>
              </View>
            </View>

            {/* BOTÃO USANDO SEU COMPONENTE */}
            <Button
              title="Detalhar"
              variant="primary"
              size="full"
              onPress={() => console.log("Detalhar")}
            />
          </View>

           <View style={styles.card}>
            <Text style={styles.cardTitle}>Deficiência por talhão</Text>

            <SimpleColumnChart data={columnData} />

            {/* LEGENDA */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#D84315" }]}
                />
                <Text style={styles.legendText}>Cobre</Text>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#F9A825" }]}
                />
                <Text style={styles.legendText}>Manganês</Text>
              </View>
            </View>

            {/* BOTÃO USANDO SEU COMPONENTE */}
            <Button
              title="Detalhar"
              variant="primary"
              size="full"
              onPress={() => console.log("Detalhar")}
            />
          </View>
          <BottomNavbar></BottomNavbar>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A2C3E",
  },

  date: {
    fontSize: 14,
    color: "#666",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1A2C3E",
  },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 16,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#555",
  },
});