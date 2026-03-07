// Configurações e constantes da aplicação

// API
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://api.seu-backend.com",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Auth
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: "nitrusleaf_auth_token",
  USER_STORAGE_KEY: "nitrusleaf_user",
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutos antes de expirar
};

// Validação
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
};

// Status de Plantation
export const PLANTATION_STATUS = {
  HEALTHY: "healthy",
  WARNING: "warning",
  ALERT: "alert",
} as const;

// Tipos de Atividades
export const ACTIVITY_TYPES = {
  WATERING: "watering",
  ALERT: "alert",
  INSPECTION: "inspection",
  MAINTENANCE: "maintenance",
  PHOTO: "photo",
  REPORT: "report",
} as const;

// Cores da app
export const COLORS = {
  PRIMARY: "#FFA62B",
  SECONDARY: "#6BC24A",
  DANGER: "#FF6B6B",
  WARNING: "#FFD93D",
  INFO: "#3B82F6",
  SUCCESS: "#6BC24A",
  ERROR: "#FF6B6B",
  DARK: "#2B2B2B",
  LIGHT: "#F5F5F5",
  BORDER: "#E5E5E5",
  PLACEHOLDER: "#999",
  MUTED: "#666",
} as const;

// Ícones de Atividades
export const ACTIVITY_ICONS = {
  watering: "water",
  alert: "alert-circle",
  inspection: "checkmark-circle",
  maintenance: "wrench",
  photo: "camera",
  report: "document",
} as const;

// Status Cores
export const STATUS_COLORS = {
  healthy: COLORS.SUCCESS,
  warning: COLORS.WARNING,
  alert: COLORS.DANGER,
} as const;

// Mensagens
export const MESSAGES = {
  LOADING: "Carregando...",
  ERROR: "Ocorreu um erro. Tente novamente.",
  SUCCESS: "Operação realizada com sucesso!",
  INVALID_EMAIL: "Email inválido",
  INVALID_PASSWORD: "Senha deve ter no mínimo 6 caracteres",
  INVALID_NAME: "Nome deve ter no mínimo 3 caracteres",
  PASSWORDS_DONT_MATCH: "As senhas não correspondem",
  REQUIRED_FIELD: "Este campo é obrigatório",
  LOGIN_ERROR: "Email ou senha inválidos",
  REGISTER_ERROR: "Erro ao registrar. Tente novamente.",
  LOGOUT_CONFIRM: "Tem certeza que deseja sair?",
  SESSION_EXPIRED: "Sua sessão expirou. Faça login novamente.",
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet.",
} as const;

// Delays e Animações
export const DELAYS = {
  SPLASH_SCREEN: 500,
  SHORT_ANIMATION: 300,
  NORMAL_ANIMATION: 500,
  LONG_ANIMATION: 800,
  TOAST_DURATION: 3000,
} as const;

// URLs (remover em produção, usar env vars)
export const URLS = {
  PRIVACY_POLICY: "https://seu-site.com/privacy",
  TERMS: "https://seu-site.com/terms",
  CONTACT: "https://seu-site.com/contact",
  DOCUMENTATION: "https://seu-site.com/docs",
} as const;