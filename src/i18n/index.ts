import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'
import es from '../locales/es.json'

/**
 * i18next configuration for LITM-OBR application
 * Supports English, Brazilian Portuguese, and Spanish
 * Auto-detects browser language and persists user selection to localStorage
 * Uses static resource loading (translations bundled at build time)
 */

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Supported languages
    supportedLngs: ['en', 'pt-BR', 'es'],

    // Static resources loaded at build time
    resources: {
      en: {
        translation: en,
      },
      'pt-BR': {
        translation: ptBR,
      },
      es: {
        translation: es,
      },
    },

    // Language detector options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    // Disable keySeparator for flat JSON structure
    keySeparator: false,

    // Other options
    interpolation: {
      escapeValue: false, // React escapes by default
    },

    // Debug mode (set to true during development if needed)
    debug: false,
  })

export default i18n
