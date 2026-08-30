import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, isValidLanguageCode, getLanguageByCode } from '../config/languages';

const STORAGE_KEY = 'clausewise_language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [languageCode, setLanguageCode] = useState(() => {
    // Restore persisted preference from localStorage, validate it, fall back to default
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored && isValidLanguageCode(stored) ? stored : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  // Keep the document <html> dir attribute in sync
  useEffect(() => {
    const lang = getLanguageByCode(languageCode);
    document.documentElement.lang = languageCode;
    document.documentElement.dir = lang?.direction || 'ltr';
  }, [languageCode]);

  const changeLanguage = useCallback((code) => {
    if (!isValidLanguageCode(code)) {
      console.warn(`[LanguageContext] Attempted to set unsupported language: "${code}". Ignoring.`);
      return;
    }
    setLanguageCode(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // localStorage might be blocked (private browsing) — fail silently
    }
  }, []);

  const currentLanguage = getLanguageByCode(languageCode);

  return (
    <LanguageContext.Provider
      value={{
        languageCode,           // e.g. "hi"
        currentLanguage,        // full language object { code, name, nativeName, direction }
        changeLanguage,         // (code: string) => void
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
