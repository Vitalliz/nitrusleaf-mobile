import { Platform } from 'react-native';

export const Palette = {
  // Ações e Identidade Visual
  primary: '#58B741',         // Verde Primário: Ações principais (Continuar, salvar, câmera)
  primaryPressed: '#8AC86E',  // Verde Pressed-Hover: Estado pressionado/foco de botões
  orangePrimary: '#FF9E00',   // Laranja Primário: Destaque de identidade visual
  primaryDark: '#2E6936',     // Verde escuro (detalhe da folha)
  secondary: '#5C381E',       // Marrom ("Leaf")

  // Gradiente Destaque (Elementos Gráficos / Ondas)
  gradientStart: '#E88239',   // Início do gradiente de destaque
  gradientEnd: '#FFB534',     // Fim do gradiente de destaque

  // Deficiências / Nutrientes da Plantação
  deficiencyManganese: '#E9BB00', // Deficiência de Manganês
  deficiencyCopper: '#F87B47',    // Deficiência de Cobre

  // Feedback e Status
  info: '#3498DB',            // Azul Informação: Tooltips, avisos neutros, links de ajuda
  success: '#2ECC71',         // Verde Sucesso: Feedback positivo, dados salvos, ícones de check
  error: '#E74C3C',           // Vermelho Erro: Alertas, validações inválidas, ações destrutivas

  // Planos de Fundo e Superfícies
  bgLight: '#FEF7EE',         // Bege-claro: Plano de fundo principal
  bgLightAlt: '#FFE6C5',      // Bege-claro-2: Plano de fundo secundário/variação
  white: '#FFFFFF',           // Branco Puro: Cards flutuantes e fundo de inputs
  surfaceGray: '#F5F5F5',     // Cinza Superfície: Linhas divisórias / bordas desativadas

  // Tipografia e Linhas Neutras
  textPrimary: '#2A2A2A',     // Cinza Escuro: Textos de leitura, títulos e parágrafos
  textSecondary: '#7F8C8D',   // Cinza Médio: Labels e placeholders
  borderDisabled: '#DADADA',  // Cinza Claro: Bordas de inputs desativados / divisores
  black: '#000000',           // Preto absoluto
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

// Escala de tamanhos de fonte padronizada
export const FontSizes = {
  xs: 12,    // Legendas mínimas, badges, tags pequenas
  sm: 13,    // Checkboxes, textos secundários ("Esqueci a senha", "ou")
  base: 14,  // Textos corridos, links de rodapé ("Fazer cadastro")
  md: 16,    // Labels de inputs, botões principais, subtítulos leves
  lg: 18,    // Títulos de cards ou seções menores
  xl: 20,    // Títulos médios
  '2xl': 22, // Subtítulos de destaque ("Entre na sua conta")
  '3xl': 28, // Títulos de telas principais ("Bem-vindo!")
  '4xl': 34, // Títulos grandes de impacto / splash
} as const;

// Pesos de fonte tipográficos
export const FontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;