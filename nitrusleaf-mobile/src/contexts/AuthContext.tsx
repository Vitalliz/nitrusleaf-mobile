import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { AuthContextType, User, RegisterRequest } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserByIdLocal, loginLocal, registerLocal } from "@/repositories/authRepository";

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
      const savedUserId = await AsyncStorage.getItem("auth_user_id");
      if (savedUserId) {
        const savedUser = await getUserByIdLocal(savedUserId);
        if (savedUser) {
          setUser(savedUser);
          setToken(`local-${savedUser.id}`);
        } else {
          await AsyncStorage.removeItem("auth_user_id");
        }
      }
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
        const loggedUser = await loginLocal(email, password);
        setUser(loggedUser);
        setToken(`local-${loggedUser.id}-${Date.now()}`);
        await AsyncStorage.setItem("auth_user_id", loggedUser.id);
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
        if (data.password !== data.passwordConfirmation) {
          throw new Error("As senhas não conferem.");
        }

        const createdUser = await registerLocal({
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          password: data.password,
        });

        setUser(createdUser);
        setToken(`local-${createdUser.id}-${Date.now()}`);
        await AsyncStorage.setItem("auth_user_id", createdUser.id);
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
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("auth_user_id");
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      // Sessão local: nada para renovar
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