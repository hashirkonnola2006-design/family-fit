import { useTheme } from '../context/ThemeContext'

export default function ResponsiveLayout({ children }) {
  const { isDark } = useTheme()

  return (
    <div className="layout-root">
      {/* ── RESPONSIVE VIEWPORT CONTAINER ── */}
      <div className="layout-content-wrapper">
        {children}
      </div>

      {/* Inject styling rules specifically for responsive layout */}
      <style dangerouslySetInnerHTML={{ __html: `
          .layout-root {
            width: 100%;
            min-height: 100vh;
          }

          .layout-content-wrapper {
            width: 100%;
            margin: 0 auto;
          }

          @media (min-width: 1024px) {
            .layout-root {
              display: block;
              background-color: ${isDark ? '#0A0F1D' : '#FAFAF7'};
            }

            .desktop-sidebar {
              display: none !important;
            }

            /* Content area fills all space full width */
            .layout-content-wrapper {
              margin-left: 0 !important;
              width: 100% !important;
              min-height: 100vh;
              padding: 0 !important;
              box-sizing: border-box;
              background-color: ${isDark ? '#0A0F1D' : '#FAFAF7'};
            }

            /*
             * Override the mobile-only 430px max-width cap on .app-container
             * so page content fills the full desktop canvas.
             */
            .layout-content-wrapper .app-container,
            .layout-content-wrapper .page-responsive-container {
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 !important;
              padding-bottom: 0 !important;
            }

            /* Also let direct page divs stretch full width */
            .layout-content-wrapper > div {
              max-width: 100% !important;
              width: 100% !important;
            }

            /* Remove bottom padding reserved for mobile nav dock */
            .layout-content-wrapper .page {
              padding-bottom: 24px !important;
            }

            /* Hide mobile bottom navigation dock on desktop */
            nav[style*="position: 'fixed'"], nav[style*="position: fixed"] {
              display: none !important;
            }
          }
        `}} />
    </div>
  )
}
