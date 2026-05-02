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

      <View style={styles.mainRow}>
        <View style={styles.leftContent}>
          <View style={styles.countRow}>
            <Text style={styles.analyzedNumber}>{analyzed}</Text>
            <Text style={styles.totalText}>/{total} árvores analisadas</Text>
          </View>

          <View style={styles.warningRow}>
            <Ionicons name="warning" size={16} color="#F5A623" />
            <Text style={styles.warningText}>
              {notAnalyzed} árvores não analisadas
            </Text>
          </View>
        </View>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${coveragePercentage}%` }]} />
      </View>

      {/* Summary original mantido */}
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 4,
    borderTopColor: '#98979F',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2C3E',
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leftContent: {
    flex: 1,
    gap: 10,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  analyzedNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A2C3E',
  },
  totalText: {
    fontSize: 18,
    color: '#1A2C3E',
    fontWeight: '500',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningText: {
    fontSize: 13,
    color: '#888',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16, 
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#F5A623',
    borderRadius: 5,
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