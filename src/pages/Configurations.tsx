import type { ChangeEvent, ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Character } from '../obrd/types'
import type { ImportCharacterResult } from '../hooks/useCharacterStorage'
import type { PlayerRole } from '../hooks/useObrPlayerRole'

type LanguageCode = 'en' | 'pt-BR' | 'es'

type LanguageOption = {
  code: LanguageCode
  label: string
}

type ConfigurationsProps = {
  onClearCharacter: () => void
  onImportCharacter: (raw: string) => Promise<ImportCharacterResult>
  character: Character
  role: PlayerRole
}

type StatusTone = 'success' | 'error' | 'info'

type StatusMessage = {
  tone: StatusTone
  text: string
}

/**
 * Configurations page with settings for language selection and import/export tools.
 */
const Configurations = ({ onClearCharacter, onImportCharacter, character, role }: ConfigurationsProps): ReactElement => {
  const { t, i18n } = useTranslation()
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [isImporting, setIsImporting] = useState<boolean>(false)
  const [statusVisible, setStatusVisible] = useState<boolean>(false)

  const showStatus = (next: StatusMessage): void => {
    setStatus(next)
    setStatusVisible(true)
  }

  const languages: LanguageOption[] = [
    { code: 'en', label: t('config.english') },
    { code: 'pt-BR', label: t('config.portuguese') },
    { code: 'es', label: t('config.spanish') },
  ]

  useEffect(() => {
    if (!status || status.tone !== 'success') {
      return
    }

    const fadeTimeoutId: number = window.setTimeout(() => {
      setStatusVisible(false)
    }, 2500)
    const clearTimeoutId: number = window.setTimeout(() => {
      setStatus(null)
    }, 3000)

    return () => {
      window.clearTimeout(fadeTimeoutId)
      window.clearTimeout(clearTimeoutId)
    }
  }, [status])

  const handleLanguageChange = (languageCode: LanguageCode): void => {
    i18n.changeLanguage(languageCode)
  }

  const handleClearCharacterData = (): void => {
    const shouldClear: boolean = window.confirm(t('config.clearCharacterConfirm'))
    if (!shouldClear) {
      return
    }
    onClearCharacter()
  }

  const handleReportIssues = (): void => {
    window.open('https://github.com/gcacoutinho/litm-obr/issues/new', '_blank')
  }

  const sanitizeFileName = (value: string): string => {
    const trimmed: string = value.trim()
    const safe: string = trimmed.replace(/[^a-z0-9-_]+/gi, '_').replace(/^_+|_+$/g, '')
    return safe || 'character'
  }

  const buildExportFileName = (): string => {
    const baseName: string = sanitizeFileName(character.characterName)
    return `${baseName}_${Date.now()}.json`
  }

  const handleExportDownload = (): void => {
    const payload: string = JSON.stringify(character)
    const blob: Blob = new Blob([payload], { type: 'application/json' })
    const url: string = window.URL.createObjectURL(blob)
    const anchor: HTMLAnchorElement = document.createElement('a')
    anchor.href = url
    anchor.download = buildExportFileName()
    anchor.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File | undefined = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text: string = await file.text()
      if (!text.trim()) {
        showStatus({ tone: 'error', text: t('config.importEmpty') })
        return
      }

      const shouldImport: boolean = window.confirm(t('config.importConfirm'))
      if (!shouldImport) {
        return
      }

      setIsImporting(true)
      const result: ImportCharacterResult = await onImportCharacter(text)
      setIsImporting(false)

      switch (result.status) {
        case 'success':
          showStatus({ tone: 'success', text: t('config.importSuccess') })
          break
        case 'invalid_json':
          showStatus({ tone: 'error', text: t('config.importInvalidJson') })
          break
        case 'invalid_data':
          showStatus({ tone: 'error', text: t('config.importInvalidData') })
          break
        case 'save_failed':
          showStatus({ tone: 'error', text: t('config.importSaveError') })
          break
        default:
          break
      }
    } catch (error: unknown) {
      console.warn('[litm-obr] Failed to read import file.', error)
      showStatus({ tone: 'error', text: t('config.importFileError') })
    }

    event.target.value = ''
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <label className="label-style">{t('config.selectLanguage')}</label>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 1rem 0 1rem' }}>
          {languages.map((lang: LanguageOption) => (
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
      {role === 'PLAYER' ? (
        <div style={{ marginBottom: '2rem' }}>
          <div>
            <span className="label-style">{t('config.manageCharacter')}</span>
          </div>
          <div style={{ margin: '1rem 1rem 0 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                onClick={handleExportDownload}
                className="might-option"
                style={{
                  padding: '0.6em 1.2em',
                  borderRadius: '8px',
                  border: '1px solid #e4d2c1',
                  backgroundColor: '#f4e5d2',
                  color: '#52281a',
                  fontWeight: 'normal',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {t('config.exportDownload')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.5rem' }}>
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <label
                className="might-option"
                style={{
                  padding: '0.6em 1.2em',
                  borderRadius: '8px',
                  border: '1px solid #e4d2c1',
                  backgroundColor: '#f4e5d2',
                  color: '#52281a',
                  fontWeight: 'normal',
                  cursor: isImporting ? 'not-allowed' : 'pointer',
                  opacity: isImporting ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {t('config.importLabel')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '0.5rem' }}>
                  <path d="M12 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="7,14 12,9 17,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 3h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportFile}
                  style={{ display: 'none' }}
                  disabled={isImporting}
                />
              </label>
            </div>
            {status ? (
              <div
                role="status"
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border:
                    status.tone === 'error'
                      ? '1px solid #b0482c'
                      : status.tone === 'success'
                        ? '1px solid #c29a2b'
                        : '1px solid #e4d2c1',
                  backgroundColor:
                    status.tone === 'error'
                      ? '#f9d6d0'
                      : status.tone === 'success'
                        ? '#fff4c2'
                        : '#f4e5d2',
                  color: '#52281a',
                  opacity: statusVisible ? 1 : 0,
                  transform: statusVisible ? 'translateY(0)' : 'translateY(-6px)',
                  transition: 'opacity 200ms ease, transform 200ms ease',
                  pointerEvents: statusVisible ? 'auto' : 'none',
                }}
              >
                {status.text}
              </div>
            ) : null}
            <button
              onClick={handleClearCharacterData}
              className="might-option"
              style={{
                padding: '0.6em 1.2em',
                borderRadius: '8px',
                border: '1px solid #b0482c',
                backgroundColor: '#f9d6d0',
                color: '#52281a',
                fontWeight: 'normal',
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              {t('config.clearCharacterData')}
            </button>
          </div>
        </div>
      ) : null}
      <div style={{ marginBottom: '2rem' }}>
        <div>
          <span className="label-style">{t('config.support')}</span>
        </div>
        <button
          onClick={handleReportIssues}
          className="might-option"
          style={{
            marginLeft: '1rem',
            marginTop: '1rem',
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
