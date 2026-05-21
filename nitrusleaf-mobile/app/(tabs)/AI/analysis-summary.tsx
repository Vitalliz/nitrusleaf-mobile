import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { GaugeChart } from "@/components/charts/gaugechart";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";

export default function AnalysisSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Receber parâmetros da câmera
  const analysisId = params.analysisId as string || "006";
  const probability = Number(params.probability) || 0;
  const deficiencyType = params.deficiencyType as "Cobre" | "Manganês" | "Saudável" || "Saudável";
  const date = params.date as string || new Date().toLocaleDateString('pt-BR');
  const author = params.author as string || "Roberto Almeida";
  const talhao = params.talhao as string || "Talhão 3";
  const tree = params.tree as string || "Árvore 6";

  const [view, setView] = useState<"result" | "summary">("result");

  const accentColor =
    deficiencyType === "Cobre"
      ? "#E65723"
      : deficiencyType === "Manganês"
      ? "#FBBF24"
      : "#58B741";

  const handleBack = () => {
    router.back();
  };

  const handleVerResumo = () => {
    setView("summary");
  };

  const handleInfoPress = () => {
    Alert.alert("O que significa?", "Esta análise foi baseada na imagem enviada. Consulte um agrônomo para recomendações específicas.");
  };

  // Tela de Resultado
  if (view === "result") {
    return (
      <Background>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <View style={styles.backCircle}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Resultado da análise</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={[styles.card, { borderTopColor: accentColor }]}>
              <Text style={styles.analysisId}>Análise #{analysisId}</Text>
              <View style={styles.divider} />

              <View style={styles.gaugeContainer}>
                <View style={{ padding: 10 }}>
                  <GaugeChart
                    percentage={probability}
                    size={280}
                    showPercentage={true}
                    deficiencyType={deficiencyType}
                  />
                </View>
              </View>

              <Text style={styles.probabilityLabel}>Probabilidade estimada</Text>
              <Text style={[styles.deficiencyTitle, { color: accentColor }]}>
                {deficiencyType === "Saudável"
                  ? "Nenhuma deficiência detectada"
                  : `Deficiência de ${deficiencyType}`}
              </Text>

              <Button title="Ver resumo técnico" variant="primary" size="full" onPress={handleVerResumo} />
            </View>

            <Text style={styles.note}>
              Esta análise foi baseada na imagem enviada. Consulte um agrônomo para recomendações específicas.
            </Text>
            <TouchableOpacity style={styles.infoCard} onPress={handleInfoPress} activeOpacity={0.85}>
              <View style={styles.infoContent}>
                <View>
                  <Text style={styles.infoTitle}>O que significa?</Text>
                  <Text style={styles.infoSubtitle}>Clique para saber mais</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Background>
    );
  }

  // Tela de Resumo Técnico
  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/AI/home')}>
            <View style={styles.backCircle}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo da Análise</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { borderTopColor: accentColor }]}>
            {/* ID + Data */}
            <View style={styles.rowSpaced}>
              <Text style={styles.analysisId}>Análise #{analysisId}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={13} color="#888" />
                <Text style={styles.dateText}>{date}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* Deficiência */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deficiência detectada:</Text>
              <View style={[styles.badge, { backgroundColor: accentColor }]}>
                <Text style={styles.badgeText}>{deficiencyType}</Text>
              </View>
            </View>

            {/* Probabilidade */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Probabilidade estimada da IA:</Text>
              <Text style={[styles.infoValue, { color: accentColor, fontWeight: "700" }]}>
                {probability}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${probability}%`, backgroundColor: accentColor }]} />
            </View>

            <View style={styles.divider} />

            {/* Autor */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Autor da análise:</Text>
              <View style={styles.authorRow}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={12} color="#fff" />
                </View>
                <Text style={styles.infoValue}>{author}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Localização */}
            <Text style={styles.sectionTitle}>Localização da amostra</Text>
            <View style={styles.locationRow}>
              <View style={styles.locationChip}>
                <Ionicons name="lock-closed-outline" size={12} color="#555" />
                <Text style={styles.locationChipText}>{talhao}</Text>
              </View>
              <View style={styles.locationChip}>
                <Ionicons name="lock-closed-outline" size={12} color="#555" />
                <Text style={styles.locationChipText}>{tree}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#FAF1E5",
  },
  backBtn: { width: 40 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#6BC24A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A2C3E" },
  container: {
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  analysisId: { fontSize: 16, fontWeight: "700", color: "#98979F", marginBottom: 12 },
  divider: { height: 0.9, backgroundColor: "#98979F", marginVertical: 14, borderRadius: 5 },
  gaugeContainer: { alignItems: "center", justifyContent: "center", marginBottom: 16, padding: 8 },
  probabilityLabel: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 6 },
  deficiencyTitle: { fontSize: 20, fontWeight: "800", textAlign: "center", marginBottom: 24 },
  infoCard: { backgroundColor: "#6BC24A", borderRadius: 12, padding: 18 },
  infoContent: { alignItems: "center", justifyContent: "center" },
  infoTitle: { fontSize: 17, fontWeight: "700", color: "#FFF", marginBottom: 2 },
  infoSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  note: { fontSize: 12, color: "#888", textAlign: "center", paddingHorizontal: 8 },
  
  // Summary styles
  rowSpaced: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 14, color: "#888" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  infoLabel: { fontSize: 16, color: "#666", flex: 1 },
  infoValue: { fontSize: 16, color: "#1A2C3E" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  progressBar: { height: 14, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 6, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  avatarCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#9CA3AF", alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1A2C3E", marginBottom: 10 },
  locationRow: { flexDirection: "row", gap: 8, marginBottom: 8, flexWrap: "wrap" },
  locationChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  locationChipText: { fontSize: 14, color: "#1A2C3E", fontWeight: "500" },
});