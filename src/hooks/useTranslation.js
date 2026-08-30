import { useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Eagerly import all locale files. Vite handles this at build time —
// no dynamic network requests needed at runtime.
import en from '../locales/en/common.json';
import hi from '../locales/hi/common.json';
import mr from '../locales/mr/common.json';
import gu from '../locales/gu/common.json';
import kn from '../locales/kn/common.json';

const LOCALES = { en, hi, mr, gu, kn };

/**
 * useTranslation()
 *
 * Returns a `t(key)` function that looks up a string in the current
 * language's locale file. Falls back to the English value if the key
 * is missing in the selected locale (never returns undefined/null).
 *
 * Usage:
 *   const { t } = useTranslation();
 *   <h1>{t('chatbot_title')}</h1>
 */
export function useTranslation() {
  const { languageCode } = useLanguage();

  const t = useCallback(
    (key) => {
      const locale = LOCALES[languageCode] || LOCALES['en'];
      const fallback = LOCALES['en'];
      // Return from current locale, fall back to English, then key itself
      return locale[key] ?? fallback[key] ?? key;
    },
    [languageCode]
  );

  return { t, languageCode };
}
