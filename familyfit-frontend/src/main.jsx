import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Silent wake-up ping to backend health endpoint on initial app load (before login)
const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
if (typeof window !== 'undefined') {
  try {
    const healthUrl = rawApiUrl ? `${rawApiUrl}/health` : '/health'
    fetch(healthUrl, { method: 'GET', mode: 'cors', credentials: 'omit' }).catch(() => {})
  } catch (_) {
    // Silently ignore ping errors
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
