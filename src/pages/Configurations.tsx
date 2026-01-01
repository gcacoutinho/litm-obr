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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <label className="label-style">{t('config.selectLanguage')}</label>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 1rem 0 1rem' }}>
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
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => window.open('https://github.com/gcacoutinho/litm-obr/issues/new', '_blank')}
          className="might-option"
          style={{
            marginLeft: '1rem',
            padding: '0.6em 1.2em',
            borderRadius: '8px',
            border: '1px solid #e4d2c1',
            backgroundColor: '#f4e5d2',
            color: '#52281a',
            fontWeight: 'normal',
            cursor: 'pointer',
          }}
        >
          {t('config.reportIssues')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.5rem' }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Configurations
