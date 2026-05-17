// components/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  label: string;
  variant?: 'orange' | 'yellow' | 'gray' | 'green';
  icon?: keyof typeof Ionicons.glyphMap;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'gray', 
  icon 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'orange':
        return { backgroundColor: '#FEF3F2', textColor: '#E65723' };
      case 'yellow':
        return { backgroundColor: '#FEFCE8', textColor: '#FBBF24' };
      case 'green':
        return { backgroundColor: '#F0FDF4', textColor: '#58B741' };
      default:
        return { backgroundColor: '#F3F4F6', textColor: '#6B7280' };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.badge, { backgroundColor: variantStyles.backgroundColor }]}>
      {icon && <Ionicons name={icon} size={14} color={variantStyles.textColor} style={styles.icon} />}
      <Text style={[styles.label, { color: variantStyles.textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});