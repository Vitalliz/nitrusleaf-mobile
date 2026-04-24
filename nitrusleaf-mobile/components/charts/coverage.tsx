// components/cards/CoverageCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CoverageCardProps {
  analyzed: number;
  total: number;
  notAnalyzed: number;
}

export const CoverageCard: React.FC<CoverageCardProps> = ({
  analyzed,
  total,
  notAnalyzed,
}) => {
  const coveragePercentage = (analyzed / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cobertura das Análises</Text>
      
      <View style={styles.coverageValue}>
        <Text style={styles.coverageNumber}>
          {analyzed}/{total}
        </Text>
        <Text style={styles.coverageLabel}>árvores analisadas</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { width: `${coveragePercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(coveragePercentage)}% de cobertura
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#6BC24A' }]} />
          <Text style={styles.summaryLabel}>Analisadas</Text>
          <Text style={styles.summaryValue}>{analyzed}</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.summaryLabel}>Não analisadas</Text>
          <Text style={styles.summaryValue}>{notAnalyzed}</Text>
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
  coverageValue: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coverageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A2C3E',
    marginBottom: 4,
  },
  coverageLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#6BC24A',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2C3E',
  },
});