// components/cards/card.tsx
import { Colors } from '@/constants/theme';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

type CardVariant = 'yellow' | 'gray' | 'white' | 'red' | 'red-large' | 'yellow-large' | 'white-large-analysis' | 'white-large-feet' | 'white-large';

interface CustomCardProps {
  variant: CardVariant;
  children?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onPress?: () => void;
}

const variantConfig = {
  yellow: { color: '#FFD700', textColor: '#000000' },
  gray: { color: '#9CA3AF', textColor: '#FFFFFF' },
  white: { color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
  red: { color: '#EF4444', textColor: '#FFFFFF' },
  'red-large': { color: '#EF4444', textColor: '#FFFFFF' },
  'yellow-large': { color: '#FFD700', textColor: '#000000' },
  'white-large-analysis': { color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
  'white-large-feet': { color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
  'white-large': { color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
};

export const CustomCard = ({ variant, children, bottomContent, onPress }: CustomCardProps) => {
  const { color: backgroundColor } = variantConfig[variant];

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.topSection, { backgroundColor }]}>
        <View style={styles.inner}>
          {children}
        </View>
      </View>

      {bottomContent && (
        <View style={styles.bottomSection}>
          {bottomContent}
        </View>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    // Sem width fixo — respeita o pai (paddingHorizontal do ScrollView)
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  bottomSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});