import React from 'react'
import ReactDOM from 'react-dom/client'
import OBR from '@owlbear-rodeo/sdk'
import App from './App.tsx'
import './style.css'

OBR.onReady(() => {
  console.log('[litm-obr] OBR SDK ready, initializing app')
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})