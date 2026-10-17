import { useEffect } from 'react'
import LandingNav from '../components/landing/LandingNav'
import ParallaxHero from '../components/landing/ParallaxHero'
import LandingTrustStrip from '../components/landing/LandingTrustStrip'
import LandingHowItWorks from '../components/landing/LandingHowItWorks'
import LandingFeaturesGrid from '../components/landing/LandingFeaturesGrid'
import LandingProductPreview from '../components/landing/LandingProductPreview'
import LandingCuratedPlans from '../components/landing/LandingCuratedPlans'
import LandingTestimonials from '../components/landing/LandingTestimonials'
import LandingFinalCTA from '../components/landing/LandingFinalCTA'
import Footer from '../components/Footer'

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div 
      className="ff-landing-root min-h-screen w-full selection:bg-[#6BBF4E]/30 selection:text-[#3F5A3A] font-['Plus_Jakarta_Sans'] overflow-x-hidden"
      style={{ backgroundColor: '#F6F2EA', color: '#1F2A24' }}
    >
      {/* 1. Sticky Navigation */}
      <LandingNav />

      {/* 2. Parallax 'Seed to Plate' Scroll-Driven Hero */}
      <ParallaxHero />

      {/* Main Content Area (Accessible Skip Target) */}
      <main id="main-content">
        {/* 3. Trust Strip */}
        <LandingTrustStrip />

      {/* 4. How It Works (3 Steps) */}
      <LandingHowItWorks />

      {/* 5. Features Grid (6 Cards) */}
      <LandingFeaturesGrid />

      {/* 6. Product Preview (Browser Mockup with Recipe & Grocery) */}
      <LandingProductPreview />

      {/* 7. Curated Kerala Plans (Weight, Immunity, Heart) */}
      <LandingCuratedPlans />

      {/* 8. Testimonials (3 Realistic Kerala Stories) */}
      <LandingTestimonials />

      {/* 9. Final CTA Band (Deep Olive Green) */}
      <LandingFinalCTA />
      </main>

      {/* 10. Minimal Footer */}
      <Footer />
    </div>
  )
}
