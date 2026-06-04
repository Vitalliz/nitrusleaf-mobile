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
          <Text style={styles.dateLabel}>Criado em:</Text>

          <Ionicons
            name="calendar-outline"
            size={14}
            color="#777"
          />

          <Text style={styles.date}>{talhao.date}</Text>
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
      
      <Ionicons name="chevron-forward" size={30} color="#757575" style={styles.chevron} />
    </TouchableOpacity>
  );
});

TalhaoCard.displayName = 'TalhaoCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom:12,
  },
  content: { flex: 1, minWidth: 0 },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 6,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    flexShrink: 1,
  },

  progressBadge: {
    backgroundColor: "#EAF8E5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },

  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6BC24A",
  },

  stats: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 10,
  },

  footer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, 
  },

  dateLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },

  date: { fontSize: 14, color: "#777", },

  deficientBadge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },

  deficientText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF9800",
    flexShrink: 1,
  },

  chevron: {
    marginLeft: 14,
  },
});
export default TalhaoCard;