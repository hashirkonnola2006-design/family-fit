import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
})

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Permanently remove dark mode DOM attributes and local storage keys
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    try {
      localStorage.removeItem('familyfit_theme')
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, toggleTheme: () => {}, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
