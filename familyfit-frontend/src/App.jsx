import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
import { GroceryProvider } from './context/GroceryContext'
import { ThemeProvider } from './context/ThemeContext'

import Dashboard   from './pages/Dashboard'
import RecipesPage  from './pages/RecipesPage'
import GroceryPage  from './pages/GroceryPage'
import TipsPage     from './pages/TipsPage'
import ProfilePage  from './pages/ProfilePage'
import AuthPage     from './pages/AuthPage'
import LandingPage  from './pages/LandingPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import OnboardingPage   from './pages/OnboardingPage'
import AboutPage        from './pages/AboutPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import BrandShowcase from './pages/BrandShowcase'
import ResponsiveLayout from './components/ResponsiveLayout'
import ErrorBoundary from './components/ErrorBoundary'
import ServerWakingBanner from './components/common/ServerWakingBanner'
import { Logo } from './components/brand/Logo'

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F6EF] text-[#1A2E22] select-none p-6">
      <Logo variant="mark" tone="color" height={54} className="animate-pulse motion-reduce:animate-none" />
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#4F6355]">
        Loading FamilyFit...
      </p>
    </div>
  )
}

/** Protected route — redirects to /login if no JWT found */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? <ResponsiveLayout>{children}</ResponsiveLayout> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Landing Route ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Brand System Verification Showcase ── */}
      <Route path="/brand-showcase" element={<BrandShowcase />} />

      {/* ── Auth Routes ── */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />

      {/* ── Protected Application Dashboard ── */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
      <Route path="/plans"   element={<Navigate to="/recipes" replace />} />
      <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
      <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetailPage /></PrivateRoute>} />
      <Route path="/grocery" element={<PrivateRoute><GroceryPage /></PrivateRoute>} />
      <Route path="/tips"     element={<PrivateRoute><TipsPage /></PrivateRoute>} />
      <Route path="/progress" element={<Navigate to="/tips" replace />} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/about"   element={<PrivateRoute><AboutPage /></PrivateRoute>} />

      {/* ── Legal & Policies ── */}
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms"   element={<TermsConditionsPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <FamilyProvider>
              <GroceryProvider>
                <ErrorBoundary>
                  <ServerWakingBanner />
                  <AppRoutes />
                </ErrorBoundary>
              </GroceryProvider>
            </FamilyProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
