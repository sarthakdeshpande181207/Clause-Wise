/**
 * Central language configuration for ClauseWise multilingual system.
 * To add a new language in the future, add ONE entry here.
 * Nothing else in the codebase needs to be changed at the config level.
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    direction: 'ltr',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    direction: 'ltr',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    direction: 'ltr',
  },
];

/** Default language code — English is always the fallback */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Returns the language object for a given code.
 * Falls back to English if the code is not found or invalid.
 */
export function getLanguageByCode(code) {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE)
  );
}

/**
 * Validates whether a given language code is supported.
 * Use this as a guard on any user-supplied language value.
 */
export function isValidLanguageCode(code) {
  return SUPPORTED_LANGUAGES.some((l) => l.code === code);
}
