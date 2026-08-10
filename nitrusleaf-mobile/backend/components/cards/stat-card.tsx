import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({
  icon,
  iconColor,
  backgroundColor,
  label,
  value
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={34} color={iconColor} />
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
    minWidth: 0,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    justifyContent: "space-between",
    minHeight: 120,
  },

  headContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
    minWidth: 0,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    flex: 1,
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 14,
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginTop: 5,
  },
});

export default StatCard;
