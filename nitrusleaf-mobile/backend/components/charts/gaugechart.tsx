import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface GaugeChartProps {
  percentage: number;
  deficiencyType?: "Cobre" | "Manganês" | "Saudável";
  label?: string;
  sublabel?: string;
  size?: number;
  backgroundColor?: string;
  showPercentage?: boolean;
  onTechnicalPress?: () => void;
  onInfoPress?: () => void;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  percentage,
  deficiencyType = "Saudável",
  label,
  sublabel,
  size = 280,
  onTechnicalPress,
  onInfoPress,
}) => {
  const center = size / 2;
  const radius = size * 0.38;
  const strokeWidth = 20;
  const centerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * centerRadius;
  const safePct = Math.min(100, Math.max(0, Number(percentage) || 0));
  const strokeDashoffset = circumference - (safePct / 100) * circumference;
  const displayPct = Number.isInteger(safePct) ? safePct : Math.round(safePct * 10) / 10;
  const getGaugeColor = () => {
    if (deficiencyType === 'Saudável') {
      return '#6BC24A'; // Verde
    }
    if (deficiencyType === 'Manganês') {
      return '#FBBF24'; // Amarelo/Laranja
    }
    if (deficiencyType === 'Cobre') {
      return '#E65723'; // Laranja escuro
    }
    return '#6BC24A';
  };

  const gaugeColor = getGaugeColor();

  return (
    <View style={styles.container}>
      <View style={[styles.gaugeWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={centerRadius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <Circle
            cx={center}
            cy={center}
            r={centerRadius}
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${center}, ${center})`}
          />

          <SvgText
            x={center}
            y={center + 6}
            fontSize={36}
            fontWeight="bold"
            fill="#1A2C3E"
            textAnchor="middle"
          >
            {`${displayPct}%`}
          </SvgText>
        </Svg>
      </View>

      <Text style={styles.label}>{label}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
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
  gaugeWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2C3E',
    textAlign: 'center',
  },
  sublabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
});
