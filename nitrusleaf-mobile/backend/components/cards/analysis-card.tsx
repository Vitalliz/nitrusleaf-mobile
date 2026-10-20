import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export interface AnalysisData {
  id: string;
  label: string;
  status: "Tratado" | "Em tratamento" | "Não tratado" | "Não-Tratado" | string;
  date: string;
  probability?: number;
  deficiencyType?: string;
}

const statusConfig: Record<string, { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  "Tratado": {
    bg: Palette.primary,
    text: Palette.white,
    icon: "checkmark",
  },
  "Não tratado": {
    bg: Palette.error,
    text: Palette.white,
    icon: "close-circle-outline",
  },
  "Não-Tratado": {
    bg: Palette.error,
    text: Palette.white,
    icon: "close-circle-outline",
  },
  "Em tratamento": {
    bg: Palette.orangePrimary,
    text: Palette.white,
    icon: "time-outline",
  },
  "Sem-informações": {
    bg: Palette.surfaceGray,
    text: Palette.textSecondary,
    icon: "help-circle-outline",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const current = statusConfig[status] ?? statusConfig["Sem-informações"];

  return (
    <View style={[styles.statusBadge, { backgroundColor: current.bg }]}>
      <Ionicons name={current.icon} size={13} color={current.text} />
      <Text style={[styles.statusText, { color: current.text }]}>{status}</Text>
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
        <Ionicons name="calendar-outline" size={13} color={Palette.textSecondary} />
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
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: FontSizes.base + 1,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  dateLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Palette.textSecondary,
  },
  date: {
    fontSize: FontSizes.xs,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
});