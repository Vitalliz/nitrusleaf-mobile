
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { Background } from "@/components/ui/background";
import { Header } from "@/components/header";
import BottomNavbar from "@/components/ui/menu";
import { CustomCard } from "@/components/card";
import {
  SimpleDonutChart,
  SimpleBarChart,
  SimpleGaugeChart,
} from "@/components/chart";

export default function HomeScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 BUSCA DA IA/API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("https://sua-api.com/analise"); // 🔥 troque pela sua API
  //       const json = await response.json();
  //       setData(json);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Erro ao carregar dados");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fakeData = {
      totalTrees: 87,
      analyzedTrees: 56,
      deficientTrees: 42,
      user: {
        name: "Roberto Almeida",
        property: "Sítio Santa Aurora",
      },
      date: "02 Fev, 2026",
      deficiencies: [
        { name: "Manganês", percentage: 43, count: 24 },
        { name: "Cobre", percentage: 19, count: 10 },
        { name: "Adversos", percentage: 38, count: 21 },
      ],
      talhoes: [
        {
          id: "01",
          name: "Talhão #01",
          analyzed: 27,
          total: 32,
          date: "02 Fev, 2026",
        },
      ],
      analysis: {},
    };

    setTimeout(() => {
      setData(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    //     const processAIData = (rawData: any) => {
    //   if (!rawData?.deficiencies) return [];

    //   const total = rawData.deficiencies.reduce(
    //     (sum: number, item: any) => sum + (item.count ?? item.percentage ?? 0),
    //     0
    //   );

    //   return rawData.deficiencies.map((item: any) => {
    //     const value = item.count ?? item.percentage ?? 0;

    //     return {
    //       name: item.name,
    //       count: value,
    //       percentage:
    //         total > 0 ? Math.round((value / total) * 100) : 0,
    //       color:
    //         item.name === "Cobre"
    //           ? "#D35400"
    //           : item.name === "Manganês"
    //           ? "#F5A623"
    //           : "#9E9E9E",
    //     };
    //   });
    // };
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6BC24A" />
        <Text style={styles.loadingText}>Carregando análises...</Text>
      </View>
    );
  }

  const totalTrees = data?.totalTrees ?? 0;
  const analyzedTrees = data?.analyzedTrees ?? 0;
  const deficientTrees = data?.deficientTrees ?? 0;
  const deficiencies = data?.deficiencies ?? [];
  // const deficiencies = processAIData(data);
  const talhoes = data?.talhoes ?? [];
  const analysis = data?.analysis ?? {};

  // Calcula porcentagem para o progresso
  const progressPercentage =
    totalTrees > 0 ? (analyzedTrees / totalTrees) * 100 : 0;

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        {/* ✅ HEADER FIXO */}
        <Header title={data?.user?.name} subtitle={data?.user?.property} />

        {/* ✅ CONTEÚDO */}
        <ScrollView contentContainerStyle={styles.container}>
          {/* TÍTULO */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Análises Gerais</Text>

            <View style={styles.dateRow}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.date}>{data?.date}</Text>
            </View>
          </View>
          {/* DADOS GERAIS EM CARDS */}
          <CustomCard
            variant="yellow"
            bottomContent={
              <View style={styles.statusContainer}>
                {/* Lado esquerdo */}
                <View style={styles.statusItem}>
                  <Text style={styles.statusPercentage}>43%</Text>
                  <View style={styles.badgeYellow}>
                    <Text style={styles.badgeText}>Manganês</Text>
                  </View>
                </View>

                {/* Divisor */}
                <View style={styles.divider} />

                {/* Lado direito */}
                <View style={styles.statusItem}>
                  <Text style={styles.statusPercentage}>19%</Text>
                  <View style={styles.badgeOrange}>
                    <Text style={styles.badgeText}>Cobre</Text>
                  </View>
                </View>
              </View>
            }
          >
            <Text style={styles.topTextYellow}>Status Nutricional</Text>
          </CustomCard>
          
          {/* <CustomCard
            variant="red"
            bottomContent={
              <View>
                <Text style={styles.statValue}>{deficientTrees}</Text>
                <Text style={styles.statLabel}>Árvores com deficiência</Text>
              </View>
            }
          >
            <Text style={styles.topTextWhite}>⚠️ DEFICIÊNCIAS DETECTADAS</Text>
          </CustomCard> */}
          {/* GRID DEFICIÊNCIAS */}
          <CustomCard
            variant="gray"
            bottomContent={
              <View>
                {/* 🔥 LINHA SUPERIOR */}

                <View style={styles.coverageContainer}>
                  <View style={styles.coverageHeader}>
                    <View>
                      {/* Quantidade */}
                      <Text style={styles.coverageValue}>
                        {analyzedTrees}/{totalTrees} árvores analisadas
                      </Text>

                      {/* Aviso */}
                      <View style={styles.warningRow}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                        <Text style={styles.warningText}>
                          {totalTrees - analyzedTrees} árvores não analisadas
                        </Text>
                      </View>
                    </View>

                    <View style={styles.treeIcon}>
                      <View style={styles.treeCircle} />
                      <View style={styles.treeTrunk} />
                    </View>
                  </View>

                  <View style={styles.separator} />

                  {/* Barra de progresso */}
                  <SimpleBarChart
                    data={[
                      {
                        label: "Árvores analisadas",
                        value: analyzedTrees,
                        max: totalTrees,
                        color: "#F5A623",
                      },
                    ]}
                  />
                </View>
              </View>
            }
          >
            <Text style={styles.cardTitle}>Cobertura das Análises</Text>
          </CustomCard>
          {/* COBERTURA DAS ANÁLISES */}
          <CustomCard
            variant="white"
            bottomContent={
              <View style={{ width: "100%" }}>
                {/* TÍTULO */}
                <Text style={styles.cardTitle}>
                  Ocorrências totais de deficiências em %
                </Text>

                <View style={styles.row}>
                  <View style={styles.chartContainer}>
                    <SimpleDonutChart
                      centerText={`${analyzedTrees}/${totalTrees}`}
                      data={deficiencies.map((d: any) => ({
                        name: d.name,
                        percentage: d.percentage,
                        color:
                          d.name === "Cobre"
                            ? "#D35400"
                            : d.name === "Manganês"
                              ? "#F5A623"
                              : "#9E9E9E",
                      }))}
                    />
                  </View>

                  <View style={styles.legendContainer}>
                    {deficiencies.map((item: any) => (
                      <View key={item.name} style={styles.legendRow}>
                        <View
                          style={[
                            styles.badge,
                            {
                              backgroundColor:
                                item.name === "Cobre"
                                  ? "#D35400"
                                  : item.name === "Manganês"
                                    ? "#F5A623"
                                    : "#9E9E9E",
                            },
                          ]}
                        >
                          <Text style={styles.badgeText}>
                            {item.percentage}%
                          </Text>
                        </View>

                        <Text style={styles.legendText}>{item.name}</Text>

                        <Text style={styles.legendValue}>{item.count}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* BOTÃO */}
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </ScrollView>

        <BottomNavbar />
      </SafeAreaView>
    </Background>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingBottom: 120,
    paddingTop: 12,
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 16,
    width: "100%",
    maxWidth: 385,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2C3E",
  },

  date: {
    fontSize: 14,
    color: "#888",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dateIcon: {
    fontSize: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
  },

  cardTitleCenter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2C3E",
    textAlign: "center",
  },

  topTextYellow: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },

  /* STATUS NUTRICIONAL */
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusItem: {
    alignItems: "center",
    flex: 1,
  },

  statusPercentage: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A2C3E",
  },

  divider: {
    width: 1,
    height: 45,
    backgroundColor: "#ddd",
  },

  badgeYellow: {
    marginTop: 6,
    backgroundColor: "#F5A623",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },

  badgeOrange: {
    marginTop: 6,
    backgroundColor: "#D35400",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  /* COBERTURA */
  coverageContainer: {
    marginTop: 10,
    width: "100%",
  },

  coverageValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A2C3E",
  },

  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  warningIcon: {
    marginRight: 6,
  },

  warningText: {
    color: "#F5A623",
    fontWeight: "500",
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#F5A623",
    borderRadius: 10,
  },

  /* DONUT + LISTA */
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  chartContainer: {
    flex: 1,
    alignItems: "center",
  },

  legendContainer: {
    flex: 1,
    justifyContent: "space-around",
    paddingLeft: 10,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  legendText: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "500",
    color: "#1A2C3E",
  },

  legendValue: {
    fontWeight: "bold",
    color: "#333",
  },

  button: {
    backgroundColor: "#7ACB5A",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  topLineYellow: {
  height: 6,
  backgroundColor: "#F5A623",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  marginBottom: 10,
},

topLineGray: {
  height: 6,
  backgroundColor: "#9E9E9E",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  marginBottom: 10,
},

coverageHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

separator: {
  height: 1,
  backgroundColor: "#ddd",
  marginVertical: 10,
},

/* 🌳 árvore estilo do print */
treeIcon: {
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 10,
},

treeCircle: {
  width: 44,
  height: 44,
  borderRadius: 22,
  borderWidth: 3,
  borderColor: "#58B741",
},

treeTrunk: {
  width: 4,
  height: 18,
  backgroundColor: "#58B741",
  marginTop: -6,
}
});
