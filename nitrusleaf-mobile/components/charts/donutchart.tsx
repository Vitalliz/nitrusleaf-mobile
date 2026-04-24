// components/charts/DonutChartAlternative.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

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
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  innerRadius = 60,
  centerText,
  showLabels = true,
}) => {
  const radius = size / 2;
  const outerRadius = radius;
  const strokeWidth = outerRadius - innerRadius;
  const centerRadius = outerRadius - strokeWidth / 2;

  let currentAngle = -90; // Começa do topo (12 horas)
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
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${start.x} ${start.y} A ${centerRadius} ${centerRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const slices = data.map((item) => {
    const angle = (item.percentage / totalPercentage) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    return {
      ...item,
      startAngle,
      endAngle,
      angle,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={radius}
            cy={radius}
            r={centerRadius}
            stroke="#F0F0F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Slices */}
          {slices.map((slice, index) => {
            const path = describeArc(slice.startAngle, slice.endAngle);
            return (
              <Path
                key={index}
                d={path}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="butt"
              />
            );
          })}
          
          {/* Center white circle */}
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="#FFFFFF"
          />
          
          {/* Center text */}
          <SvgText
            x={radius}
            y={radius - 8}
            fontSize={24}
            fontWeight="bold"
            fill="#1A2C3E"
            textAnchor="middle"
          >
            {centerText || `${Math.round(totalPercentage)}%`}
          </SvgText>
          <SvgText
            x={radius}
            y={radius + 12}
            fontSize={11}
            fill="#888"
            textAnchor="middle"
          >
            Total
          </SvgText>
        </Svg>
      </View>

      {/* Legend */}
      {showLabels && (
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendName}>
                  {item.name} ({item.percentage}%)
                </Text>
                <Text style={styles.legendValue}>{item.value} árvores</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  legendContainer: {
    width: '100%',
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A2C3E',
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 12,
    color: '#888',
  },
});