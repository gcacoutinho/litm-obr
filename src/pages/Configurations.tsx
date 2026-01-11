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
      <div className="config-section">
        <label className="label-style">{t('config.selectLanguage')}</label>
        <div className="config-language-options">
          {languages.map((lang: LanguageOption) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`might-option config-button ${i18n.language === lang.code ? 'config-button--active' : ''}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
      {role === 'PLAYER' ? (
        <div className="config-section">
          <div>
            <span className="label-style">{t('config.manageCharacter')}</span>
          </div>
          <div className="config-actions">
            <div className="config-actions-row">
              <button
                onClick={handleExportDownload}
                className="might-option config-button"
              >
                {t('config.exportDownload')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="config-icon">
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <label
                className={`might-option config-button ${isImporting ? 'config-button--disabled' : ''}`}
              >
                {t('config.importLabel')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="config-icon">
                  <path d="M12 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="7,14 12,9 17,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 3h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportFile}
                  className="config-file-input"
                  disabled={isImporting}
                />
              </label>
            </div>
            {status ? (
              <div
                role="status"
                className={`config-status config-status--${status.tone} ${statusVisible ? 'config-status--visible' : ''}`}
              >
                {status.text}
              </div>
            ) : null}
            <button
              onClick={handleClearCharacterData}
              className="might-option config-button config-button--danger config-button--align-start"
            >
              {t('config.clearCharacterData')}
            </button>
          </div>
        </div>
      ) : null}
      <div className="config-section">
        <div>
          <span className="label-style">{t('config.support')}</span>
        </div>
        <button
          onClick={handleReportIssues}
          className="might-option config-button config-support-button"
        >
          {t('config.reportIssues')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="config-icon">
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
