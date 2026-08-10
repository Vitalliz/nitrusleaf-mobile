import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";

export interface AnalysisData {
  id: string;
  label: string;
  status: "Tratado" | "Em tratamento" | "Não tratado" | "Não-Tratado" | string;
  date: string;
  probability?: number;
  deficiencyType?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    "Em tratamento": { bg: "#FBBF24", text: "#92400E", icon: "time-outline" },
    Tratado: { bg: "#10B981", text: "#FFFFFF", icon: "checkmark-done-outline" },
    "Não tratado": { bg: "#F44336", text: "#FFFFFF", icon: "close-circle-outline" },
    "Não-Tratado": { bg: "#F44336", text: "#FFFFFF", icon: "close-circle-outline" },
    "Sem-informações": { bg: "#9E9E9E", text: "#FFFFFF", icon: "help-circle-outline" },
  };

  const { bg, text, icon } = config[status] ?? {
    bg: "#9E9E9E",
    text: "#FFFFFF",
    icon: "help-circle-outline",
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={14} color={text} />
      <Text style={[styles.statusText, { color: text }]}>{status}</Text>
    </View>
  );
};

const AnalysisCard = React.memo(
  ({
    analysis,
    onVerAnalise,
  }: {
    analysis: AnalysisData;
    onVerAnalise: () => void;
  }) => (
    <View style={styles.container}>
      <Text style={styles.label}>{analysis.label}</Text>
      <StatusBadge status={analysis.status} />
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Criado em:</Text>
        <Ionicons name="calendar-outline" size={14} color="#777" />
        <Text style={styles.date}>{analysis.date}</Text>
      </View>
      <Button
        title="Ver análise"
        variant="primary"
        size="full"
        onPress={onVerAnalise}
      />
    </View>
  )
);

AnalysisCard.displayName = "AnalysisCard";

export default AnalysisCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#777",
  },
});
