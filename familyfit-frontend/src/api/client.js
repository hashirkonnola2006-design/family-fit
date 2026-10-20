import axios from 'axios'

// Read backend URL from environment variable (VITE_API_URL), defaulting to empty string in local dev
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

// Active request tracking & 3-second cold-start timer
// ONLY tracked for actions where the user is actively waiting on the server (auth, mutations, or explicit requests)
let activeWakingRequestsCount = 0
let wakingTimer = null
let isCurrentlyWaking = false
const wakingListeners = new Set()

export function subscribeServerWaking(listener) {
  wakingListeners.add(listener)
  listener(isCurrentlyWaking)
  return () => wakingListeners.delete(listener)
}

export function dismissServerWaking() {
  setWakingState(false)
}

function setWakingState(waking) {
  if (isCurrentlyWaking !== waking) {
    isCurrentlyWaking = waking
    wakingListeners.forEach((listener) => {
      try {
        listener(waking)
      } catch (err) {
        console.error('Error in server waking listener:', err)
      }
    })
  }
}

/**
 * Determines whether a request should display the "Waking up the server" banner.
 * - TRUE: User-blocking actions (Login, Register, Signup, Password reset, and mutating POST/PUT/PATCH/DELETE actions)
 * - FALSE: Passive background GET queries (loading cached meals, family strip, background polls)
 */
function isWakingCandidate(config) {
  if (!config) return false
  if (config.notifyColdStart === false) return false
  if (config.notifyColdStart === true) return true

  const url = (config.url || '').toLowerCase()
  const method = (config.method || 'get').toLowerCase()

  // 1. Authentication operations (user is actively waiting to sign in / register)
  if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/signup')) {
    return true
  }

  // 2. User-initiated state changes (POST / PUT / PATCH / DELETE)
  if (method !== 'get' && method !== 'head' && method !== 'options') {
    return true
  }

  // 3. Passive background GET requests should NOT show the floating notification banner
  return false
}

function onRequestStarted(config) {
  if (!isWakingCandidate(config)) {
    return
  }

  // Tag request so onRequestFinished knows it was tracked
  config._tracksWaking = true

  // If this is an auto-retry iteration of an already tracked request, keep the counter as-is
  if (config._isRetryAttempt) {
    return
  }

  activeWakingRequestsCount++
  if (activeWakingRequestsCount === 1) {
    if (wakingTimer) clearTimeout(wakingTimer)
    wakingTimer = setTimeout(() => {
      if (activeWakingRequestsCount > 0) {
        setWakingState(true)
      }
    }, 3000)
  }
}

function onRequestFinished(config) {
  if (!config?._tracksWaking) {
    return
  }

  activeWakingRequestsCount = Math.max(0, activeWakingRequestsCount - 1)
  if (activeWakingRequestsCount === 0) {
    if (wakingTimer) {
      clearTimeout(wakingTimer)
      wakingTimer = null
    }
    setWakingState(false)
  }
}

const client = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor: track in-flight candidate requests & attach JWT access token
client.interceptors.request.use(
  (config) => {
    onRequestStarted(config)

    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    onRequestFinished(error?.config)
    return Promise.reject(error)
  }
)

// Response interceptor: handle cold-start retries, HTML fallback rewrites, and 401 refresh
client.interceptors.response.use(
  (response) => {
    onRequestFinished(response?.config)

    // If Vercel returned index.html for API route rewrite
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html')) {
      return Promise.reject(new Error('API Endpoint unavailable (HTML fallback response)'))
    }
    return response
  },
  async (error) => {
    const config = error.config

    // Detect if failure was caused by a cold start
    const status = error.response?.status
    const isColdStartNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (error.message && error.message.toLowerCase().includes('network error')) ||
      (error.message && error.message.toLowerCase().includes('timeout')) ||
      [502, 503, 504].includes(status)

    // Automatic retry: up to 3 attempts, 5 seconds apart for cold-start failures
    if (config && isColdStartNetworkError && config._tracksWaking) {
      config._coldStartRetryCount = (config._coldStartRetryCount || 0) + 1

      if (config._coldStartRetryCount <= 3) {
        console.warn(
          `[FamilyFit] Cold start detected. Retrying request (${config._coldStartRetryCount}/3) in 5s...`
        )
        config._isRetryAttempt = true
        // Keep request active while waiting so waking message stays visible during active wait
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return client(config)
      }
    }

    // 401 / 403 Access Token refresh handler
    if ((status === 401 || status === 403) && config && !config._authRetry) {
      config._authRetry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken && !refreshToken.startsWith('demo-')) {
        try {
          const { data } = await client.post('/auth/refresh', { refreshToken }, { notifyColdStart: false })
          if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken)
            config.headers.Authorization = `Bearer ${data.accessToken}`
            config._isRetryAttempt = true
            return client(config)
          }
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } else {
        localStorage.removeItem('accessToken')
      }
    }

    // Request finished on terminal failure
    onRequestFinished(config)
    return Promise.reject(error)
  }
)

export default client
