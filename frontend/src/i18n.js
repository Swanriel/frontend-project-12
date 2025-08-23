import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRu from './locales/ru/translation.json';

const resources = {
  ru: {
    translation: translationRu
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    debug: false,

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;