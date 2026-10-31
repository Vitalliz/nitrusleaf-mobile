import { Platform } from 'react-native';

export const Palette = {
  primary: '#58B741',
  primaryPressed: '#8AC86E',
  orangePrimary: '#FF9E00',
  primaryDark: '#2E6936',
  secondary: '#5C381E',
  gradientStart: '#E88239',
  gradientEnd: '#FFB534',
  deficiencyManganese: '#E9BB00',
  deficiencyCopper: '#F87B47',
  info: '#3498DB',
  success: '#2ECC71',
  error: '#E74C3C',
  bgLight: '#FEF7EE',
  bgLightAlt: '#FFE6C5',
  white: '#FFFFFF',
  surfaceGray: '#F5F5F5',
  textPrimary: '#2A2A2A',
  textSecondary: '#7F8C8D',
  borderDisabled: '#DADADA',
  black: '#000000',
} as const;

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const FontSizes = {
  xs: 13,
  sm: 13,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 28,
  '4xl': 34,
} as const;

export const FontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;
