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
          <Text style={styles.statusLabel}>Manganês</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{cobrePercentage}%</Text>
          <Text style={styles.statusLabel}>Cobre</Text>
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
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A2C3E',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  footerText: {
    fontSize: 13,
    color: '#6BC24A',
    fontWeight: '500',
    textAlign: 'center',
  },
});