// app/(tabs)/history.tsx - HISTORY SCREEN
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "@/components/footer";

export default function HistoryScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const history = [
    {
      id: 1,
      type: "watering",
      title: "Rega realizada",
      plantation: "Plantation A",
      amount: "500L",
      timestamp: "Hoje às 08:30",
      date: "28/10/2025",
      duration: "45 minutos",
    },
    {
      id: 2,
      type: "alert",
      title: "Alerta de umidade baixa",
      plantation: "Plantation C",
      humidity: "45%",
      timestamp: "Hoje às 06:15",
      date: "28/10/2025",
      recommendation: "Aumentar frequência de rega",
    },
    {
      id: 3,
      type: "inspection",
      title: "Inspeção concluída",
      plantation: "Plantation B",
      notes: "Plantação em perfeito estado",
      timestamp: "Ontem às 14:20",
      date: "27/10/2025",
      duration: "1 hora",
    },
    {
      id: 4,
      type: "maintenance",
      title: "Manutenção do sistema",
      plantation: "Sistema geral",
      status: "Concluído",
      timestamp: "26/10 às 10:00",
      date: "26/10/2025",
      details: "Calibração de sensores",
    },
    {
      id: 5,
      type: "photo",
      title: "Foto adicionada",
      plantation: "Plantation D",
      count: "5 fotos",
      timestamp: "25/10 às 16:45",
      date: "25/10/2025",
    },
    {
      id: 6,
      type: "report",
      title: "Relatório gerado",
      plantation: "Plantation A",
      report: "Relatório mensal de produção",
      timestamp: "24/10 às 09:00",
      date: "24/10/2025",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "watering":
        return "water";
      case "alert":
        return "alert-circle";
      case "inspection":
        return "checkmark-circle";
      case "maintenance":
        return "hammer";
      case "photo":
        return "camera";
      case "report":
        return "document";
      default:
        return "information-circle";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "watering":
        return "#3B82F6";
      case "alert":
        return "#E74C3C";
      case "inspection":
        return "#2ECC71";
      case "maintenance":
        return "#F39C12";
      case "photo":
        return "#9B59B6";
      case "report":
        return "#1ABC9C";
      default:
        return "#95A5A6";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico de Atividades</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {history.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.timelineItem}
                onPress={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
              >
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: getTypeColor(item.type) },
                    ]}
                  >
                    <Ionicons
                      name={getTypeIcon(item.type) as any}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                  {index < history.length - 1 && <View style={styles.line} />}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.contentHeader}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Ionicons
                      name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#999"
                    />
                  </View>
                  <Text style={styles.plantation}>{item.plantation}</Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>

                  {expandedId === item.id && (
                    <View style={styles.expandedContent}>
                      {item.type === "watering" && (
                        <>
                          <Text style={styles.detailText}>
                            Volume: {item.amount}
                          </Text>
                          <Text style={styles.detailText}>
                            Duração: {item.duration}
                          </Text>
                        </>
                      )}
                      {item.type === "alert" && (
                        <>
                          <Text style={styles.detailText}>
                            Umidade: {item.humidity}
                          </Text>
                          <Text style={styles.detailText}>
                            Recomendação: {item.recommendation}
                          </Text>
                        </>
                      )}
                      {item.type === "inspection" && (
                        <>
                          <Text style={styles.detailText}>
                            Observações: {item.notes}
                          </Text>
                          <Text style={styles.detailText}>
                            Duração: {item.duration}
                          </Text>
                        </>
                      )}
                      {item.type === "maintenance" && (
                        <>
                          <Text style={styles.detailText}>
                            Status: {item.status}
                          </Text>
                          <Text style={styles.detailText}>
                            Detalhes: {item.details}
                          </Text>
                        </>
                      )}
                      {item.type === "photo" && (
                        <Text style={styles.detailText}>
                          Adicionadas: {item.count}
                        </Text>
                      )}
                      {item.type === "report" && (
                        <Text style={styles.detailText}>
                          Tipo: {item.report}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 15,
    width: 40,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#DDD",
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginTop: 2,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B2B2B",
    flex: 1,
  },
  plantation: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "#CCC",
    marginTop: 2,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    lineHeight: 18,
  },
  spacer: {
    height: 40,
  },
});