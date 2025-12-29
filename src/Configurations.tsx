import { useTranslation } from 'react-i18next'

/**
 * Configurations page with settings for language selection.
 */
const Configurations = () => {
  const { t, i18n } = useTranslation()

  const languages = [
    { code: 'en', label: t('config.english') },
    { code: 'pt-BR', label: t('config.portuguese') },
    { code: 'es', label: t('config.spanish') },
  ]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <label className="label-style">{t('config.selectLanguage')}</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`might-option ${i18n.language === lang.code ? 'active' : ''}`}
              style={{
                padding: '0.6em 1.2em',
                borderRadius: '8px',
                border: i18n.language === lang.code ? '2px solid #52281a' : '1px solid #e4d2c1',
                backgroundColor: i18n.language === lang.code ? '#e4d2c1' : '#f4e5d2',
                color: '#52281a',
                fontWeight: i18n.language === lang.code ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Configurations
