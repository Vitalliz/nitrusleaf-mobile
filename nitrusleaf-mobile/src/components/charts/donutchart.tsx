// components/charts/donutchart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Button } from '@/components/ui/button';

export interface DonutData {
  name: string;
  percentage: number;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  size?: number;
  innerRadius?: number;
  centerText?: string;
  showLabels?: boolean;
  onDetailPress?: () => void;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 110,
  innerRadius = 48,
  centerText,
  showLabels = true,
  onDetailPress,
}) => {
  const radius = size / 2;
  const strokeWidth = radius - innerRadius;
  const centerRadius = radius - strokeWidth / 2;

  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);

  const polarToCartesian = (angle: number) => {
    const angleInRad = (angle * Math.PI) / 180;
    return {
      x: radius + centerRadius * Math.cos(angleInRad),
      y: radius + centerRadius * Math.sin(angleInRad),
    };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    // Prevent full-circle path degeneration
    const safeEnd = endAngle - startAngle >= 360 ? endAngle - 0.01 : endAngle;
    const safeEndPoint = polarToCartesian(safeEnd);
    const largeArcFlag = safeEnd - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${centerRadius} ${centerRadius} 0 ${largeArcFlag} 1 ${safeEndPoint.x} ${safeEndPoint.y}`;
  };

  let currentAngle = -90;
  const slices = data.map((item) => {
    const angle = (item.percentage / totalPercentage) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    return { ...item, startAngle, endAngle };
  });

  return (
    <View style={styles.wrapper}>
      {/* Row: chart + legend */}
      <View style={styles.row}>
        {/* Donut */}
        <View style={[styles.chartWrapper, { width: size, height: size }]}>
          <Svg width={size} height={size}>
            {/* Background track */}
            <Circle
              cx={radius}
              cy={radius}
              r={centerRadius}
              stroke="#F0F0F0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Slices */}
            {slices.map((slice, index) => (
              <Path
                key={index}
                d={describeArc(slice.startAngle, slice.endAngle)}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="butt"
              />
            ))}
            {/* Inner white circle */}
            <Circle cx={radius} cy={radius} r={innerRadius} fill="#FFFFFF" />
          </Svg>

          {/* Center text overlay */}
          <View style={styles.centerTextWrapper} pointerEvents="none">
            <Text style={styles.centerMain}>{centerText ?? `${Math.round(totalPercentage)}%`}</Text>
          </View>
        </View>

        {/* Legend */}
        {showLabels && (
          <View style={styles.legend}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendRow}>
                {/* Colored badge with percentage */}
                <View style={[styles.badge, { backgroundColor: item.color }]}>
                  <Text style={styles.badgeText}>{item.percentage}%</Text>
                </View>
                {/* Name */}
                <Text style={styles.legendName}>{item.name}</Text>
                {/* Value */}
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Button */}
      <View style={styles.buttonWrapper}>
        <Button
          title="Ver detalhes"
          variant="primary"
          size="full"
          onPress={onDetailPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 12,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
    textAlign: 'center',
  },
  legend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    minWidth: 44,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  legendName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#1A2C3E',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A2C3E',
    minWidth: 20,
    textAlign: 'right',
  },
  buttonWrapper: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
});