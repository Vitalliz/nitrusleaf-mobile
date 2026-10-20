import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Palette } from '@/constants/theme';

type CardVariant =
  | 'yellow'
  | 'gray'
  | 'white'
  | 'red'
  | 'red-large'
  | 'yellow-large'
  | 'white-large-analysis'
  | 'white-large-feet'
  | 'white-large';

interface CustomCardProps {
  variant: CardVariant;
  children?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onPress?: () => void;
}

const variantConfig: Record<CardVariant, { color: string }> = {
  yellow: { color: Palette.deficiencyManganese },
  gray: { color: Palette.textSecondary },
  white: { color: Palette.white },
  red: { color: Palette.error },
  'red-large': { color: Palette.error },
  'yellow-large': { color: Palette.deficiencyManganese },
  'white-large-analysis': { color: Palette.white },
  'white-large-feet': { color: Palette.white },
  'white-large': { color: Palette.white },
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
    width: '100%',
    backgroundColor: Palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    overflow: 'hidden',
    marginVertical: 6,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: Palette.white,
  },
});