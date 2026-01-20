import type { ReactElement } from 'react'
import { useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import OBR from '@owlbear-rodeo/sdk'

interface OBRReadyProps {
  children: ReactNode
}

/**
 * Wrapper component that waits for the Owlbear Rodeo SDK to initialize.
 * Shows a loading spinner until OBR.onReady callback fires.
 *
 * @param children - Content to render once OBR is ready
 *
 * @example
 * <OBRReady>
 *   <App />
 * </OBRReady>
 */
export function OBRReady({ children }: OBRReadyProps): ReactElement {
  const { t } = useTranslation()
  const isAvailable: boolean = OBR.isAvailable
  const [isReady, setIsReady] = useState<boolean>(false)
  const [showBypassModal, setShowBypassModal] = useState<boolean>(false)
  const [isBypassing, setIsBypassing] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)

  useEffect(() => {
    const timeoutId: number = window.setTimeout(() => {
      setShowBypassModal(true)
    }, 5000)

    if (isAvailable) {
      OBR.onReady(() => {
        window.clearTimeout(timeoutId)
        setIsReady(true)
        setShowBypassModal(false)
      })
    }

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isAvailable, retryCount])

  if (isBypassing || isReady) {
    return <>{children}</>
  }
  const handleContinueWithoutObr = (): void => {
    setIsBypassing(true)
  }

  const handleRetry = (): void => {
    setShowBypassModal(false)
    setIsReady(false)
    setRetryCount((prev) => prev + 1)
  }

  return (
    <div className="obr-loading-container">
      <div className="spinner"></div>
      <p className="obr-loading-text">{t('obr.loading')}</p>
      {showBypassModal ? (
        <div className="obr-modal-backdrop" role="dialog" aria-modal="true">
          <div className="obr-modal">
            <h2>{t('obr.modalTitle')}</h2>
            <p>{t('obr.modalBody')}</p>
            <div className="obr-modal-actions">
              <button type="button" onClick={handleContinueWithoutObr}>
                {t('obr.modalContinue')}
              </button>
              <button type="button" onClick={handleRetry}>
                {t('obr.modalRetry')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
