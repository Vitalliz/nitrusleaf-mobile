// components/charts/GaugeChart.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Text as SvgText, Path } from 'react-native-svg';

interface GaugeChartProps {
  percentage: number;
  label: string;
  sublabel?: string;
  size?: number;
  onTechnicalPress?: () => void;
  onInfoPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const GaugeChart: React.FC<GaugeChartProps> = ({
  percentage,
  label,
  sublabel,
  size = 240,
  onTechnicalPress,
  onInfoPress,
}) => {
  const radius = size / 2;
  const strokeWidth = 24;
  const centerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * centerRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Calculate color based on percentage
  const getGaugeColor = () => {
    if (percentage < 30) return '#EF4444';
    if (percentage < 70) return '#FBBF24';
    return '#6BC24A';
  };

  const gaugeColor = getGaugeColor();

  return (
    <View style={styles.container}>
      <View style={[styles.gaugeWrapper, { width: size, height: size }]}>
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
          
          {/* Progress circle */}
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

          {/* Percentage text */}
          <SvgText
            x={radius}
            y={radius - 8}
            fontSize={42}
            fontWeight="bold"
            fill="#1A2C3E"
            textAnchor="middle"
          >
            {percentage}%
          </SvgText>
          <SvgText
            x={radius}
            y={radius + 16}
            fontSize={14}
            fill="#666"
            textAnchor="middle"
          >
            Probabilidade estimada
          </SvgText>
        </Svg>
      </View>

      <Text style={styles.label}>{label}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}

      {/* Technical Summary Button */}
      {onTechnicalPress && (
        <View style={styles.technicalContainer}>
          <Text style={styles.analysisId}>Análise #006</Text>
          <TouchableOpacity style={styles.technicalButton} onPress={onTechnicalPress}>
            <Text style={styles.technicalButtonText}>Ver resumo técnico</Text>
            <Ionicons name="document-text-outline" size={18} color="#6BC24A" />
          </TouchableOpacity>
        </View>
      )}

      {/* Info Box */}
      {onInfoPress && (
        <TouchableOpacity style={styles.infoBox} onPress={onInfoPress}>
          <Ionicons name="help-circle-outline" size={20} color="#6BC24A" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>O que significa?</Text>
            <Text style={styles.infoSubtitle}>Clique para saber mais</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  gaugeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A2C3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  technicalContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  analysisId: {
    fontSize: 14,
    color: '#888',
  },
  technicalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  technicalButtonText: {
    fontSize: 14,
    color: '#6BC24A',
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2C3E',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#888',
  },
});