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
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '2rem', fontSize: '1.2rem' }}>Initializing Misty Rodeo</p>
      </div>
    )
  }

  return <>{children}</>
}
