import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight, Leaf, ShieldCheck } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useAuth } from '../../context/AuthContext'

gsap.registerPlugin(ScrollTrigger)

// Fallback timeline metadata if manifest.json is loading or offline
const DEFAULT_TIMELINE = [
  {
    id: 'frame1-underground',
    index: 0,
    alt: 'Underground soil cross-section with glowing sprout and roots',
    desktop: { src: '/images/hero/frame1-underground.webp' },
    mobile: { src: '/images/hero/frame1-underground-mobile.webp' },
  },
  {
    id: 't1a-soil-breaking',
    index: 1,
    alt: 'Camera rising as sprout pushes near soil surface in morning sun',
    desktop: { src: '/images/hero/t1a-soil-breaking.webp' },
    mobile: { src: '/images/hero/t1a-soil-breaking-mobile.webp' },
  },
  {
    id: 't1b-ground-surface',
    index: 2,
    alt: 'Split cut-away showing soil roots below and garden above',
    desktop: { src: '/images/hero/t1b-ground-surface.webp' },
    mobile: { src: '/images/hero/t1b-ground-surface-mobile.webp' },
  },
  {
    id: 'frame2-garden',
    index: 3,
    alt: 'Lush Kerala vegetable garden with young plant centered against rolling hills',
    desktop: { src: '/images/hero/frame2-garden.webp' },
    mobile: { src: '/images/hero/frame2-garden-mobile.webp' },
  },
  {
    id: 't2a-garden-to-home',
    index: 4,
    alt: 'Rising through garden toward Kerala heritage home entrance',
    desktop: { src: '/images/hero/t2a-garden-to-home.webp' },
    mobile: { src: '/images/hero/t2a-garden-to-home-mobile.webp' },
  },
  {
    id: 't2b-home-approach',
    index: 5,
    alt: 'Approaching sunlit dining room with family seated at table',
    desktop: { src: '/images/hero/t2b-home-approach.webp' },
    mobile: { src: '/images/hero/t2b-home-approach-mobile.webp' },
  },
  {
    id: 'frame3-family',
    index: 6,
    alt: 'Kerala family of four enjoying a wholesome traditional Sadhya meal on banana leaves',
    desktop: { src: '/images/hero/frame3-family.webp' },
    mobile: { src: '/images/hero/frame3-family-mobile.webp' },
  },
]

