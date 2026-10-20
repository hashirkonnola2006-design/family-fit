import React from 'react'
import { RotateCcw, Home } from 'lucide-react'
import { Logo } from './brand/Logo'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('FamilyFit caught an unhandled application error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8F6EF',
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            padding: '24px',
            color: '#1A2E22',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E3E0D3',
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: '0 12px 32px rgba(31,93,58,0.08)',
            }}
          >
            {/* Pulsing Brand Mark (disabled for prefers-reduced-motion) */}
            <div className="mb-5 inline-flex items-center justify-center">
              <Logo variant="mark" tone="color" height={52} className="animate-pulse motion-reduce:animate-none" />
            </div>

            <h2
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#1A2E22',
                margin: '0 0 10px 0',
                letterSpacing: '-0.3px',
              }}
            >
              Something went slightly off track
            </h2>

            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.55',
                color: '#4F6355',
                margin: '0 0 28px 0',
              }}
            >
              Don't worry — your family meal plans and saved recipes are completely safe.
              You can return to the dashboard or refresh to continue smoothly.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1F5D3A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  boxShadow: '0 4px 12px rgba(31,93,58,0.25)',
                }}
              >
                <Home size={16} />
                <span>Return to Dashboard</span>
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#EAF3EC',
                  color: '#1F5D3A',
                  border: '1px solid #D5E7DA',
                  borderRadius: '9999px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
            </div>

            {/* Subtle debug info toggle in dev environment */}
            {import.meta.env?.DEV && this.state.error && (
              <details
                style={{
                  marginTop: '24px',
                  textAlign: 'left',
                  fontSize: '11px',
                  color: '#718096',
                  backgroundColor: '#FAFAF7',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #EDEFEA',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontWeight: 600, color: '#DC2626' }}>
                  Technical error details
                </summary>
                <pre
                  style={{
                    marginTop: '8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontSize: '10.5px',
                    color: '#991B1B',
                  }}
                >
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
