// Tipos de autenticação e usuário
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  company?: string;
  experience?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Dados da primeira propriedade coletados no fluxo de cadastro (etapas 2–3). */
export type RegisterPropertyPayload = {
  name: string;
  cep: string;
  city: string;
  street: string;
  number: number;
  neighborhood: string;
};

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  passwordConfirmation: string;
  /** Se preenchido, cria a propriedade no Supabase logo após o perfil. */
  property?: RegisterPropertyPayload;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  /** Restauração da sessão ao abrir o app (não use para desabilitar botões). */
  isInitializing: boolean;
  /** Login, cadastro ou logout em andamento — use para `disabled` em botões. */
  isAuthPending: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export type AuthContextValue = AuthContextType;