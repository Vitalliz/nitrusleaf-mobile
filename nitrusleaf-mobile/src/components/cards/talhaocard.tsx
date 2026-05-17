// components/TalhaoCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TalhaoData {
  id: string;
  name: string;
  analyzed: number;
  total: number;
  date: string;
  deficientTrees: number;
}

interface TalhaoCardProps {
  talhao: TalhaoData;
  onPress: () => void;
}

const TalhaoCard: React.FC<TalhaoCardProps> = React.memo(({ talhao, onPress }) => {
  const progress = Math.round((talhao.analyzed / talhao.total) * 100);
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Selecionar ${talhao.name}`}
      accessibilityHint={`${talhao.analyzed} de ${talhao.total} árvores analisadas`}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{talhao.name}</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>
        
        <Text style={styles.stats}>
          {talhao.analyzed}/{talhao.total} árvores analisadas
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={12} color="#888" />
            <Text style={styles.date}>Criado em: {talhao.date}</Text>
          </View>
          {talhao.deficientTrees > 0 && (
            <View style={styles.deficientBadge}>
              <Text style={styles.deficientText}>
                ⚠️ {talhao.deficientTrees} com deficiência
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={24} color="#CCC" />
    </TouchableOpacity>
  );
});

TalhaoCard.displayName = 'TalhaoCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2C3E',
  },
  progressBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  stats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  deficientBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deficientText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FF9800',
  },
});

export default TalhaoCard;