import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra as
  | { supabaseUrl?: string; supabaseAnonKey?: string }
  | undefined;

const supabaseUrl =
  extra?.supabaseUrl?.trim() ||
  process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
  "";

const supabaseAnonKey =
  extra?.supabaseAnonKey?.trim() ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  "";

let _client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase não configurado: defina SUPABASE_URL e SUPABASE_ANON_KEY no .env e reinicie o Expo."
    );
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return _client;
}

export async function getAuthSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = getSupabase();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.warn("[Supabase] getSession:", error.message);
      return null;
    }
    return session;
  } catch (err) {
    console.warn("[Supabase] getAuthSession falhou:", err);
    return null;
  }
}

export async function waitForAuthSession(
  maxWaitMs = 5000,
  intervalMs = 150
): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const s = await getAuthSession();
    if (s?.access_token) return s;
    await new Promise<void>((r) => setTimeout(r, intervalMs));
  }
  return null;
}
