import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
import HomePage     from './pages/HomePage'
import PlansPage    from './pages/PlansPage'
import RecipesPage  from './pages/RecipesPage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage  from './pages/ProfilePage'
import AuthPage     from './pages/AuthPage'

import RecipeDetailPage from './pages/RecipeDetailPage'

/** Protected route — redirects to /auth if no JWT found */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />
  return user ? children : <Navigate to="/auth" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/"        element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/plans"   element={<PrivateRoute><PlansPage /></PrivateRoute>} />
      <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
      <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetailPage /></PrivateRoute>} />
      <Route path="/progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FamilyProvider>
            <AppRoutes />
          </FamilyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
