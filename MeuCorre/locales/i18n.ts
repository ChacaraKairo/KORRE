import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from './pt.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'pt', // idioma padrão
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

export default i18n;
