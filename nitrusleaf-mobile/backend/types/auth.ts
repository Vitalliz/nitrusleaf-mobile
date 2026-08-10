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
  isInitializing: boolean;
  isAuthPending: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export type AuthContextValue = AuthContextType;
