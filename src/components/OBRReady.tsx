import { useState, useEffect, ReactNode } from 'react'
import OBR from '@owlbear-rodeo/sdk'

interface OBRReadyProps {
  children: ReactNode
}

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
