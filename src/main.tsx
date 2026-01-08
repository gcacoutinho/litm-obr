import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { OBRReady } from './components/OBRReady.tsx'
import './style.css'
import './i18n' // Initialize i18n before rendering

type Root = ReturnType<typeof ReactDOM.createRoot>

const rootElement: HTMLElement | null = document.getElementById('root')
const root: Root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(
  <React.StrictMode>
    <OBRReady>
      <App />
    </OBRReady>
  </React.StrictMode>,
)
