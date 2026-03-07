// components/ui/label.tsx
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

type LabelSize = 13 | 14 | 15 | 16 | 20 | 24 | 32;
type LabelVariant = 'default' | 'bold' | 'semibold' | 'medium' | 'regular';
type LabelColor = 'primary' | 'secondary' | 'accent' | 'muted' | 'white';

interface LabelProps {
  text: string;
  size?: LabelSize;
  variant?: LabelVariant;
  color?: LabelColor;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Label = ({
  text,
  size = 16,
  variant = 'regular',
  color = 'primary',
  style,
  numberOfLines,
}: LabelProps) => {
  const textStyle = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    colorStyles[color],
    style,
  ];

  return (
    <Text style={textStyle} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
};

// Componentes específicos baseados nas telas
export const WelcomeTitle = ({ text }: { text: string }) => (
  <Label text={text} size={32} variant="bold" color="primary" />
);

export const ScreenTitle = ({ text }: { text: string }) => (
  <Label text={text} size={24} variant="bold" color="primary" />
);

export const SectionTitle = ({ text }: { text: string }) => (
  <Label text={text} size={20} variant="semibold" color="primary" />
);

export const Subtitle = ({ text }: { text: string }) => (
  <Label text={text} size={16} variant="medium" color="secondary" />
);

export const BodyText = ({ text }: { text: string }) => (
  <Label text={text} size={16} variant="regular" color="primary" />
);

export const SmallText = ({ text }: { text: string }) => (
  <Label text={text} size={14} variant="regular" color="secondary" />
);

export const Caption = ({ text }: { text: string }) => (
  <Label text={text} size={13} variant="regular" color="muted" />
);

export const ButtonText = ({ text }: { text: string }) => (
  <Label text={text} size={15} variant="semibold" color="primary" />
);

export const ListItem = ({ text }: { text: string }) => (
  <Label text={text} size={16} variant="medium" color="primary" />
);

export const PercentageText = ({ text }: { text: string }) => (
  <Label text={text} size={24} variant="bold" color="accent" />
);

export const PropertyText = ({ text }: { text: string }) => (
  <Label text={text} size={20} variant="semibold" color="primary" />
);

export const AnalysisText = ({ text }: { text: string }) => (
  <Label text={text} size={16} variant="medium" color="secondary" />
);

export const DeficiencyText = ({ text }: { text: string }) => (
  <Label text={text} size={20} variant="bold" color="accent" />
);

export const MapTitle = ({ text }: { text: string }) => (
  <Label text={text} size={20} variant="bold" color="primary" />
);

export const TreeStatus = ({ text }: { text: string }) => (
  <Label text={text} size={14} variant="medium" color="secondary" />
);

export const AnalysisCount = ({ text }: { text: string }) => (
  <Label text={text} size={14} variant="regular" color="muted" />
);

const styles = StyleSheet.create({
  base: {
    textAlign: 'left',
  },
});

const sizeStyles = StyleSheet.create({
  13: {
    fontSize: 13,
    lineHeight: 16,
  },
  14: {
    fontSize: 14,
    lineHeight: 18,
  },
  15: {
    fontSize: 15,
    lineHeight: 20,
  },
  16: {
    fontSize: 16,
    lineHeight: 22,
  },
  20: {
    fontSize: 20,
    lineHeight: 24,
  },
  24: {
    fontSize: 24,
    lineHeight: 28,
  },
  32: {
    fontSize: 32,
    lineHeight: 36,
  },
});

const variantStyles = StyleSheet.create({
  default: {
    fontWeight: '400',
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});

const colorStyles = StyleSheet.create({
  primary: {
    color: '#2B2B2B',
  },
  secondary: {
    color: '#666666',
  },
  accent: {
    color: '#6BC24A',
  },
  muted: {
    color: '#888888',
  },
  white: {
    color: '#FFFFFF',
  },
});