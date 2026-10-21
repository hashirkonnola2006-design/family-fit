import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that instantly resets the window scroll position
 * to (0, 0) whenever route, search params, or navigation key changes.
 *
 * Prevents the browser's automatic scroll restoration from restoring
 * previous bottom scroll offsets and disables CSS smooth scrolling
 * temporarily during navigation so the page jumps to top immediately.
 */
export default function ScrollToTop() {
  const location = useLocation()

  // Prevent browser from automatically restoring previous scroll offset
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const resetScroll = () => {
      const root = document.documentElement
      const prevBehavior = root ? root.style.scrollBehavior : ''
      if (root) root.style.scrollBehavior = 'auto'

      window.scrollTo(0, 0)
      if (document.documentElement) document.documentElement.scrollTop = 0
      if (document.body) document.body.scrollTop = 0

      // Restore scroll behavior after paint
      requestAnimationFrame(() => {
        if (root) root.style.scrollBehavior = prevBehavior
      })
    }

    resetScroll()

    // Run again on RAF and a quick timeout to catch async mounts and layout shifts
    const rafId = requestAnimationFrame(resetScroll)
    const timerId = setTimeout(resetScroll, 20)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timerId)
    }
  }, [location.pathname, location.search, location.hash, location.key])

  return null
}
