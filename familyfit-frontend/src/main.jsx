import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Silent wake-up and keep-alive ping to backend health endpoint (pre-warm on load + 4-min heartbeat)
const rawApiUrl = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://family-fit.onrender.com' : '')
).replace(/\/+$/, '')

if (typeof window !== 'undefined') {
  const pingBackend = () => {
    try {
      const healthUrl = rawApiUrl ? `${rawApiUrl}/healthz` : '/healthz'
      fetch(healthUrl, { method: 'GET', mode: 'cors', credentials: 'omit' }).catch(() => {})
    } catch (_) {}
  }

  // Immediate pre-warm ping on initial load
  pingBackend()

  // Heartbeat ping every 4 minutes while browser session is active (Render sleeps at 15m)
  setInterval(pingBackend, 4 * 60 * 1000)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
