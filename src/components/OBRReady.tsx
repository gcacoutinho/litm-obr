import { useState, useEffect, ReactNode } from 'react'
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
export function OBRReady({ children }: OBRReadyProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    OBR.onReady(() => {
      setIsReady(true)
    })
  }, [])

  if (!isReady) {
    return (
      <div className="obr-loading-container">
        <div className="spinner"></div>
        <p className="obr-loading-text">Initializing Misty Rodeo</p>
      </div>
    )
  }

  return <>{children}</>
}
