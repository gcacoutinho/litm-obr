import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { OBRReady } from './components/OBRReady.tsx'
import './style.css'
import './i18n' // Initialize i18n before rendering

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <OBRReady>
      <App />
    </OBRReady>
  </React.StrictMode>,
)
