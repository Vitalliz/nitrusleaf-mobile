// components/cards/NutritionalStatusCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NutritionalStatusProps {
  manganesPercentage: number;
  cobrePercentage: number;
  onPress?: () => void;
}

export const NutritionalStatusCard: React.FC<NutritionalStatusProps> = ({
  manganesPercentage,
  cobrePercentage,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status Nutricional da Propriedade</Text>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{manganesPercentage}%</Text>
          <View style={[styles.badge, { backgroundColor: '#F5A623' }]}>
            <Text style={styles.badgeText}>Manganês</Text>
          </View>
        </View>

        {/* Divisória vertical */}
        <View style={styles.divider} />

        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{cobrePercentage}%</Text>
          <View style={[styles.badge, { backgroundColor: '#E65723' }]}>
            <Text style={styles.badgeText}>Cobre</Text>
          </View>
        </View>
      </View>

      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.footerText}>Ver detalhes nutricionais →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 20,
    marginBottom: 16,
    borderTopWidth: 4,
    borderTopColor: '#F5A623',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2C3E',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: 70,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#6BC24A',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});