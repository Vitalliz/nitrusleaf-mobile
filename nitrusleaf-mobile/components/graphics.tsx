import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

type GraphVariant = "deficiency-percentage" | "monthly-comparison" | "probability";

interface GraphProps {
  variant: GraphVariant;
  data?: any;
  width?: number;
  height?: number;
}

export const Graph = ({ 
  variant, 
  data, 
  width = Dimensions.get('window').width - 40, 
  height = 220 
}: GraphProps) => {
  
  const renderGraph = () => {
    switch (variant) {
      case "deficiency-percentage":
        return renderDeficiencyPercentage();
      case "monthly-comparison":
        return renderMonthlyComparison();
      case "probability":
        return renderProbability();
      default:
        return null;
    }
  };

  const renderDeficiencyPercentage = () => {
    const customData = data || [
      { name: "Cobre", percentage: 45, color: "#6BC24A" },
      { name: "ManganÃªs", percentage: 30, color: "#FFA62B" },
      { name: "Adversos", percentage: 25, color: "#9C27B0" }
    ];

    return (
      <View style={[styles.container, styles.deficiencyContainer]}>
        <View style={styles.deficiencyHeader}>
          <Text style={styles.deficiencyMainTitle}>OCORRÃŠNCIAS TOTAIS DE</Text>
          <Text style={styles.deficiencySubTitle}>deficiÃªncias em %</Text>
        </View>
        
        <View style={styles.deficiencyContent}>
          <View style={styles.legendList}>
            {customData.map((item: any, index: number) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.deficiencyItem}>
                  <Text style={styles.boldText}>{item.name}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deficiencyFooter}>
          <Text style={styles.footerMainText}>56/87 PÃ©s</Text>
          <Text style={styles.footerSubText}>Total de pÃ©s analisados</Text>
        </View>
      </View>
    );
  };

  const renderMonthlyComparison = () => {
    const chartData = data || {
      labels: ["TalhÃ£o 1", "TalhÃ£o 2", "TalhÃ£o 3"],
      datasets: [
        {
          data: [22, 15, 18], // Cobre
        },
        {
          data: [12, 20, 8], // ManganÃªs
        }
      ]
    };

    return (
      <View style={[styles.container, styles.comparisonContainer]}>
        <View style={styles.comparisonHeader}>
          <Text style={styles.periodText}>Jan ~2024</Text>
        </View>

        <View style={styles.barChartContainer}>
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>25</Text>
            <Text style={styles.yAxisLabel}>20</Text>
            <Text style={styles.yAxisLabel}>15</Text>
            <Text style={styles.yAxisLabel}>10</Text>
            <Text style={styles.yAxisLabel}>5</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>

          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets,
              }}
              width={width * 0.8}
              height={160}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(107, 194, 74, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.4,
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#E5E5E5",
                },
              }}
              style={styles.barChart}
              fromZero
              showBarTops={false}
              withCustomBarColorFromData={true}
              flatColor={true}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </View>
        </View>

        <View style={styles.xAxisLabels}>
          {chartData.labels.map((label: string, index: number) => (
            <Text key={index} style={styles.xAxisLabel}>{label}</Text>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#6BC24A" }]} />
            <Text style={styles.legendText}>Cobre</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#FFA62B" }]} />
            <Text style={styles.legendText}>ManganÃªs</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProbability = () => {
    const percentage = data?.percentage || 92;
    const deficiency = data?.deficiency || "DeficiÃªncia de Cobre";

    return (
      <View style={[styles.container, styles.probabilityContainer]}>
        <Text style={styles.probabilitySubtitle}>Probabilidade de ser</Text>
        <Text style={styles.probabilityTitle}>{deficiency}</Text>
        
        <View style={styles.percentageCircle}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
        
        <Text style={styles.deficiencyName}>{deficiency}</Text>
      </View>
    );
  };

  return renderGraph();
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // Deficiency Percentage Styles
  deficiencyContainer: {
    alignItems: "center",
  },
  deficiencyHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  deficiencyMainTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  deficiencySubTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
  deficiencyContent: {
    width: "100%",
    marginBottom: 20,
  },
  legendList: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  deficiencyItem: {
    fontSize: 16,
    color: "#333",
  },
  boldText: {
    fontWeight: "700",
  },
  deficiencyFooter: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    width: "100%",
  },
  footerMainText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6BC24A",
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  // Monthly Comparison Styles
  comparisonContainer: {
    padding: 16,
  },
  comparisonHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  barChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  yAxis: {
    justifyContent: "space-between",
    height: 140,
    marginRight: 8,
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  chartWrapper: {
    flex: 1,
  },
  barChart: {
    marginVertical: 8,
  },
  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  // Probability Styles
  probabilityContainer: {
    alignItems: "center",
    padding: 24,
    borderWidth: 2,
    borderColor: "#6BC24A",
  },
  probabilitySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  probabilityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  percentageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6BC24A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#6BC24A",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  deficiencyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

// Componentes especÃ­ficos para cada variant
export const DeficiencyPercentageGraph = ({ data, width, height }: { data?: any; width?: number; height?: number }) => (
  <Graph variant="deficiency-percentage" data={data} width={width} height={height} />
);

export const MonthlyComparisonGraph = ({ data, width, height }: { data?: any; width?: number; height?: number }) => (
  <Graph variant="monthly-comparison" data={data} width={width} height={height} />
);

export const ProbabilityGraph = ({ percentage, deficiency, width, height }: { 
  percentage?: number; 
  deficiency?: string; 
  width?: number; 
  height?: number; 
}) => (
  <Graph 
    variant="probability" 
    data={{ percentage, deficiency }} 
    width={width} 
    height={height} 
  />
);