export default function ParallaxHero() {
  const { user } = useAuth()
  const wrapperRef = useRef(null)
  const stageRef = useRef(null)
  const frameRefs = useRef([])
  const layerRefs = useRef({})
  const titleRef = useRef(null)
  const taglineRef = useRef(null)
  const scrollHintRef = useRef(null)
  const ctaOverlayRef = useRef(null)

  const [manifest, setManifest] = useState({ timeline: DEFAULT_TIMELINE })
  const [isReady, setIsReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // 1. Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // 2. Fetch manifest.json
  useEffect(() => {
    fetch('/images/hero/manifest.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.timeline?.length) {
          setManifest(data)
        }
      })
      .catch((err) => console.warn('Could not load hero manifest, using fallback:', err))
  }, [])

  // 3. Preload initial frames before initiating scroll experience
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const frame1Src = isMobile
      ? '/images/hero/frame1-underground-mobile.webp'
      : '/images/hero/frame1-underground.webp'
    const frame2Src = isMobile
      ? '/images/hero/t1a-soil-breaking-mobile.webp'
      : '/images/hero/t1a-soil-breaking.webp'

    let loadedCount = 0
    const onImgLoad = () => {
      loadedCount += 1
      if (loadedCount >= 2) {
        setIsReady(true)
      }
    }

    const img1 = new Image()
    img1.onload = onImgLoad
    img1.onerror = onImgLoad
    img1.src = frame1Src

    const img2 = new Image()
    img2.onload = onImgLoad
    img2.onerror = onImgLoad
    img2.src = frame2Src

    if (img1.complete) onImgLoad()
    if (img2.complete) onImgLoad()

    // Safety fallback: ensure isReady is true within 600ms regardless
    const safetyTimer = setTimeout(() => {
      setIsReady(true)
    }, 600)

    // Preload remaining frames in background after initial render
    const timer = setTimeout(() => {
      manifest.timeline.slice(2).forEach((frame) => {
        const bgImg = new Image()
        bgImg.src = isMobile ? frame.mobile.src : frame.desktop.src
      })
    }, 1200)

    return () => {
      clearTimeout(safetyTimer)
      clearTimeout(timer)
    }
  }, [manifest])

  // 4. GSAP + ScrollTrigger + Lenis Wiring
  useEffect(() => {
    if (!isReady || reducedMotion) return

    const wrapper = wrapperRef.current
    const stage = stageRef.current
    if (!wrapper || !stage) return

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // Let native momentum handle touch on mobile to prevent lag
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tickerCallback = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // GSAP Context for clean setup and tear down
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop & Tablet (width > 768px)
      mm.add('(min-width: 769px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom bottom',
            pin: stage,
            pinSpacing: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        buildTimelineAnimations(tl, {
          yShift: 12,
          scaleMax: 1.08,
          layerSpeed: 1.3,
        })
      })

      // Mobile (width <= 768px)
      mm.add('(max-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom bottom',
            pin: stage,
            pinSpacing: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        buildTimelineAnimations(tl, {
          yShift: 8,
          scaleMax: 1.05,
          layerSpeed: 1.15,
        })
      })

      function buildTimelineAnimations(tl, { yShift, scaleMax, layerSpeed }) {
        const frames = frameRefs.current.filter(Boolean)
        const total = frames.length

        // Initialize all frames: frame 0 visible, rest hidden
        frames.forEach((el, idx) => {
          gsap.set(el, {
            opacity: idx === 0 ? 1 : 0,
            yPercent: idx === 0 ? 0 : -yShift,
            scale: idx === 0 ? 1 : scaleMax,
            zIndex: idx,
            willChange: 'transform, opacity',
          })
        })

        // Initial text overlay positions
        if (titleRef.current) {
          gsap.set(titleRef.current, { yPercent: 0, opacity: 1 })
        }
        if (taglineRef.current) {
          gsap.set(taglineRef.current, { opacity: 1, y: 0 })
        }
        if (scrollHintRef.current) {
          gsap.set(scrollHintRef.current, { opacity: 1, y: 0 })
        }
        if (ctaOverlayRef.current) {
          gsap.set(ctaOverlayRef.current, { opacity: 0, yPercent: 20 })
        }

        // Fade out initial scroll hint quickly
        if (scrollHintRef.current) {
          tl.to(scrollHintRef.current, { opacity: 0, y: -10, duration: 0.08, ease: 'none' }, 0)
        }

        // Fade out tagline early
        if (taglineRef.current) {
          tl.to(taglineRef.current, { opacity: 0, y: -15, duration: 0.14, ease: 'none' }, 0.04)
        }

        // Title drifts up as camera rises through underground to garden
        if (titleRef.current) {
          tl.to(
            titleRef.current,
            {
              yPercent: -45,
              opacity: 0,
              duration: 0.38,
              ease: 'power1.inOut',
            },
            0.05
          )
        }

        // Spread timeline transitions across the 7 frames
        // Step duration: 1 / (total - 1)
        const step = 1 / (total - 1)

        for (let i = 0; i < total - 1; i++) {
          const startTime = i * step
          const outgoing = frames[i]
          const incoming = frames[i + 1]

          // Outgoing: opacity 1 -> 0 over second half, yPercent 0 -> +yShift, scale 1 -> scaleMax
          tl.to(
            outgoing,
            {
              opacity: 0,
              yPercent: yShift,
              scale: scaleMax,
              duration: step * 0.55,
              ease: 'none',
            },
            startTime + step * 0.45
          )

          // Incoming: opacity 0 -> 1 over first half, yPercent -yShift -> 0, scale scaleMax -> 1
          tl.to(
            incoming,
            {
              opacity: 1,
              yPercent: 0,
              scale: 1,
              duration: step * 0.55,
              ease: 'none',
            },
            startTime
          )
        }

        // Parallax Foreground Leaf Layers (move at 1.3x speed of the background)
        const f1L = layerRefs.current['f1-left']
        const f1R = layerRefs.current['f1-right']
        const f2L = layerRefs.current['f2-left']
        const f2R = layerRefs.current['f2-right']
        const f3L = layerRefs.current['f3-left']
        const f3R = layerRefs.current['f3-right']

        if (f1L && f1R) {
          tl.to([f1L, f1R], { yPercent: 25 * layerSpeed, opacity: 0, duration: step * 1.5, ease: 'none' }, 0)
        }

        if (f2L && f2R) {
          gsap.set([f2L, f2R], { opacity: 0, yPercent: -20 })
          tl.to([f2L, f2R], { opacity: 1, yPercent: 0, duration: step * 0.8, ease: 'none' }, step * 1.5)
          tl.to([f2L, f2R], { opacity: 0, yPercent: 25 * layerSpeed, duration: step * 1.2, ease: 'none' }, step * 2.8)
        }

        if (f3L && f3R) {
          gsap.set([f3L, f3R], { opacity: 0, yPercent: -15 })
          tl.to([f3L, f3R], { opacity: 1, yPercent: 0, duration: step * 1.2, ease: 'none' }, step * 4.2)
        }

        // Over Frame 3 (Family Feast): Fade up the final CTA overlay with soft gradient
        if (ctaOverlayRef.current) {
          tl.to(
            ctaOverlayRef.current,
            {
              opacity: 1,
              yPercent: 0,
              duration: step * 0.85,
              ease: 'power2.out',
            },
            step * 5.0
          )
        }
      }
    }, wrapper)

    // Handle window resize and orientation
    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      ctx.revert()
    }
  }, [isReady, reducedMotion, manifest])

  // ── PREFERS-REDUCED-MOTION FALLBACK ──
  if (reducedMotion) {
    return (
      <section className="relative w-full bg-[#F6F2EA] py-16 px-4 sm:px-8 space-y-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
            Family<span className="text-[#6BBF4E]">Fit</span>
          </h1>
          <p className="text-lg text-[#6B7A70]">Kerala’s flavors. Your family’s strength.</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E2DBD0]">
            <img
              src="/images/hero/frame1-underground.webp"
              alt="Underground sprout growing with roots"
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E2DBD0]">
            <img
              src="/images/hero/frame2-garden.webp"
              alt="Healthy vegetable garden with rolling hills"
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E2DBD0]">
            <img
              src="/images/hero/frame3-family.webp"
              alt="Kerala family of four enjoying a wholesome traditional Sadhya meal on banana leaves"
              className="w-full aspect-[16/9] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-center sm:text-left text-white">
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 font-['Plus_Jakarta_Sans']">
                Start eating healthier together.
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/login?mode=signup"
                  className="h-12 px-7 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg"
                >
                  <span>Get started</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white/90 hover:underline"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-[#F6F2EA] select-none"
      style={{
        height: '500svh', // 500svh on desktop (overridden in CSS for mobile)
      }}
      aria-label="Seed to plate visual journey"
    >
      {/* Skip to Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-[#3F5A3A] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xl outline-none focus:ring-2 focus:ring-[#6BBF4E]"
      >
        Skip to main content
      </a>

      {/* ── PINNED 100svh STAGE ── */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-[100svh] overflow-hidden bg-[#F6F2EA]"
      >
        {/* Loading Spinner State until initial frames load */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F6F2EA] gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5E4] flex items-center justify-center text-[#3F5A3A] animate-spin">
              <Leaf size={24} />
            </div>
            <span className="text-xs font-bold text-[#6B7A70] tracking-wider uppercase">
              Preparing your journey...
            </span>
          </div>
        )}

        {/* ── STACK OF 7 HERO TIMELINE FRAMES ── */}
        {manifest.timeline.map((frame, idx) => {
          const isFirst = idx === 0
          const isLast = idx === manifest.timeline.length - 1

          return (
            <div
              key={frame.id}
              ref={(el) => (frameRefs.current[idx] = el)}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                opacity: isFirst ? 1 : 0,
              }}
            >
              <picture className="w-full h-full block">
                <source
                  media="(max-width: 768px)"
                  srcSet={frame.mobile.src}
                  width={1080}
                  height={1920}
                />
                <img
                  src={frame.desktop.src}
                  alt={isLast ? frame.alt : ''}
                  loading={isFirst ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              </picture>
            </div>
          )
        })}

        {/* ── PARALLAX FOREGROUND LEAF CUT-OUT LAYERS (1.3x speed) ── */}
        {/* Frame 1 Corner Layers */}
        <div
          ref={(el) => (layerRefs.current['f1-left'] = el)}
          className="absolute inset-0 pointer-events-none z-20"
        >
          <img
            src="/images/hero/layers/layer-f1-left.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div
          ref={(el) => (layerRefs.current['f1-right'] = el)}
          className="absolute inset-0 pointer-events-none z-20"
        >
          <img
            src="/images/hero/layers/layer-f1-right.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Frame 2 Corner Layers */}
        <div
          ref={(el) => (layerRefs.current['f2-left'] = el)}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
        >
          <img
            src="/images/hero/layers/layer-f2-left.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div
          ref={(el) => (layerRefs.current['f2-right'] = el)}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
        >
          <img
            src="/images/hero/layers/layer-f2-right.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Frame 3 Corner Layers */}
        <div
          ref={(el) => (layerRefs.current['f3-left'] = el)}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
        >
          <img
            src="/images/hero/layers/layer-f3-left.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div
          ref={(el) => (layerRefs.current['f3-right'] = el)}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
        >
          <img
            src="/images/hero/layers/layer-f3-right.webp"
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ── HTML TEXT OVERLAYS ── */}
        {/* 1. Giant "FamilyFit" Title & Tagline (Starts centered at ~33% from top) */}
        <div
          ref={titleRef}
          className="absolute left-0 right-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          style={{
            top: '31%',
          }}
        >
          <h1
            className="font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] select-none"
            style={{
              fontSize: 'clamp(3.2rem, 9.5vw, 9.5rem)',
              lineHeight: 1,
              textShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
            }}
          >
            <span style={{ color: '#F6F2EA' }}>Family</span>
            <span style={{ color: '#6BBF4E' }}>Fit</span>
          </h1>

          <p
            ref={taglineRef}
            className="text-sm sm:text-xl lg:text-2xl font-bold text-white/95 mt-3 sm:mt-5 max-w-xl mx-auto tracking-wide"
            style={{
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.55)',
            }}
          >
            Kerala’s flavors. Your family’s strength.
          </p>
        </div>

        {/* 2. Scroll Hint Chevron at Bottom */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center justify-center text-white/90 text-xs font-bold tracking-widest uppercase pointer-events-none gap-1.5"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          <span>Scroll to explore</span>
          <ChevronDown size={18} className="animate-bounce" />
        </div>

        {/* 3. Final Call to Action Overlay (over frame3-family) */}
        <div
          ref={ctaOverlayRef}
          className="absolute inset-0 z-30 flex flex-col justify-end p-6 sm:p-12 lg:p-20 opacity-0 pointer-events-auto"
          style={{
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.5) 35%, rgba(0, 0, 0, 0) 70%)',
          }}
        >
          <div className="max-w-2xl text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold">
              <ShieldCheck size={14} className="text-[#6BBF4E]" />
              <span>Ayurvedic Nutrition for Every Generation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Plus_Jakarta_Sans'] leading-[1.12]">
              Start eating healthier together.
            </h2>

            <p className="text-sm sm:text-base text-white/80 max-w-lg leading-relaxed">
              Personalized Kerala meal plans, balanced nutrition for all ages, and allergen-safe family dining.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={user ? '/dashboard' : '/login?mode=signup'}
                className="h-12 sm:h-14 px-8 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white font-bold text-sm sm:text-base inline-flex items-center gap-2.5 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{user ? 'Go to dashboard' : 'Get started'}</span>
                <ArrowRight size={18} />
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="h-12 sm:h-14 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base inline-flex items-center backdrop-blur-md transition-all cursor-pointer"
                >
                  I already have an account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Height Styling */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Seed to plate visual journey"] {
            height: 400svh !important;
          }
        }
      `}</style>
    </section>
  )
}
