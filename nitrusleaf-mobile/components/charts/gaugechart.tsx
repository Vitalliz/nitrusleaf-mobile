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
  const radius = size * 0.40;
  const strokeWidth = 20;
  const centerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * centerRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Cor baseada no tipo de deficiência
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
            cx={radius}
            cy={radius}
            r={centerRadius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          <Circle
            cx={radius}
            cy={radius}
            r={centerRadius}
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${radius}, ${radius})`}
          />

          <SvgText
            x={radius}
            y={radius - 4}
            fontSize={40}
            fontWeight="bold"
            fill="#1A2C3E"
            textAnchor="middle"
          >
            {`${Number(percentage).toFixed(2)}%`}
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