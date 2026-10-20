import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export interface ArvoreData {
  id: string;
  name: string;
  deficiency: string | null;
  status: string;
  date: string;
}

interface ArvoreCardProps {
  arvore: ArvoreData;
  onPress: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  "Tratado": {
    bg: Palette.primary,
    text: Palette.white,
    icon: "checkmark",
  },
  "Não-Tratado": {
    bg: Palette.error,
    text: Palette.white,
    icon: "remove-circle-outline",
  },
  "Não tratado": {
    bg: Palette.error,
    text: Palette.white,
    icon: "remove-circle-outline",
  },
  "Em tratamento": {
    bg: Palette.orangePrimary,
    text: Palette.white,
    icon: "time-outline",
  },
  "Sem-informações": {
    bg: Palette.surfaceGray,
    text: Palette.textSecondary,
    icon: "remove-outline",
  },
};

const ArvoreCard: React.FC<ArvoreCardProps> = React.memo(({ arvore, onPress }) => {
  const currentStatus = statusConfig[arvore.status] ?? statusConfig["Sem-informações"];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{arvore.name}</Text>

        <View style={styles.badgesRow}>
          {arvore.deficiency && (
            <View
              style={[
                styles.badge,
                arvore.deficiency === "Manganês"
                  ? styles.badgeManganes
                  : styles.badgeAdverso,
              ]}
            >
              <Text style={styles.badgeTextWhite}>{arvore.deficiency}</Text>
            </View>
          )}

          <View style={[styles.badge, { backgroundColor: currentStatus.bg }]}>
            <Ionicons name={currentStatus.icon} size={12} color={currentStatus.text} />
            <Text style={[styles.badgeText, { color: currentStatus.text }]}>
              {arvore.status === "Sem-informações" ? "Não informado" : arvore.status}
            </Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Criado em: </Text>
          <Ionicons name="calendar-outline" size={12} color={Palette.textSecondary} />
          <Text style={styles.date}> {arvore.date}</Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={Palette.textPrimary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
});

ArvoreCard.displayName = "ArvoreCard";

export default ArvoreCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.base + 1,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeManganes: {
    backgroundColor: Palette.deficiencyManganese,
  },
  badgeAdverso: {
    backgroundColor: Palette.textSecondary,
  },
  badgeTextWhite: {
    color: Palette.white,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semiBold,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: FontSizes.xs - 1,
    color: Palette.textSecondary,
  },
  date: {
    fontSize: FontSizes.xs - 1,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  chevron: {
    marginLeft: 12,
  },
});