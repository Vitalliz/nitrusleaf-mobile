import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pt, type TranslationKeys } from "./locales/pt";
import { en } from "./locales/en";

export type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  t: (key: TranslationKeys, fallback?: string) => string;
  isEn: boolean;
}

const LANGUAGE_STORAGE_KEY = "@nitrusleaf_app_language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, Record<string, string>> = {
  pt,
  en,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("pt");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === "pt" || saved === "en") {
          setLanguageState(saved);
        }
      } catch (err) {
        console.warn("Error loading persisted language:", err);
      }
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (err) {
      console.warn("Error saving language:", err);
    }
  }, []);

  const toggleLanguage = useCallback(async () => {
    const nextLang: Language = language === "pt" ? "en" : "pt";
    await setLanguage(nextLang);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKeys, fallback?: string): string => {
      const dict = dictionaries[language];
      if (dict && dict[key] !== undefined) {
        return dict[key];
      }
      // fallback to pt dictionary
      if (dictionaries.pt && dictionaries.pt[key] !== undefined) {
        return dictionaries.pt[key];
      }
      return fallback || key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      isEn: language === "en",
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

