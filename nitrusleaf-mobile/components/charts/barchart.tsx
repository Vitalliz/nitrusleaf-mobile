// components/charts/EvolutionBarChart.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';

export type TimePeriod = '6months' | '3months' | '1month';

export interface EvolutionData {
  period: string;
  cobre: number;
  manganes: number;
}

interface EvolutionBarChartProps {
  data: EvolutionData[];
  onPeriodChange?: (period: TimePeriod) => void;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const CHART_PADDING = 40;
const BAR_WIDTH = 28;
const BAR_GAP = 6;

export const EvolutionBarChart: React.FC<EvolutionBarChartProps> = ({
  data,
  onPeriodChange,
  height = 280,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('6months');

  const periods: { label: string; value: TimePeriod }[] = [
    { label: 'Últimos 6 meses', value: '6months' },
    { label: 'Últimos 3 meses', value: '3months' },
    { label: 'Último mês', value: '1month' },
  ];

  const handlePeriodPress = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const maxValue = Math.max(
    ...data.flatMap(item => [item.cobre, item.manganes]),
    50
  );
  const yAxisMax = Math.ceil(maxValue / 10) * 10;
  const yAxisSteps = [0, 10, 20, 30, 40, 50].filter(step => step <= yAxisMax);
  
  const chartWidth = screenWidth - 64; // 32px padding total
  const groupWidth = BAR_WIDTH * 2 + BAR_GAP;
  const totalGroupsWidth = groupWidth * data.length;
  const startX = (chartWidth - totalGroupsWidth) / 2 + CHART_PADDING;

  const getBarHeight = (value: number) => {
    return (value / yAxisMax) * (height - 50);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolução das deficiências (%)</Text>

      {/* Period Filters */}
      <View style={styles.filterContainer}>
        {periods.map(period => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.filterButton,
              selectedPeriod === period.value && styles.filterButtonActive,
            ]}
            onPress={() => handlePeriodPress(period.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedPeriod === period.value && styles.filterTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={[styles.chartContainer, { height }]}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="cobreGrad" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor="#E65723" stopOpacity={0.8} />
              <Stop offset="100%" stopColor="#E65723" stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="manganesGrad" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor="#FBBF24" stopOpacity={0.8} />
              <Stop offset="100%" stopColor="#FBBF24" stopOpacity={1} />
            </LinearGradient>
          </Defs>

          {/* Y-axis grid lines */}
          {yAxisSteps.map((step) => {
            const y = height - 40 - (step / yAxisMax) * (height - 50);
            return (
              <G key={step}>
                <Line
                  x1={CHART_PADDING - 5}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#E5E5E5"
                  strokeWidth={1}
                  strokeDasharray="6,4"
                />
                <SvgText
                  x={CHART_PADDING - 10}
                  y={y + 4}
                  fontSize={11}
                  fill="#888"
                  textAnchor="end"
                >
                  {step}
                </SvgText>
              </G>
            );
          })}

          {/* Bars */}
          {data.map((item, groupIndex) => {
            const groupX = startX + groupIndex * groupWidth;
            const cobreHeight = getBarHeight(item.cobre);
            const manganesHeight = getBarHeight(item.manganes);
            const baseY = height - 40;

            return (
              <G key={groupIndex}>
                {/* Cobre Bar (left) */}
                <Rect
                  x={groupX}
                  y={baseY - cobreHeight}
                  width={BAR_WIDTH}
                  height={cobreHeight}
                  fill="url(#cobreGrad)"
                  rx={4}
                />
                {/* Value label for Cobre */}
                {item.cobre > 0 && (
                  <SvgText
                    x={groupX + BAR_WIDTH / 2}
                    y={baseY - cobreHeight - 5}
                    fontSize={10}
                    fill="#E65723"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {item.cobre}
                  </SvgText>
                )}
                
                {/* Manganês Bar (right) */}
                <Rect
                  x={groupX + BAR_WIDTH + BAR_GAP}
                  y={baseY - manganesHeight}
                  width={BAR_WIDTH}
                  height={manganesHeight}
                  fill="url(#manganesGrad)"
                  rx={4}
                />
                {/* Value label for Manganês */}
                {item.manganes > 0 && (
                  <SvgText
                    x={groupX + BAR_WIDTH + BAR_GAP + BAR_WIDTH / 2}
                    y={baseY - manganesHeight - 5}
                    fontSize={10}
                    fill="#FBBF24"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {item.manganes}
                  </SvgText>
                )}
                
                {/* X-axis label */}
                <SvgText
                  x={groupX + BAR_WIDTH + 4}
                  y={baseY + 16}
                  fontSize={12}
                  fill="#666"
                  textAnchor="middle"
                >
                  {item.period}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E65723' }]} />
          <Text style={styles.legendText}>Cobre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FBBF24' }]} />
          <Text style={styles.legendText}>Manganês</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2C3E',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#6BC24A',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#666',
  },
});