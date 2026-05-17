// components/charts/barchart.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { CustomCard } from '@/components/cards/card';
import { Button } from '@/components/ui/button';

export type TimePeriod = '6months' | '3months' | '1month';

export interface EvolutionData {
  period: string;
  cobre: number;
  manganes: number;
}

interface EvolutionBarChartProps {
  data: EvolutionData[];
  onPeriodChange?: (period: TimePeriod) => void;
  onDetailPress?: () => void;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const BAR_WIDTH = 12;
const BAR_GAP = 3;
const Y_AXIS_WIDTH = 32;
const TOP_PADDING = 20;

export const EvolutionBarChart: React.FC<EvolutionBarChartProps> = ({
  data,
  onPeriodChange,
  onDetailPress,
  height = 240,
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

  const chartWidth = screenWidth - 25 * 2 - 16 * 2; // page padding + card padding

  const maxValue = Math.max(...data.flatMap(d => [d.cobre, d.manganes]), 50);
  const yAxisMax = Math.ceil(maxValue / 10) * 10;
  const yAxisSteps = [0, 10, 20, 30, 40, 50].filter(s => s <= yAxisMax);

  const drawHeight = height - 32 - TOP_PADDING;
  const groupWidth = BAR_WIDTH * 2 + BAR_GAP + 10;
  const totalGroupsWidth = groupWidth * data.length;
  const availableWidth = chartWidth - Y_AXIS_WIDTH;
  const startX = Y_AXIS_WIDTH + (availableWidth - totalGroupsWidth) / 2;

  const getBarH = (value: number) => (value / yAxisMax) * drawHeight;
  const baseY = drawHeight + TOP_PADDING;

  return (
    <CustomCard variant="white-large">
      <View style={styles.cardContent}>
        {/* Title */}
        <Text style={styles.title}>Evolução das deficiências (%)</Text>

        {/* Period filters */}
        <View style={styles.filterRow}>
          {periods.map(p => (
            <TouchableOpacity
              key={p.value}
              style={[styles.filterBtn, selectedPeriod === p.value && styles.filterBtnActive]}
              onPress={() => handlePeriodPress(p.value)}
            >
              <Text style={[styles.filterText, selectedPeriod === p.value && styles.filterTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={{ height: height + 20 }}>
          <Svg width={chartWidth} height={height + 20}>
            {/* Grid lines + Y labels */}
            {yAxisSteps.map((step) => {
              const y = baseY - getBarH(step);
              return (
                <G key={step}>
                  <Line
                    x1={Y_AXIS_WIDTH}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#EBEBEB"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={Y_AXIS_WIDTH - 6}
                    y={y + 4}
                    fontSize={11}
                    fill="#AAA"
                    textAnchor="end"
                  >
                    {step}
                  </SvgText>
                </G>
              );
            })}

            {/* Bars + X labels */}
            {data.map((item, i) => {
              const gx = startX + i * groupWidth;
              const cobreH = getBarH(item.cobre);
              const manganesH = getBarH(item.manganes);

              return (
                <G key={i}>
                  {/* Cobre */}
                  <Rect
                    x={gx}
                    y={baseY - cobreH}
                    width={BAR_WIDTH}
                    height={cobreH}
                    fill="#E65723"
                    rx={4}
                  />
                  {/* Manganês */}
                  <Rect
                    x={gx + BAR_WIDTH + BAR_GAP}
                    y={baseY - manganesH}
                    width={BAR_WIDTH}
                    height={manganesH}
                    fill="#FBBF24"
                    rx={4}
                  />
                  {/* X label */}
                  <SvgText
                    x={gx + BAR_WIDTH + BAR_GAP / 2}
                    y={baseY + 16}
                    fontSize={11}
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
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E65723' }]} />
            <Text style={styles.legendText}>Cobre</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
            <Text style={styles.legendText}>Manganês</Text>
          </View>
        </View>

        {/* Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Detalhar"
            variant="primary"
            size="full"
            onPress={onDetailPress}
          />
        </View>
      </View>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2C3E',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1.5,
    borderColor: '#FBBF24',
  },
  filterText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#E65723',
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 28,
    height: 18,
    borderRadius: 14,
  },
  legendText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  buttonWrapper: {
    marginTop: 16,
  },
});