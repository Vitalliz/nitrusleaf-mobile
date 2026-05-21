import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { AuthContextType, User, RegisterRequest } from "@/types/auth";
import { apiService } from "@/services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão ao iniciar (se houver token salvo)
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      // TODO: Carregar token do AsyncStorage
      // const savedToken = await AsyncStorage.getItem("authToken");
      // if (savedToken) {
      //   setToken(savedToken);
      //   await refreshToken();
      // }
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        // TODO: Fazer chamada real à API
        // const response = await apiService.post("/auth/login", { email, password });
        // setUser(response.user);
        // setToken(response.token);
        // await AsyncStorage.setItem("authToken", response.token);

        // MOCK - Remover em produção
        setUser({
          id: "1",
          name: email.split("@")[0],
          email,
          company: "Minha Empresa",
          experience: "5 anos",
        });
        setToken("mock-token-" + Date.now());
      } catch (error) {
        console.error("Erro no login:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setIsLoading(true);
        // TODO: Fazer chamada real à API
        // const response = await apiService.post("/auth/register", data);
        // setUser(response.user);
        // setToken(response.token);
        // await AsyncStorage.setItem("authToken", response.token);

        // MOCK - Remover em produção
        setUser({
          id: "1",
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: "Minha Empresa",
          experience: "Iniciante",
        });
        setToken("mock-token-" + Date.now());
      } catch (error) {
        console.error("Erro no registro:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO: Fazer chamada à API de logout
      // await apiService.post("/auth/logout");
      setUser(null);
      setToken(null);
      // await AsyncStorage.removeItem("authToken");
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      // TODO: Implementar refresh token real
      // const response = await apiService.post("/auth/refresh");
      // setToken(response.token);
      // await AsyncStorage.setItem("authToken", response.token);
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isSignedIn: !!user && !!token,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};