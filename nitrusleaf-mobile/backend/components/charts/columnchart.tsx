import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { CustomCard } from '@/components/cards/card';

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
const BAR_WIDTH = 24;
const BAR_GAP = 8;
const Y_AXIS_WIDTH = 32;

export const GroupedColumnChart: React.FC<GroupedColumnChartProps> = ({
  data,
  onDetailPress,
  height = 220,
  showDownloadButton = true,
}) => {
  const chartWidth = screenWidth - 50 * 2; // 25 page padding * 2 + card internal padding

  const safeData = data.length > 0 ? data : [{ talhao: "-", cobre: 0, manganes: 0 }];
  const maxValue = Math.max(...safeData.flatMap((d) => [d.cobre, d.manganes]), 1);
  const yAxisMax = Math.max(5, Math.ceil(maxValue / 5) * 5);
  const yAxisSteps = [0, 5, 10, 15, 20].filter(s => s <= yAxisMax + 5);

  const TOP_PADDING = 16;  // espaço para o label "20" não ser cortado
  const drawHeight = height - 32 - TOP_PADDING; // leave room for x-axis labels + top
  const groupWidth = BAR_WIDTH * 2 + BAR_GAP + 16;
  const totalGroupsWidth = groupWidth * safeData.length;
  const availableWidth = chartWidth - Y_AXIS_WIDTH;
  const startX = Y_AXIS_WIDTH + Math.max(0, (availableWidth - totalGroupsWidth) / 2);

  const getBarH = (value: number) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return (n / yAxisMax) * drawHeight;
  };
  const baseY = drawHeight + TOP_PADDING;

  return (
    <CustomCard variant="white-large">
      <View style={styles.cardContent}><Text style={styles.title}>Deficiência por talhão</Text><View style={{ height: height + 20 }}>
          <Svg width={chartWidth} height={height + 20}>{yAxisSteps.map((step) => {
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
            })}{safeData.map((item, i) => {
              const gx = startX + i * groupWidth;
              const cobreH = getBarH(item.cobre);
              const manganesH = getBarH(item.manganes);

              return (
                <G key={i}><Rect
                    x={gx}
                    y={baseY - cobreH}
                    width={BAR_WIDTH}
                    height={cobreH}
                    fill="#E65723"
                    rx={4}
                  /><Rect
                    x={gx + BAR_WIDTH + BAR_GAP}
                    y={baseY - manganesH}
                    width={BAR_WIDTH}
                    height={manganesH}
                    fill="#FBBF24"
                    rx={4}
                  /><SvgText
                    x={gx + BAR_WIDTH + BAR_GAP / 2}
                    y={baseY + 16}
                    fontSize={11}
                    fill="#666"
                    textAnchor="middle"
                  >
                    {item.talhao}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View><View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E65723' }]} />
            <Text style={styles.legendText}>Cobre</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
            <Text style={styles.legendText}>Manganês</Text>
          </View>
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
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  legendText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  buttonWrapper: {
    marginTop: 12,
  },
});
