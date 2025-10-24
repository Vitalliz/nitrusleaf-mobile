import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CardSize = "337" | "363" | "364" | "370" | "378";
type CardVariant = "default" | "stats" | "map" | "talhao" | "deficiency" | "analysis";

interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
  stats?: { label: string; value: string }[];
  percentage?: number;
  deficiency?: string;
  onPress?: () => void;
  size?: CardSize;
  variant?: CardVariant;
  showArrow?: boolean;
}

export const Card = ({
  title,
  subtitle,
  content,
  items,
  stats,
  percentage,
  deficiency,
  onPress,
  size = "378",
  variant = "default",
  showArrow = false,
}: CardProps) => {
  const sizeStyle = cardSizes[size];
  const variantStyle = cardVariants[variant];

  const renderContent = () => {
    switch (variant) {
      case "stats":
        return (
          <View style={styles.statsContent}>
            <Text style={styles.statsTitle}>{title}</Text>
            {stats?.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        );

      case "analysis":
        return (
          <View style={styles.analysisContent}>
            <Text style={styles.analysisTitle}>Ocorrências totais de deficiências em %</Text>
            {items?.map((item, index) => (
              <Text key={index} style={styles.analysisItem}>{item}</Text>
            ))}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{content}</Text>
              <Text style={styles.footerSubtext}>Total de pés analisados</Text>
            </View>
          </View>
        );

      case "deficiency":
        return (
          <View style={styles.deficiencyContent}>
            <Text style={styles.deficiencySubtitle}>Probabilidade de ser</Text>
            <Text style={styles.deficiencyTitle}>{deficiency}</Text>
            <Text style={styles.percentage}>{percentage}%</Text>
            <Text style={styles.deficiencyName}>{deficiency}</Text>
          </View>
        );

      case "talhao":
        return (
          <View style={styles.talhaoContent}>
            <Text style={styles.talhaoTitle}>{title}</Text>
            <Text style={styles.talhaoSubtitle}>{subtitle}</Text>
            <View style={styles.talhaoFooter}>
              <Text style={styles.talhaoCount}>{content}</Text>
              <TouchableOpacity style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case "map":
        return (
          <View style={styles.mapContent}>
            <Text style={styles.mapTitle}>{title}</Text>
            <Text style={styles.mapSubtitle}>{subtitle}</Text>
            <Text style={styles.mapAddress}>{content}</Text>
            <Text style={styles.mapYear}>Titulo: 2020</Text>
          </View>
        );

      default:
        return (
          <View style={styles.defaultContent}>
            {title && <Text style={styles.defaultTitle}>{title}</Text>}
            {subtitle && <Text style={styles.defaultSubtitle}>{subtitle}</Text>}
            {content && <Text style={styles.defaultContentText}>{content}</Text>}
            {items?.map((item, index) => (
              <Text key={index} style={styles.defaultItem}>{item}</Text>
            ))}
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, sizeStyle, variantStyle]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {renderContent()}
      {showArrow && (
        <View style={styles.arrow}>
          <Ionicons name="chevron-forward" size={20} color="#6BC24A" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const cardSizes = StyleSheet.create({
  "337": {
    width: 337,
    minHeight: 120,
  },
  "363": {
    width: 363,
    minHeight: 140,
  },
  "364": {
    width: 364,
    minHeight: 150,
  },
  "370": {
    width: 370,
    minHeight: 160,
  },
  "378": {
    width: 378,
    minHeight: 180,
  },
});

const cardVariants = StyleSheet.create({
  default: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  stats: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  map: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6BC24A",
  },
  talhao: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderLeftWidth: 4,
    borderLeftColor: "#6BC24A",
  },
  deficiency: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#6BC24A",
    borderRadius: 12,
  },
  analysis: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
  },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // Default Content
  defaultContent: {
    flex: 1,
  },
  defaultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  defaultSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  defaultContentText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  defaultItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    paddingLeft: 8,
  },
  // Stats Content (Histórico)
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  // Analysis Content (Análises Gerais)
  analysisContent: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  analysisItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    paddingLeft: 12,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6BC24A",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#666",
  },
  // Deficiency Content (Resultado)
  deficiencyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  deficiencySubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  deficiencyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  percentage: {
    fontSize: 48,
    fontWeight: "700",
    color: "#6BC24A",
    marginBottom: 8,
  },
  deficiencyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // Talhão Content
  talhaoContent: {
    flex: 1,
  },
  talhaoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  talhaoSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  talhaoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  talhaoCount: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  closeButton: {
    padding: 4,
  },
  // Map Content
  mapContent: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  mapAddress: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    lineHeight: 16,
  },
  mapYear: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  arrow: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
  },
});

// Componentes específicos baseados nas telas
export const HistoricoCard = ({ onPress }: { onPress?: () => void }) => (
  <Card
    title="Talhões registrados"
    items={["Total de pés", "Pés Diagnosticados", "Pés analisados"]}
    size="378"
    variant="stats"
    onPress={onPress}
    showArrow={true}
  />
);

export const AnalisesCard = ({ onPress }: { onPress?: () => void }) => (
  <Card
    title="Ocorrências totais de deficiências em %"
    items={["Cobre", "Manganês", "Adversos"]}
    content="56/87 Pés"
    size="370"
    variant="analysis"
    onPress={onPress}
  />
);

export const DeficiencyCard = ({ percentage = 92, onPress }: { percentage?: number; onPress?: () => void }) => (
  <Card
    deficiency="Deficiência de Cobre"
    percentage={percentage}
    size="364"
    variant="deficiency"
    onPress={onPress}
  />
);

export const TalhaoCard = ({ 
  title = "Talhão 1", 
  subtitle = "Propriedade 1", 
  content = "27/32 pés analisados",
  onPress 
}: { 
  title?: string; 
  subtitle?: string; 
  content?: string; 
  onPress?: () => void 
}) => (
  <Card
    title={title}
    subtitle={subtitle}
    content={content}
    size="363"
    variant="talhao"
    onPress={onPress}
  />
);

export const MapCard = ({ onPress }: { onPress?: () => void }) => (
  <Card
    title="Fazenda Rocha"
    subtitle="Propriedade 1"
    content="Rocha Zombia, Par. + Açu - SP,"
    size="337"
    variant="map"
    onPress={onPress}
  />
);

export const ConfigCard = ({ 
  title, 
  items, 
  size = "378",
  onPress 
}: { 
  title: string; 
  items: string[]; 
  size?: CardSize;
  onPress?: () => void 
}) => (
  <Card
    title={title}
    items={items}
    size={size}
    variant="default"
    onPress={onPress}
    showArrow={true}
  />
);