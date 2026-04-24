// components/charts/GroupedColumnChart.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Rect,
  Line,
  Text as SvgText,
  G,
} from 'react-native-svg';

export interface GroupedColumnData {
  talhao: string;
  cobre: number;
  manganes: number;
}

interface GroupedColumnChartProps {
  data: GroupedColumnData[];
  onDetailPress?: () => void;
  height?: number;
  showDownloadButton?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const CHART_PADDING = 40;
const BAR_WIDTH = 24;
const BAR_GAP = 8;

export const GroupedColumnChart: React.FC<GroupedColumnChartProps> = ({
  data,
  onDetailPress,
  height = 280,
  showDownloadButton = true,
}) => {
  const maxValue = Math.max(
    ...data.flatMap(item => [item.cobre, item.manganes]),
    10
  );
  
  const yAxisMax = Math.ceil(maxValue / 5) * 5;
  const yAxisSteps = [0, 5, 10, 15, 20].filter(step => step <= yAxisMax);
  
  const chartWidth = screenWidth - 64; // 16px padding on each side * 2
  const groupWidth = BAR_WIDTH * 2 + BAR_GAP;
  const totalGroupsWidth = groupWidth * data.length;
  const startX = (chartWidth - totalGroupsWidth) / 2 + CHART_PADDING;

  const getBarHeight = (value: number) => {
    return (value / yAxisMax) * (height - 60);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deficiência por talhão</Text>
        {showDownloadButton && (
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.chartContainer, { height }]}>
        <Svg width={chartWidth} height={height}>
          {/* Y-axis grid lines */}
          {yAxisSteps.map((step) => {
            const y = height - 40 - (step / yAxisMax) * (height - 60);
            return (
              <G key={step}>
                <Line
                  x1={CHART_PADDING}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#E5E5E5"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                />
                <SvgText
                  x={CHART_PADDING - 8}
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
                {/* Cobre Bar */}
                <Rect
                  x={groupX}
                  y={baseY - cobreHeight}
                  width={BAR_WIDTH}
                  height={cobreHeight}
                  fill="#E65723"
                  rx={4}
                />
                {/* Manganês Bar */}
                <Rect
                  x={groupX + BAR_WIDTH + BAR_GAP}
                  y={baseY - manganesHeight}
                  width={BAR_WIDTH}
                  height={manganesHeight}
                  fill="#FBBF24"
                  rx={4}
                />
                {/* X-axis label */}
                <SvgText
                  x={groupX + BAR_WIDTH + 4}
                  y={baseY + 16}
                  fontSize={12}
                  fill="#666"
                  textAnchor="middle"
                >
                  {item.talhao}
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

      {/* Detail Button */}
      {onDetailPress && (
        <TouchableOpacity style={styles.detailButton} onPress={onDetailPress}>
          <Text style={styles.detailButtonText}>Detalhar</Text>
          <Ionicons name="arrow-forward" size={16} color="#6BC24A" />
        </TouchableOpacity>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2C3E',
  },
  downloadButton: {
    padding: 4,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    marginBottom: 12,
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
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6BC24A',
  },
});