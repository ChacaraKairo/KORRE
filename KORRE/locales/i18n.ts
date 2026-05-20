import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import pt from './pt.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

export const APP_LANGUAGE_STORAGE_KEY = 'app_language';

export const SUPPORTED_LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
] as const;

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[number]['code'];

const supportedLanguageCodes = SUPPORTED_LANGUAGES.map(
  (language) => language.code,
);

export const normalizeLanguage = (
  language?: string | null,
): SupportedLanguage => {
  const code = language?.split('-')[0] as
    | SupportedLanguage
    | undefined;

  return code && supportedLanguageCodes.includes(code)
    ? code
    : 'pt';
};

const deviceLanguage = normalizeLanguage(
  Localization.getLocales()[0]?.languageTag,
);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: deviceLanguage,
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export const loadSavedLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(
    APP_LANGUAGE_STORAGE_KEY,
  );

  if (savedLanguage) {
    await i18n.changeLanguage(
      normalizeLanguage(savedLanguage),
    );
  }
};

export const setAppLanguage = async (
  language: SupportedLanguage,
) => {
  const normalizedLanguage = normalizeLanguage(language);

  await AsyncStorage.setItem(
    APP_LANGUAGE_STORAGE_KEY,
    normalizedLanguage,
  );
  await i18n.changeLanguage(normalizedLanguage);
};

export const i18nReady = loadSavedLanguage().catch((error) => {
  if (__DEV__) {
    console.warn('[i18n] Falha ao carregar idioma salvo:', error);
  }
});

export default i18n;
