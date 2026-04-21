import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { AuthContextType, RegisterRequest, User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserByIdLocal, loginLocal, registerLocal } from "@/repositories/authRepository";
import { createProperty } from "@/repositories/propertyRepository";
import { getAuthSession, getSupabase } from "@/services/supabase";
import { withTimeout } from "@/utils/withTimeout";
import { isAuthProfileWriteInProgress } from "@/utils/authFlowLock";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_ID_KEY = "auth_user_id";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthPending, setIsAuthPending] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem(AUTH_USER_ID_KEY);
        return;
      }
      if (session?.access_token && session.user?.id) {
        if (isAuthProfileWriteInProgress()) {
          return;
        }
        try {
          const profile = await withTimeout(
            getUserByIdLocal(session.user.id),
            12_000,
            ""
          );
          if (profile) {
            setUser(profile);
            setToken(session.access_token);
            await AsyncStorage.setItem(AUTH_USER_ID_KEY, session.user.id);
          }
        } catch {
          /* timeout ou rede: não trava o app */
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const supabase = getSupabase();
      const session = await getAuthSession();

      if (session?.access_token && session.user?.id) {
        const profile = await getUserByIdLocal(session.user.id);
        if (profile) {
          setUser(profile);
          setToken(session.access_token);
          await AsyncStorage.setItem(AUTH_USER_ID_KEY, session.user.id);
          return;
        }
        await supabase.auth.signOut();
        await AsyncStorage.removeItem(AUTH_USER_ID_KEY);
        setUser(null);
        setToken(null);
        return;
      }

      await AsyncStorage.removeItem(AUTH_USER_ID_KEY);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsAuthPending(true);
      const loggedUser = await loginLocal(email, password);
      const session = await getAuthSession();

      if (!session?.access_token) {
        throw new Error("Sessão não disponível após login. Tente novamente.");
      }

      setUser(loggedUser);
      setToken(session.access_token);
      if (session.user?.id) {
        await AsyncStorage.setItem(AUTH_USER_ID_KEY, session.user.id);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsAuthPending(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    let createdUser: User | null = null;
    try {
      setIsAuthPending(true);
      if (data.password !== data.passwordConfirmation) {
        throw new Error("As senhas não conferem.");
      }

      const { user: u, session: signUpSession } = await registerLocal({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        password: data.password,
      });
      createdUser = u;

      const session =
        signUpSession?.access_token ? signUpSession : await getAuthSession();

      if (!session?.access_token) {
        setUser(null);
        setToken(null);
        throw new Error(
          "Sessão não disponível após o cadastro. Tente fazer login; se o projeto exige confirmação de e-mail, use o link enviado ao seu e-mail."
        );
      }

      setUser(createdUser);
      setToken(session.access_token);
      if (session.user?.id) {
        await AsyncStorage.setItem(AUTH_USER_ID_KEY, session.user.id);
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    } finally {
      // Importante: não aguardar `createProperty` aqui — se a requisição travar (RLS/rede), o loading nunca terminava.
      setIsAuthPending(false);
    }

    const p = data.property;
    if (createdUser && p?.name?.trim()) {
      try {
        await withTimeout(
          createProperty({
            userId: createdUser.id,
            name: p.name.trim(),
            cep: p.cep.replace(/\D/g, "") || p.cep.trim(),
            logradouro: p.street.trim(),
            numero: p.number,
            bairro: p.neighborhood.trim(),
            cidade: p.city.trim(),
          }),
          25_000,
          "Não foi possível salvar a propriedade a tempo. Você pode cadastrá-la depois no app."
        );
      } catch (propErr) {
        console.error("Cadastro: falha ao criar propriedade:", propErr);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsAuthPending(true);
      const supabase = getSupabase();
      await supabase.auth.signOut();
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(AUTH_USER_ID_KEY);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    } finally {
      setIsAuthPending(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session?.access_token) {
        setToken(data.session.access_token);
      }
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    isInitializing,
    isAuthPending,
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
