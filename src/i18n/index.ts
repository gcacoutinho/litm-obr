import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

/**
 * i18next configuration for LITM-OBR application
 * Supports English, Brazilian Portuguese, and Spanish
 * Auto-detects browser language and persists user selection to localStorage
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
    
    // Load translations from public/locales/*.json
    backend: {
      loadPath: '/locales/{{lng}}.json',
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

    // Load translations synchronously from public folder
    resources: undefined, // Will be loaded from /public/locales/*.json
  })

export default i18n
