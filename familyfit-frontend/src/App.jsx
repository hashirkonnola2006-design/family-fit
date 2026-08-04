import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
import { GroceryProvider } from './context/GroceryContext'
import { ThemeProvider } from './context/ThemeContext'

import HomePage     from './pages/HomePage'
import RecipesPage  from './pages/RecipesPage'
import GroceryPage  from './pages/GroceryPage'
import TipsPage     from './pages/TipsPage'
import ProfilePage  from './pages/ProfilePage'
import AuthPage     from './pages/AuthPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import OnboardingPage   from './pages/OnboardingPage'
import ResponsiveLayout from './components/ResponsiveLayout'

/** Protected route — redirects to /auth if no JWT found */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />
  return user ? <ResponsiveLayout>{children}</ResponsiveLayout> : <Navigate to="/auth" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
      <Route path="/"        element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/plans"   element={<Navigate to="/recipes" replace />} />
      <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
      <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetailPage /></PrivateRoute>} />
      <Route path="/grocery" element={<PrivateRoute><GroceryPage /></PrivateRoute>} />
      <Route path="/tips"     element={<PrivateRoute><TipsPage /></PrivateRoute>} />
      <Route path="/progress" element={<Navigate to="/tips" replace />} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FamilyProvider>
            <GroceryProvider>
              <AppRoutes />
            </GroceryProvider>
          </FamilyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
