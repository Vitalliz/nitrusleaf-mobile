import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, FontWeights } from '@/constants/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor?: string;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({
  icon,
  iconColor,
  backgroundColor = Palette.surfaceGray,
  label,
  value,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>

        <Text style={styles.label}>
          {label}
        </Text>
      </View>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
});

StatCard.displayName = 'StatCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    justifyContent: "space-between",
    minHeight: 105,
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontSize: 11,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    lineHeight: 14,
  },
  value: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginTop: 8,
  },
});

export default StatCard;