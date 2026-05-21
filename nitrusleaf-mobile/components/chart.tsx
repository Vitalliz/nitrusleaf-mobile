// components/Charts/SimpleCharts.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const SimpleDonutChart = ({
  data,
  centerText,
}: {
  data: { name: string; percentage: number; color: string }[];
  centerText?: string;
}) => {
  const total = data.reduce((sum, item) => sum + item.percentage, 0);

  let cumulative = 0;

  return (
    <View style={styles.donutContainer}>
      <View style={styles.donutWrapper}>
        {data.map((item, index) => {
          const rotation = (cumulative / total) * 360;
          const angle = (item.percentage / total) * 360;
          cumulative += item.percentage;

          return (
            <View
              key={index}
              style={[
                styles.slice,
                {
                  borderColor: item.color,
                  transform: [{ rotate: `${rotation}deg` }],
                },
              ]}
            >
              <View
                style={[
                  styles.sliceFill,
                  {
                    borderColor: item.color,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            </View>
          );
        })}

        {/* CENTRO */}
        <View style={styles.donutHole}>
          <Text style={styles.donutText}>{centerText || `${total}%`}</Text>
        </View>
      </View>
    </View>
  );
};
// Barras de Progresso Horizontais
export const SimpleBarChart = ({
  data,
}: {
  data: { label: string; value: number; max: number; color: string }[];
}) => {
  return (
    <View style={styles.barContainer}>
      {data.map((item, idx) => (
        <View key={idx} style={styles.barItem}>
          <View style={styles.barHeader}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${(item.value / item.max) * 100}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
          <Text style={styles.barPercentage}>
            {Math.round((item.value / item.max) * 100)}%
          </Text>
        </View>
      ))}
    </View>
  );
};
export const SimpleColumnChart = ({
  data,
}: {
  data: {
    label: string;
    values: { value: number; color: string }[];
  }[];
}) => {
  const maxValue = Math.max(
    ...data.flatMap((item) => item.values.map((v) => v.value)),
  );

  return (
    <View style={columnStyles.container}>
      {/* Linhas de fundo (grid) */}
      <View style={columnStyles.grid}>
        {[0, 5, 10, 15, 20].reverse().map((line, idx) => (
          <View key={idx} style={columnStyles.gridLine}>
            <Text style={columnStyles.gridLabel}>{line}</Text>
            <View style={columnStyles.gridDivider} />
          </View>
        ))}
      </View>

      {/* Barras */}
      <View style={columnStyles.chartArea}>
        {data.map((item, idx) => (
          <View key={idx} style={columnStyles.group}>
            <View style={columnStyles.barsWrapper}>
              {item.values.map((bar, i) => (
                <View
                  key={i}
                  style={[
                    columnStyles.bar,
                    {
                      height: `${(bar.value / maxValue) * 100}%`,
                      backgroundColor: bar.color,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={columnStyles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  donutContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  donutWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: "relative",
  },

  slice: {
    width: 120,
    height: 120,
    position: "absolute",
    borderRadius: 60,
    overflow: "hidden",
  },

  sliceFill: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 20,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },

  donutHole: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  donutText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A2C3E",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  barContainer: {
    marginVertical: 10,
    gap: 12,
  },
  barItem: {
    marginBottom: 8,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  barValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  barBackground: {
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  barPercentage: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    textAlign: "right",
  },
});

export const SimpleGaugeChart = ({
  percentage,
  label,
}: {
  percentage: number;
  label?: string;
}) => {
  return (
    <View style={gaugeStyles.container}>
      <View style={gaugeStyles.gaugeBackground}>
        <View style={[gaugeStyles.gaugeFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={gaugeStyles.percentage}>{percentage}%</Text>
      {label && <Text style={gaugeStyles.label}>{label}</Text>}
    </View>
  );
};

const columnStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 160,
  },
  group: {
    alignItems: "center",
  },
  barsWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 120,
  },
  bar: {
    width: 14,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },

  grid: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    bottom: 30,
    justifyContent: "space-between",
  },

  gridLine: {
    flexDirection: "row",
    alignItems: "center",
  },

  gridLabel: {
    width: 20,
    fontSize: 10,
    color: "#888",
  },

  gridDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
    marginLeft: 4,
  },
});

const gaugeStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  gaugeBackground: {
    width: "100%",
    height: 100,
    backgroundColor: "#E5E5E5",
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
  },
  gaugeFill: {
    height: 100,
    backgroundColor: "#58B741",
    borderRadius: 50,
    position: "absolute",
    left: 0,
    top: 0,
  },
  percentage: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A2C3E",
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
