import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

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
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Selecionar ${talhao.name}`}
      accessibilityHint={`${talhao.analyzed} de ${talhao.total} árvores analisadas`}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{talhao.name}</Text>
        
        <Text style={styles.stats}>
          <Text style={styles.statsBold}>
            {talhao.analyzed}/{talhao.total}
          </Text>{" "}
          árvores analisadas
        </Text>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Criado em: </Text>
          <Ionicons name="calendar-outline" size={12} color={Palette.textSecondary} />
          <Text style={styles.date}> {talhao.date}</Text>
        </View>

        {talhao.deficientTrees > 0 && (
          <View style={styles.deficientBadge}>
            <Text style={styles.deficientText}>
              ⚠️ {talhao.deficientTrees} com deficiência
            </Text>
          </View>
        )}
      </View>
      
      <Ionicons
        name="chevron-forward"
        size={18}
        color={Palette.textPrimary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
});

TalhaoCard.displayName = 'TalhaoCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  stats: {
    fontSize: 13,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  statsBold: {
    fontWeight: FontWeights.bold,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  date: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: FontWeights.medium,
  },
  deficientBadge: {
    backgroundColor: `${Palette.orangePrimary}15`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  deficientText: {
    fontSize: FontSizes.xs - 1,
    fontWeight: FontWeights.semiBold,
    color: Palette.orangePrimary,
  },
  chevron: {
    marginLeft: 12,
  },
});

export default TalhaoCard;